import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import {
  getAllEmployeeTasks,
  getAllEmployees,
  getAllLeaveRequests,
  getAllShifts,
} from "../../api/staffApi";

const EMPTY_FORM = {
  operationType: "",
  operationDate: "",
  expectedGuests: "",
  servicePeriod: "",
};

const PERIODS = {
  MORNING: {
    label: "Morning",
    startTime: "06:00",
    endTime: "12:00",
  },
  AFTERNOON: {
    label: "Afternoon",
    startTime: "12:00",
    endTime: "17:00",
  },
  EVENING: {
    label: "Evening",
    startTime: "17:00",
    endTime: "23:00",
  },
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    "An unexpected server error occurred."
  );
}

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeTime(value) {
  return String(value || "").slice(0, 5);
}

function periodsOverlap(
  firstStart,
  firstEnd,
  secondStart,
  secondEnd,
) {
  return firstStart < secondEnd && firstEnd > secondStart;
}

function isDateWithinRange(date, startDate, endDate) {
  return (
    date &&
    startDate &&
    endDate &&
    date >= startDate &&
    date <= endDate
  );
}

function calculateRequiredStaff(operationType, guestCount) {
  const guests = Number(guestCount);

  if (!guests || guests < 1) {
    return 0;
  }

  if (operationType === "EVENT") {
    return Math.max(2, Math.ceil(guests / 10));
  }

  return Math.max(1, Math.ceil(guests / 15));
}

