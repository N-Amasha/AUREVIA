import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  createShift,
  getAllEmployees,
  getAllShifts,
  updateShiftStatus,
} from "../../api/staffApi";

const initialForm = {
  employeeId: "",
  shiftDate: "",
  startTime: "",
  endTime: "",
};

export default function ShiftManagementPage() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [shiftData, employeeData] = await Promise.all([
          getAllShifts(),
          getAllEmployees(),
        ]);

        if (!active) {
          return;
        }

        setShifts(Array.isArray(shiftData) ? shiftData : []);
        setEmployees(
          Array.isArray(employeeData) ? employeeData : [],
        );
        setError("");
      } catch (requestError) {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const employeeMap = useMemo(
    () =>
      new Map(
        employees.map((employee) => [
          employee.employeeId,
          employee,
        ]),
      ),
    [employees],
  );

  const roles = useMemo(
    () =>
      [
        ...new Set(
          employees
            .map((employee) => employee.role)
            .filter(Boolean),
        ),
      ].sort(),
    [employees],
  );

  const statuses = useMemo(
    () =>
      [
        ...new Set(
          shifts
            .map((shift) => shift.shiftStatus)
            .filter(Boolean),
        ),
      ].sort(),
    [shifts],
  );

  const filteredShifts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return shifts.filter((shift) => {
      const employee = employeeMap.get(shift.employeeId);

      const matchesSearch =
        !normalizedSearch ||
        shift.employeeName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        String(shift.shiftId).includes(normalizedSearch) ||
        employee?.email
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesDate =
        !dateFilter || shift.shiftDate === dateFilter;

      const matchesRole =
        !roleFilter || employee?.role === roleFilter;

      const matchesStatus =
        !statusFilter ||
        shift.shiftStatus?.toUpperCase() ===
          statusFilter.toUpperCase();

      return (
        matchesSearch &&
        matchesDate &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    shifts,
    employeeMap,
    searchTerm,
    dateFilter,
    roleFilter,
    statusFilter,
  ]);

  const today = getLocalDate();

  const scheduledStaffCount = new Set(
    shifts.map((shift) => shift.employeeId),
  ).size;

  const todayShiftCount = shifts.filter(
    (shift) => shift.shiftDate === today,
  ).length;

  const upcomingShiftCount = shifts.filter(
    (shift) => shift.shiftDate > today,
  ).length;

  function refreshData() {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setForm(initialForm);
    setFormError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeCreateForm() {
    if (!saving) {
      setShowForm(false);
      setFormError("");
    }
  }

  async function handleCreateShift(event) {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (
      !form.employeeId ||
      !form.shiftDate ||
      !form.startTime ||
      !form.endTime
    ) {
      setFormError("Complete all shift fields.");
      return;
    }

    if (form.endTime <= form.startTime) {
      setFormError(
        "Shift end time must be after the start time.",
      );
      return;
    }

    try {
      setSaving(true);

      const createdShift = await createShift({
        employeeId: Number(form.employeeId),
        shiftDate: form.shiftDate,
        startTime: form.startTime,
        endTime: form.endTime,
      });

      setShifts((current) =>
        [...current, createdShift].sort(compareShifts),
      );
      setForm(initialForm);
      setShowForm(false);
      setSuccess("Shift created successfully.");
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(shift, newStatus) {
    if (
      !newStatus ||
      newStatus === shift.shiftStatus
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const updatedShift = await updateShiftStatus(
        shift.shiftId,
        newStatus,
      );

      setShifts((current) =>
        current.map((item) =>
          item.shiftId === updatedShift.shiftId
            ? updatedShift
            : item,
        ),
      );

      setSuccess(
        `Shift #${shift.shiftId} status updated successfully.`,
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
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
            Shift management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review staff work schedules and manage shift
            information for restaurant and event operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-primary-900 transition hover:bg-stone-50 disabled:opacity-60"
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
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
          >
            <Plus className="h-4 w-4" />
            Create Shift
          </button>
        </div>
      </section>

      {error && (
        <MessageBox
          type="error"
          message={error}
        />
      )}

      {success && (
        <MessageBox
          type="success"
          message={success}
        />
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Scheduled Shifts"
          value={shifts.length}
        />

        <SummaryCard
          icon={Users}
          label="Staff Scheduled"
          value={scheduledStaffCount}
        />

        <SummaryCard
          icon={Clock}
          label="Today's Shifts"
          value={todayShiftCount}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Upcoming Shifts"
          value={upcomingShiftCount}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_200px_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search employee or shift"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          />

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          >
            <option value="">All Roles</option>

            {roles.map((role) => (
              <option key={role} value={role}>
                {formatLabel(role)}
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
            <option value="">All Shift Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredShifts.length} of {shifts.length}{" "}
          shifts.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Shift schedule
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Authoritative employee shift records stored in
                the Aurevia database.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredShifts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
              <span>Employee</span>
              <span>Role</span>
              <span>Date</span>
              <span>Start</span>
              <span>End</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-stone-200">
              {filteredShifts.map((shift) => {
                const employee = employeeMap.get(
                  shift.employeeId,
                );

                return (
                  <div
                    key={shift.shiftId}
                    className="grid gap-4 px-6 py-5 xl:grid-cols-7 xl:items-center"
                  >
                    <div>
                      <p className="font-semibold text-primary-950">
                        {shift.employeeName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Shift #{shift.shiftId} · Employee #
                        {shift.employeeId}
                      </p>
                    </div>

                    <p className="text-sm text-stone-700">
                      {formatLabel(employee?.role)}
                    </p>

                    <p className="text-sm text-stone-700">
                      {formatDate(shift.shiftDate)}
                    </p>

                    <p className="text-sm text-stone-700">
                      {formatTime(shift.startTime)}
                    </p>

                    <p className="text-sm text-stone-700">
                      {formatTime(shift.endTime)}
                    </p>

                    <StatusBadge value={shift.shiftStatus} />

                    <select
                      value={shift.shiftStatus}
                      onChange={(event) =>
                        handleStatusChange(
                          shift,
                          event.target.value,
                        )
                      }
                      className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-primary-900 outline-none"
                    >
                      <option value="SCHEDULED">
                        Scheduled
                      </option>
                      <option value="COMPLETED">
                        Completed
                      </option>
                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-950">
                  Create shift
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Schedule an employee for a work period.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateForm}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {formError}
              </div>
            )}

            <form
              onSubmit={handleCreateShift}
              className="mt-6 space-y-5"
            >
              <FormField label="Employee">
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">Select employee</option>

                  {employees
                    .filter(
                      (employee) =>
                        employee.employmentStatus?.toUpperCase() ===
                        "ACTIVE",
                    )
                    .map((employee) => (
                      <option
                        key={employee.employeeId}
                        value={employee.employeeId}
                      >
                        {employee.fullName} —{" "}
                        {formatLabel(employee.role)}
                      </option>
                    ))}
                </select>
              </FormField>

              <FormField label="Shift Date">
                <input
                  type="date"
                  name="shiftDate"
                  value={form.shiftDate}
                  min={today}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Start Time">
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                  />
                </FormField>

                <FormField label="End Time">
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateForm}
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
                  {saving ? "Creating..." : "Create Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
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

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-primary-950">
        {label}
      </span>

      {children}
    </label>
  );
}

function StatusBadge({ value }) {
  const normalized = String(value || "").toUpperCase();

  let classes = "bg-stone-100 text-stone-700";

  if (normalized === "SCHEDULED") {
    classes = "bg-blue-100 text-blue-800";
  } else if (normalized === "COMPLETED") {
    classes = "bg-emerald-100 text-emerald-800";
  } else if (normalized === "CANCELLED") {
    classes = "bg-red-100 text-red-800";
  }

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {formatLabel(value)}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="px-6 py-14 text-center">
      <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary-700" />

      <p className="mt-4 font-semibold text-primary-950">
        Loading shifts...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <CalendarDays className="mx-auto h-7 w-7 text-stone-400" />

      <h3 className="mt-4 font-semibold text-primary-950">
        No matching shifts
      </h3>

      <p className="mt-2 text-sm text-stone-600">
        Create a shift or adjust the current filters.
      </p>
    </div>
  );
}

function MessageBox({ type, message }) {
  const classes =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div
      className={`mt-8 rounded-2xl border p-4 text-sm font-medium ${classes}`}
    >
      {message}
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) {
    return "—";
  }

  const [hour, minute] = String(value).split(":");
  const date = new Date();

  date.setHours(Number(hour), Number(minute), 0, 0);

  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getLocalDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
}

function compareShifts(first, second) {
  const firstValue =
    `${first.shiftDate}T${first.startTime}`;
  const secondValue =
    `${second.shiftDate}T${second.startTime}`;

  return firstValue.localeCompare(secondValue);
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  return (
    data?.message ||
    data?.detail ||
    error?.message ||
    "An unexpected server error occurred."
  );
}