import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  createLeaveRequest,
  getCurrentEmployee,
  getEmployeeLeaveRequests,
} from "../../api/staffApi";

const EMPTY_FORM = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function MyLeavePage() {
  const [employee, setEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] =
    useState([]);
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [formData, setFormData] =
    useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const filteredRequests = useMemo(() => {
    if (statusFilter === "ALL") {
      return leaveRequests;
    }

    return leaveRequests.filter(
      (request) =>
        request.requestStatus?.toUpperCase() ===
        statusFilter,
    );
  }, [leaveRequests, statusFilter]);

  const pendingCount = countStatus(
    leaveRequests,
    "PENDING",
  );
  const approvedCount = countStatus(
    leaveRequests,
    "APPROVED",
  );
  const rejectedCount = countStatus(
    leaveRequests,
    "REJECTED",
  );

  async function loadLeaveRequests() {
    setLoading(true);
    setErrorMessage("");

    try {
      const currentEmployee =
        await getCurrentEmployee();

      const requests =
        await getEmployeeLeaveRequests(
          currentEmployee.employeeId,
        );

      setEmployee(currentEmployee);
      setLeaveRequests(requests);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to load your leave requests.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getCurrentEmployee()
      .then(async (currentEmployee) => {
        const requests =
          await getEmployeeLeaveRequests(
            currentEmployee.employeeId,
          );

        if (!cancelled) {
          setEmployee(currentEmployee);
          setLeaveRequests(requests);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message ??
              "Unable to load your leave requests.",
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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.leaveType) {
      errors.leaveType = "Leave type is required.";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      errors.endDate =
        "End date cannot be before start date.";
    }

    if (!formData.reason.trim()) {
      errors.reason = "Reason is required.";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (!employee?.employeeId) {
      setErrorMessage(
        "The authenticated employee record is unavailable.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createLeaveRequest({
        employeeId: employee.employeeId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
      });

      const requests =
        await getEmployeeLeaveRequests(
          employee.employeeId,
        );

      setLeaveRequests(requests);
      setFormData(EMPTY_FORM);
      setFormErrors({});
      setShowForm(false);
      setSuccessMessage(
        "Your leave request was submitted successfully and is awaiting HR review.",
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to submit your leave request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Self-Service
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            My leave requests
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Submit a leave request and review the HR
            decision for your previous requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadLeaveRequests}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-950 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm((current) => !current)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            {showForm
              ? "Close Form"
              : "Request Leave"}
          </button>
        </div>
      </section>

      {errorMessage && (
        <Message
          type="error"
          text={errorMessage}
        />
      )}

      {successMessage && (
        <Message
          type="success"
          text={successMessage}
        />
      )}

      {showForm && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-primary-950">
            New leave request
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            The request will be submitted for{" "}
            <span className="font-semibold">
              {employee?.fullName}
            </span>
            .
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
            noValidate
          >
            <FormField
              label="Leave Type"
              error={formErrors.leaveType}
            >
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                disabled={submitting}
                className={inputClass(
                  formErrors.leaveType,
                )}
              >
                <option value="">
                  Select leave type
                </option>
                <option value="ANNUAL">
                  Annual Leave
                </option>
                <option value="SICK">
                  Sick Leave
                </option>
                <option value="CASUAL">
                  Casual Leave
                </option>
                <option value="UNPAID">
                  Unpaid Leave
                </option>
              </select>
            </FormField>

            <div />

            <FormField
              label="Start Date"
              error={formErrors.startDate}
            >
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                min={getToday()}
                onChange={handleChange}
                disabled={submitting}
                className={inputClass(
                  formErrors.startDate,
                )}
              />
            </FormField>

            <FormField
              label="End Date"
              error={formErrors.endDate}
            >
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                min={
                  formData.startDate || getToday()
                }
                onChange={handleChange}
                disabled={submitting}
                className={inputClass(
                  formErrors.endDate,
                )}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Reason"
                error={formErrors.reason}
              >
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={4}
                  placeholder="Explain why you are requesting leave"
                  className={inputClass(
                    formErrors.reason,
                  )}
                />
              </FormField>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Request"}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setFormData(EMPTY_FORM);
                  setFormErrors({});
                  setShowForm(false);
                }}
                className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Total Requests"
          value={leaveRequests.length}
        />

        <SummaryCard
          icon={Clock}
          label="Pending"
          value={pendingCount}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved"
          value={approvedCount}
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected"
          value={rejectedCount}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-600">
            {employee?.fullName ?? "Loading employee..."}
            {employee?.employeeId
              ? ` · Employee #${employee.employeeId}`
              : ""}
          </p>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">
              Approved
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Leave history
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Showing {filteredRequests.length} of{" "}
            {leaveRequests.length} personal requests.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading your leave requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No leave requests found
            </h3>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredRequests.map((request) => (
              <article
                key={request.leaveRequestId}
                className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_1fr_1fr_1.5fr_1fr] lg:items-center"
              >
                <DataValue
                  label="Type"
                  value={formatLabel(
                    request.leaveType,
                  )}
                />

                <DataValue
                  label="Start Date"
                  value={formatDate(
                    request.startDate,
                  )}
                />

                <DataValue
                  label="End Date"
                  value={formatDate(
                    request.endDate,
                  )}
                />

                <DataValue
                  label="Reason"
                  value={request.reason}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                    Status
                  </p>

                  <StatusBadge
                    status={request.requestStatus}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Message({ type, text }) {
  return (
    <div
      role="alert"
      className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {text}
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
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

function DataValue({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-stone-700">
        {value || "—"}
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
    APPROVED:
      "bg-emerald-100 text-emerald-700",
    REJECTED:
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

function inputClass(error) {
  return [
    "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none disabled:bg-stone-100",
    error
      ? "border-red-400"
      : "border-stone-300 focus:border-primary-600",
  ].join(" ");
}

function countStatus(requests, status) {
  return requests.filter(
    (request) =>
      request.requestStatus?.toUpperCase() ===
      status,
  ).length;
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
  if (!value) {
    return "—";
  }

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

function getToday() {
  const now = new Date();
  const offset =
    now.getTimezoneOffset() * 60 * 1000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .split("T")[0];
}