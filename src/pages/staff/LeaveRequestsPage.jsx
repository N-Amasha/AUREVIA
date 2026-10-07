import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarOff,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";

import {
  createLeaveRequest,
  getAllEmployees,
  getAllLeaveRequests,
  reviewLeaveRequest,
} from "../../api/staffApi";

const EMPTY_FORM = {
  employeeId: "",
  startDate: "",
  endDate: "",
  leaveType: "ANNUAL",
  reason: "",
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    "An unexpected server error occurred."
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [reviewerId, setReviewerId] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [requestData, employeeData] =
        await Promise.all([
          getAllLeaveRequests(),
          getAllEmployees(),
        ]);

      setRequests(
        Array.isArray(requestData) ? requestData : [],
      );

      setEmployees(
        Array.isArray(employeeData) ? employeeData : [],
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

  const hrManagers = useMemo(
    () =>
      employees.filter(
        (employee) => employee.role === "HR_MANAGER",
      ),
    [employees],
  );

  const leaveTypes = useMemo(
    () =>
      [
        ...new Set(
          requests
            .map((request) => request.leaveType)
            .filter(Boolean),
        ),
      ].sort(),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !normalizedSearch ||
        request.employeeName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        request.reason
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        String(request.leaveRequestId).includes(
          normalizedSearch,
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        request.requestStatus === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        request.leaveType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const pendingCount = requests.filter(
    (request) => request.requestStatus === "PENDING",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.requestStatus === "APPROVED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.requestStatus === "REJECTED",
  ).length;

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setError("");
    setSuccessMessage("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (!saving) {
      setShowCreateModal(false);
      setForm(EMPTY_FORM);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !form.employeeId ||
      !form.startDate ||
      !form.endDate ||
      !form.leaveType ||
      !form.reason.trim()
    ) {
      setError("Complete all required leave-request fields.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError("The end date cannot be before the start date.");
      return;
    }

    setSaving(true);

    try {
      await createLeaveRequest({
        employeeId: Number(form.employeeId),
        startDate: form.startDate,
        endDate: form.endDate,
        leaveType: form.leaveType,
        reason: form.reason.trim(),
      });

      setShowCreateModal(false);
      setForm(EMPTY_FORM);
      setSuccessMessage(
        "Leave request created successfully.",
      );

      await loadData();
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setSaving(false);
    }
  }

  function openReviewModal(request) {
    setSelectedRequest(request);
    setReviewerId(
      hrManagers.length === 1
        ? String(hrManagers[0].employeeId)
        : "",
    );
    setError("");
    setSuccessMessage("");
  }

  function closeReviewModal() {
    if (!saving) {
      setSelectedRequest(null);
      setReviewerId("");
    }
  }

  async function handleReview(requestStatus) {
    if (!selectedRequest) {
      return;
    }

    if (!reviewerId) {
      setError("Select the HR manager reviewing this request.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await reviewLeaveRequest(
        selectedRequest.leaveRequestId,
        {
          hrManagerId: Number(reviewerId),
          requestStatus,
        },
      );

      setSelectedRequest(null);
      setReviewerId("");

      setSuccessMessage(
        `Leave request ${requestStatus.toLowerCase()} successfully.`,
      );

      await loadData();
    } catch (reviewError) {
      setError(getErrorMessage(reviewError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Management & Allocation
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Leave requests
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review employee leave requests and record HR approval
            or rejection decisions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
          >
            <Plus className="h-4 w-4" />
            Create Request
          </button>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarOff}
          label="Leave Requests"
          value={requests.length}
        />

        <SummaryCard
          icon={Clock3}
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search employee, reason or request ID"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          >
            <option value="ALL">All Leave Types</option>

            {leaveTypes.map((leaveType) => (
              <option key={leaveType} value={leaveType}>
                {formatLabel(leaveType)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-stone-500">
          Showing {filteredRequests.length} of {requests.length}{" "}
          leave requests.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Employee leave requests
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Authoritative leave-request records stored in the
            Aurevia database.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading leave requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarOff className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No leave requests found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No records match the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredRequests.map((request) => (
              <article
                key={request.leaveRequestId}
                className="grid gap-5 p-6 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto] xl:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {request.employeeName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Request #{request.leaveRequestId} · Employee #
                    {request.employeeId}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {request.reason}
                  </p>
                </div>

                <DataField
                  label="Leave Type"
                  value={formatLabel(request.leaveType)}
                />

                <DataField
                  label="Period"
                  value={`${formatDate(
                    request.startDate,
                  )} – ${formatDate(request.endDate)}`}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Status
                  </p>

                  <StatusBadge status={request.requestStatus} />

                  {request.reviewedByHrManagerName && (
                    <p className="mt-2 text-xs leading-5 text-stone-500">
                      By {request.reviewedByHrManagerName}
                      <br />
                      {formatDateTime(request.reviewedDate)}
                    </p>
                  )}
                </div>

                <div>
                  {request.requestStatus === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() => openReviewModal(request)}
                      className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-sm text-stone-400">
                      Reviewed
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showCreateModal && (
        <Modal title="Create leave request" onClose={closeCreateModal}>
          <form onSubmit={handleCreate}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <FieldLabel>Employee</FieldLabel>

                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.firstName} {employee.lastName} —{" "}
                      {formatLabel(employee.role)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel>Start Date</FieldLabel>

                <input
                  type="date"
                  name="startDate"
                  min={getToday()}
                  value={form.startDate}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </label>

              <label>
                <FieldLabel>End Date</FieldLabel>

                <input
                  type="date"
                  name="endDate"
                  min={form.startDate || getToday()}
                  value={form.endDate}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Leave Type</FieldLabel>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="ANNUAL">Annual</option>
                  <option value="SICK">Sick</option>
                  <option value="CASUAL">Casual</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Reason</FieldLabel>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={updateForm}
                  required
                  rows={4}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={saving}
                className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Request"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedRequest && (
        <Modal title="Review leave request" onClose={closeReviewModal}>
          <div className="rounded-xl bg-stone-50 p-5">
            <p className="font-semibold text-primary-950">
              {selectedRequest.employeeName}
            </p>

            <p className="mt-2 text-sm text-stone-600">
              {formatLabel(selectedRequest.leaveType)} ·{" "}
              {formatDate(selectedRequest.startDate)} –{" "}
              {formatDate(selectedRequest.endDate)}
            </p>

            <p className="mt-3 text-sm leading-6 text-stone-700">
              {selectedRequest.reason}
            </p>
          </div>

          <label className="mt-5 block">
            <FieldLabel>Reviewing HR Manager</FieldLabel>

            <select
              value={reviewerId}
              onChange={(event) =>
                setReviewerId(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              <option value="">Select HR manager</option>

              {hrManagers.map((manager) => (
                <option
                  key={manager.employeeId}
                  value={manager.employeeId}
                >
                  {manager.firstName} {manager.lastName} — Employee #
                  {manager.employeeId}
                </option>
              ))}
            </select>
          </label>

          {hrManagers.length === 0 && (
            <p className="mt-3 text-sm text-amber-700">
              No employee with the HR_MANAGER role is available.
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={closeReviewModal}
              disabled={saving}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleReview("REJECTED")}
              disabled={saving || !reviewerId}
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              Reject
            </button>

            <button
              type="button"
              onClick={() => handleReview("APPROVED")}
              disabled={saving || !reviewerId}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              Approve
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
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

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-stone-100 text-stone-700"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function FieldLabel({ children }) {
  return (
    <span className="text-sm font-semibold text-primary-950">
      {children}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-primary-950">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}