export default function StaffAllocationPage() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        employeeData,
        shiftData,
        taskData,
        leaveData,
      ] = await Promise.all([
        getAllEmployees(),
        getAllShifts(),
        getAllEmployeeTasks(),
        getAllLeaveRequests(),
      ]);

      setEmployees(
        Array.isArray(employeeData) ? employeeData : [],
      );

      setShifts(
        Array.isArray(shiftData) ? shiftData : [],
      );

      setTasks(
        Array.isArray(taskData) ? taskData : [],
      );

      setLeaveRequests(
        Array.isArray(leaveData) ? leaveData : [],
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const activeEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.employmentStatus?.toUpperCase() ===
          "ACTIVE",
      ),
    [employees],
  );

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setRecommendation(null);
  }

  function clearForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setRecommendation(null);
    setError("");
  }

  function prepareRecommendation(event) {
    event.preventDefault();

    const validationErrors = {};

    if (!form.operationType) {
      validationErrors.operationType =
        "Select an operation type.";
    }

    if (!form.operationDate) {
      validationErrors.operationDate =
        "Select the operation date.";
    }

    if (!form.expectedGuests) {
      validationErrors.expectedGuests =
        "Enter the expected guest count.";
    } else if (Number(form.expectedGuests) < 1) {
      validationErrors.expectedGuests =
        "Expected guest count must be at least 1.";
    }

    if (!form.servicePeriod) {
      validationErrors.servicePeriod =
        "Select a service period.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const period = PERIODS[form.servicePeriod];

    const approvedLeaveEmployeeIds = new Set(
      leaveRequests
        .filter(
          (request) =>
            request.requestStatus?.toUpperCase() ===
              "APPROVED" &&
            isDateWithinRange(
              form.operationDate,
              request.startDate,
              request.endDate,
            ),
        )
        .map((request) => request.employeeId),
    );

    const conflictingShiftEmployeeIds = new Set(
      shifts
        .filter((shift) => {
          if (shift.shiftDate !== form.operationDate) {
            return false;
          }

          if (
            shift.shiftStatus?.toUpperCase() === "CANCELLED"
          ) {
            return false;
          }

          return periodsOverlap(
            normalizeTime(shift.startTime),
            normalizeTime(shift.endTime),
            period.startTime,
            period.endTime,
          );
        })
        .map((shift) => shift.employeeId),
    );

    const openTaskCounts = tasks.reduce(
      (counts, task) => {
        if (
          task.taskStatus?.toUpperCase() !== "COMPLETED"
        ) {
          counts[task.employeeId] =
            (counts[task.employeeId] || 0) + 1;
        }

        return counts;
      },
      {},
    );

    const eligibleEmployees = activeEmployees
      .filter(
        (employee) =>
          !approvedLeaveEmployeeIds.has(
            employee.employeeId,
          ) &&
          !conflictingShiftEmployeeIds.has(
            employee.employeeId,
          ),
      )
      .map((employee) => ({
        ...employee,
        openTaskCount:
          openTaskCounts[employee.employeeId] || 0,
      }))
      .sort((first, second) => {
        const taskDifference =
          first.openTaskCount - second.openTaskCount;

        if (taskDifference !== 0) {
          return taskDifference;
        }

        return String(first.firstName).localeCompare(
          String(second.firstName),
        );
      });

    const requiredStaff = calculateRequiredStaff(
      form.operationType,
      form.expectedGuests,
    );

    const recommendedEmployees = eligibleEmployees.slice(
      0,
      requiredStaff,
    );

    setRecommendation({
      requiredStaff,
      eligibleEmployees,
      recommendedEmployees,
      approvedLeaveCount:
        approvedLeaveEmployeeIds.size,
      conflictingShiftCount:
        conflictingShiftEmployeeIds.size,
      shortage: Math.max(
        0,
        requiredStaff - recommendedEmployees.length,
      ),
    });
  }

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Management & Allocation
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Staff allocation recommendations
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Generate explainable staffing suggestions using
            operational demand and current workforce records.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh Data
        </button>
      </section>

      {error && (
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <h2 className="font-semibold text-red-900">
                Workforce data could not be loaded
              </h2>

              <p className="mt-1 text-sm text-red-800">
                {error}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Rule-based recommendation
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Recommendations are calculated from active
              employees, existing shifts, open assignments and
              approved leave. They are not stored allocations and
              do not automatically create shifts or assignments.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Active Staff"
          value={loading ? "…" : activeEmployees.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Shift Records"
          value={loading ? "…" : shifts.length}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved Leave"
          value={
            loading
              ? "…"
              : leaveRequests.filter(
                  (request) =>
                    request.requestStatus?.toUpperCase() ===
                    "APPROVED",
                ).length
          }
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <WandSparkles className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Prepare allocation recommendation
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Enter operational demand to identify currently
              eligible staff members.
            </p>
          </div>
        </div>

        <form
          onSubmit={prepareRecommendation}
          className="mt-7"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <FormField
              label="Operation Type"
              error={errors.operationType}
            >
              <select
                name="operationType"
                value={form.operationType}
                onChange={updateForm}
                className="form-control"
              >
                <option value="">
                  Select operation type
                </option>
                <option value="RESTAURANT">
                  Restaurant Service
                </option>
                <option value="EVENT">
                  Event Operation
                </option>
              </select>
            </FormField>

            <FormField
              label="Operation Date"
              error={errors.operationDate}
            >
              <input
                name="operationDate"
                type="date"
                min={getToday()}
                value={form.operationDate}
                onChange={updateForm}
                className="form-control"
              />
            </FormField>

            <FormField
              label="Expected Guests"
              error={errors.expectedGuests}
            >
              <input
                name="expectedGuests"
                type="number"
                min="1"
                value={form.expectedGuests}
                onChange={updateForm}
                placeholder="Enter guest count"
                className="form-control"
              />
            </FormField>

            <FormField
              label="Service Period"
              error={errors.servicePeriod}
            >
              <select
                name="servicePeriod"
                value={form.servicePeriod}
                onChange={updateForm}
                className="form-control"
              >
                <option value="">
                  Select service period
                </option>

                {Object.entries(PERIODS).map(
                  ([value, period]) => (
                    <option key={value} value={value}>
                      {period.label} ({period.startTime}–
                      {period.endTime})
                    </option>
                  ),
                )}
              </select>
            </FormField>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              Generate Recommendation
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {recommendation && (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ResultCard
              label="Required Staff"
              value={recommendation.requiredStaff}
            />

            <ResultCard
              label="Eligible Staff"
              value={
                recommendation.eligibleEmployees.length
              }
            />

            <ResultCard
              label="On Approved Leave"
              value={recommendation.approvedLeaveCount}
            />

            <ResultCard
              label="Shift Conflicts"
              value={
                recommendation.conflictingShiftCount
              }
            />
          </section>

          {recommendation.shortage > 0 && (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700" />

                <div>
                  <h2 className="font-semibold text-amber-900">
                    Staffing shortage identified
                  </h2>

                  <p className="mt-1 text-sm text-amber-800">
                    The current workforce records are short by{" "}
                    <strong>
                      {recommendation.shortage}
                    </strong>{" "}
                    staff member
                    {recommendation.shortage === 1
                      ? ""
                      : "s"}{" "}
                    for this recommendation.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-primary-950">
                Recommended staff
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Active employees without approved leave or an
                overlapping shift, ordered by the fewest open
                assignments.
              </p>
            </div>

            {recommendation.recommendedEmployees.length ===
            0 ? (
              <div className="px-6 py-14 text-center">
                <Users className="mx-auto h-8 w-8 text-stone-400" />

                <h3 className="mt-4 font-semibold text-primary-950">
                  No eligible staff available
                </h3>

                <p className="mt-2 text-sm text-stone-600">
                  Review existing shifts, approved leave and
                  employee availability.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {recommendation.recommendedEmployees.map(
                  (employee, index) => (
                    <div
                      key={employee.employeeId}
                      className="grid gap-4 p-6 md:grid-cols-[70px_1.5fr_1fr_1fr] md:items-center"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 font-bold text-primary-800">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-primary-950">
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Employee #{employee.employeeId}
                        </p>
                      </div>

                      <DataField
                        label="Role"
                        value={formatLabel(employee.role)}
                      />

                      <DataField
                        label="Reason"
                        value={
                          employee.openTaskCount === 0
                            ? "No open assignments"
                            : `${employee.openTaskCount} open assignment${
                                employee.openTaskCount === 1
                                  ? ""
                                  : "s"
                              }`
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
            <h2 className="font-semibold text-primary-950">
              Recommendation explanation
            </h2>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-700">
              <li>
                • Restaurant staffing uses approximately one
                employee per 15 guests.
              </li>

              <li>
                • Event staffing uses approximately one employee
                per 10 guests, with a minimum of two employees.
              </li>

              <li>
                • Inactive employees and employees on approved
                leave are excluded.
              </li>

              <li>
                • Employees with an overlapping shift are excluded
                to avoid double allocation.
              </li>

              <li>
                • Eligible employees with fewer open assignments
                are recommended first.
              </li>
            </ul>
          </section>
        </>
      )}

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Allocation
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          The recommendation supports an HR decision
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Estimate Demand"
            text="Guest count and operation type determine the estimated staffing requirement."
          />

          <FlowStep
            number="02"
            title="Check Leave"
            text="Employees on approved leave during the selected date are excluded."
          />

          <FlowStep
            number="03"
            title="Check Workload"
            text="Existing shifts and open assignments are considered."
          />

          <FlowStep
            number="04"
            title="Manager Review"
            text="HR reviews the suggestion before creating shifts or assignments."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gold-200 bg-gold-50 p-5">
      <p className="text-sm font-medium text-stone-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-primary-950">
        {label}
      </span>

      <div className="mt-2 [&_.form-control]:w-full [&_.form-control]:rounded-xl [&_.form-control]:border [&_.form-control]:border-stone-300 [&_.form-control]:bg-white [&_.form-control]:px-4 [&_.form-control]:py-3 [&_.form-control]:text-sm [&_.form-control]:outline-none [&_.form-control]:transition focus-within:[&_.form-control]:border-primary-600">
        {children}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-primary-950">
        {value || "—"}
      </p>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div>
      <p className="text-sm font-bold text-gold-400">
        {number}
      </p>

      <h3 className="mt-2 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
}