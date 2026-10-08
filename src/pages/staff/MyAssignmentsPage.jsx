import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ListChecks,
  RefreshCw,
} from "lucide-react";

import {
  getCurrentEmployee,
  getEmployeeTasks,
} from "../../api/staffApi";

export default function MyAssignmentsPage() {
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const filteredAssignments = useMemo(() => {
    if (statusFilter === "ALL") {
      return assignments;
    }

    return assignments.filter(
      (assignment) =>
        assignment.taskStatus?.toUpperCase() ===
        statusFilter,
    );
  }, [assignments, statusFilter]);

  const pendingCount = assignments.filter(
    (assignment) =>
      assignment.taskStatus?.toUpperCase() ===
      "PENDING",
  ).length;

  const completedCount = assignments.filter(
    (assignment) =>
      assignment.taskStatus?.toUpperCase() ===
      "COMPLETED",
  ).length;

  const overdueCount = assignments.filter(
    (assignment) => assignment.overdue,
  ).length;

  async function loadAssignments() {
    setLoading(true);
    setErrorMessage("");

    try {
      const currentEmployee =
        await getCurrentEmployee();

      const employeeAssignments =
        await getEmployeeTasks(
          currentEmployee.employeeId,
        );

      setEmployee(currentEmployee);
      setAssignments(employeeAssignments);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to load your assignments.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getCurrentEmployee()
      .then(async (currentEmployee) => {
        const employeeAssignments =
          await getEmployeeTasks(
            currentEmployee.employeeId,
          );

        if (!cancelled) {
          setEmployee(currentEmployee);
          setAssignments(employeeAssignments);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message ??
              "Unable to load your assignments.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Self-Service
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            My assignments
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review the operational and event tasks assigned
            to you.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAssignments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={ListChecks}
          label="Total Assignments"
          value={assignments.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Pending"
          value={pendingCount}
        />

        <SummaryCard
          icon={ListChecks}
          label="Completed"
          value={completedCount}
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Overdue"
          value={overdueCount}
          warning={overdueCount > 0}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-950">
              Employee
            </p>

            <p className="mt-1 text-sm text-stone-600">
              {employee?.fullName ?? "Loading employee..."}
              {employee?.employeeId
                ? ` · Employee #${employee.employeeId}`
                : ""}
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-primary-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="COMPLETED">
              Completed
            </option>
            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Assignment records
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Showing {filteredAssignments.length} of{" "}
            {assignments.length} personal assignments.
          </p>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Task</span>
          <span>Event</span>
          <span>Assigned Date</span>
          <span>Due Date</span>
          <span>Status</span>
          <span>Schedule</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading your assignments...
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <ListChecks className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No assignments found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No personal assignments match the selected
              status.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredAssignments.map((assignment) => (
              <article
                key={assignment.taskId}
                className="grid gap-4 px-6 py-5 xl:grid-cols-6 xl:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {assignment.taskDescription}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Task #{assignment.taskId}
                  </p>
                </div>

                <DataValue
                  label="Event"
                  value={
                    assignment.eventName ??
                    "General Assignment"
                  }
                />

                <DataValue
                  label="Assigned Date"
                  value={formatDate(
                    assignment.assignedDate,
                  )}
                />

                <DataValue
                  label="Due Date"
                  value={formatDate(
                    assignment.dueDate,
                  )}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
                    Status
                  </p>

                  <StatusBadge
                    status={assignment.taskStatus}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
                    Schedule
                  </p>

                  {assignment.overdue ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      On Schedule
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Assignment changes
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-700">
          Assignments are created and maintained by the HR
          Manager. Contact HR if an assignment contains
          incorrect information or cannot be completed by
          its due date.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  warning = false,
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 ${
        warning
          ? "border-red-200"
          : "border-stone-200"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${
          warning
            ? "text-red-600"
            : "text-primary-700"
        }`}
      />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function DataValue({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
        {label}
      </p>

      <p className="mt-1 text-sm text-stone-700 xl:mt-0">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() ?? "UNKNOWN";

  const styles = {
    PENDING:
      "bg-amber-100 text-amber-700",
    IN_PROGRESS:
      "bg-blue-100 text-blue-700",
    COMPLETED:
      "bg-emerald-100 text-emerald-700",
    CANCELLED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalizedStatus] ??
        "bg-stone-100 text-stone-700"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatLabel(value) {
  return String(value)
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}