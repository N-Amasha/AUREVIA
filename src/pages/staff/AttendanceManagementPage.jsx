import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  createAttendance,
  getAllAttendance,
  getAllEmployees,
  getAllShifts,
} from "../../api/staffApi";

const initialForm = {
  employeeId: "",
  shiftId: "",
  attendanceDate: "",
  checkInTime: "",
  checkOutTime: "",
  attendanceStatus: "PRESENT",
};

export default function AttendanceManagementPage() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
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
        const [
          attendanceData,
          employeeData,
          shiftData,
        ] = await Promise.all([
          getAllAttendance(),
          getAllEmployees(),
          getAllShifts(),
        ]);

        if (!active) {
          return;
        }

        setRecords(
          Array.isArray(attendanceData)
            ? attendanceData
            : [],
        );
        setEmployees(
          Array.isArray(employeeData)
            ? employeeData
            : [],
        );
        setShifts(
          Array.isArray(shiftData) ? shiftData : [],
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

  const shiftMap = useMemo(
    () =>
      new Map(
        shifts.map((shift) => [
          shift.shiftId,
          shift,
        ]),
      ),
    [shifts],
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
          records
            .map((record) => record.attendanceStatus)
            .filter(Boolean),
        ),
      ].sort(),
    [records],
  );

  const availableShifts = useMemo(() => {
    if (!form.employeeId) {
      return shifts;
    }

    return shifts.filter(
      (shift) =>
        String(shift.employeeId) ===
        String(form.employeeId),
    );
  }, [shifts, form.employeeId]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return records.filter((record) => {
      const employee = employeeMap.get(
        record.employeeId,
      );

      const searchableText = [
        record.attendanceId,
        record.employeeName,
        record.employeeId,
        record.shiftId,
        employee?.email,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesDate =
        !dateFilter ||
        record.attendanceDate === dateFilter;

      const matchesRole =
        !roleFilter || employee?.role === roleFilter;

      const matchesStatus =
        !statusFilter ||
        record.attendanceStatus?.toUpperCase() ===
          statusFilter.toUpperCase();

      return (
        matchesSearch &&
        matchesDate &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    records,
    employeeMap,
    searchTerm,
    dateFilter,
    roleFilter,
    statusFilter,
  ]);

  const presentCount = records.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() ===
      "PRESENT",
  ).length;

  const lateCount = records.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() === "LATE",
  ).length;

  const absentCount = records.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() ===
      "ABSENT",
  ).length;

  function refreshData() {
    setLoading(true);
    setRefreshKey((current) => current + 1);
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

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleShiftChange(event) {
    const shiftId = event.target.value;
    const selectedShift = shiftMap.get(
      Number(shiftId),
    );

    if (!selectedShift) {
      setForm((current) => ({
        ...current,
        shiftId: "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      shiftId,
      employeeId: String(selectedShift.employeeId),
      attendanceDate: selectedShift.shiftDate,
    }));
  }

  async function handleCreateAttendance(event) {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (
      !form.employeeId ||
      !form.attendanceDate ||
      !form.attendanceStatus
    ) {
      setFormError(
        "Employee, attendance date and status are required.",
      );
      return;
    }

    if (
      form.checkInTime &&
      form.checkOutTime &&
      form.checkOutTime <= form.checkInTime
    ) {
      setFormError(
        "Check-out time must be after check-in time.",
      );
      return;
    }

    try {
      setSaving(true);

      const createdRecord = await createAttendance({
        employeeId: Number(form.employeeId),
        shiftId: form.shiftId
          ? Number(form.shiftId)
          : null,
        attendanceDate: form.attendanceDate,
        checkInTime:
          form.attendanceStatus === "ABSENT"
            ? null
            : form.checkInTime || null,
        checkOutTime:
          form.attendanceStatus === "ABSENT"
            ? null
            : form.checkOutTime || null,
        attendanceStatus: form.attendanceStatus,
      });

      setRecords((current) =>
        [createdRecord, ...current].sort(
          compareAttendance,
        ),
      );
      setForm(initialForm);
      setShowForm(false);
      setSuccess(
        "Attendance record created successfully.",
      );
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
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
            Attendance management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review employee attendance and compare actual
            attendance with scheduled workforce activities.
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
            Record Attendance
          </button>
        </div>
      </section>

      {error && (
        <MessageBox type="error" message={error} />
      )}

      {success && (
        <MessageBox type="success" message={success} />
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Staff Records"
          value={records.length}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Present"
          value={presentCount}
        />

        <SummaryCard
          icon={Clock}
          label="Late"
          value={lateCount}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Absent"
          value={absentCount}
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
              placeholder="Search employee or attendance"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500"
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
            <option value="">
              All Attendance Statuses
            </option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredRecords.length} of{" "}
          {records.length} attendance records.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Attendance records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Authoritative employee attendance stored in
                the Aurevia database.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredRecords.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
              <span>Employee</span>
              <span>Date</span>
              <span>Shift</span>
              <span>Check In</span>
              <span>Check Out</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-stone-200">
              {filteredRecords.map((record) => {
                const employee = employeeMap.get(
                  record.employeeId,
                );
                const shift = shiftMap.get(record.shiftId);

                return (
                  <div
                    key={record.attendanceId}
                    className="grid gap-4 px-6 py-5 xl:grid-cols-7 xl:items-center"
                  >
                    <div>
                      <p className="font-semibold text-primary-950">
                        {record.employeeName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {formatLabel(employee?.role)} ·
                        Employee #{record.employeeId}
                      </p>
                    </div>

                    <p className="text-sm text-stone-700">
                      {formatDate(record.attendanceDate)}
                    </p>

                    <div>
                      <p className="text-sm text-stone-700">
                        {record.shiftId
                          ? `Shift #${record.shiftId}`
                          : "No shift"}
                      </p>

                      {shift && (
                        <p className="mt-1 text-xs text-stone-500">
                          {formatTime(shift.startTime)} –{" "}
                          {formatTime(shift.endTime)}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-stone-700">
                      {formatTime(record.checkInTime)}
                    </p>

                    <p className="text-sm text-stone-700">
                      {formatTime(record.checkOutTime)}
                    </p>

                    <StatusBadge
                      value={record.attendanceStatus}
                    />

                    <Link
                      to={`/hr/staff/${record.employeeId}`}
                      className="text-sm font-semibold text-primary-700 hover:text-primary-900"
                    >
                      View Staff
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-950">
                  Record attendance
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Store an employee attendance record.
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
              onSubmit={handleCreateAttendance}
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

              <FormField label="Shift (optional)">
                <select
                  name="shiftId"
                  value={form.shiftId}
                  onChange={handleShiftChange}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">
                    No shift reference
                  </option>

                  {availableShifts.map((shift) => (
                    <option
                      key={shift.shiftId}
                      value={shift.shiftId}
                    >
                      Shift #{shift.shiftId} —{" "}
                      {shift.employeeName} —{" "}
                      {formatDate(shift.shiftDate)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Attendance Date">
                <input
                  type="date"
                  name="attendanceDate"
                  value={form.attendanceDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </FormField>

              <FormField label="Attendance Status">
                <select
                  name="attendanceStatus"
                  value={form.attendanceStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Check In">
                  <input
                    type="time"
                    name="checkInTime"
                    value={form.checkInTime}
                    onChange={handleInputChange}
                    disabled={
                      form.attendanceStatus === "ABSENT"
                    }
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500 disabled:bg-stone-100"
                  />
                </FormField>

                <FormField label="Check Out">
                  <input
                    type="time"
                    name="checkOutTime"
                    value={form.checkOutTime}
                    onChange={handleInputChange}
                    disabled={
                      form.attendanceStatus === "ABSENT"
                    }
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500 disabled:bg-stone-100"
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
                  {saving
                    ? "Saving..."
                    : "Record Attendance"}
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

  if (normalized === "PRESENT") {
    classes = "bg-emerald-100 text-emerald-800";
  } else if (normalized === "LATE") {
    classes = "bg-amber-100 text-amber-800";
  } else if (normalized === "ABSENT") {
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
        Loading attendance...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <ClipboardCheck className="mx-auto h-7 w-7 text-stone-400" />

      <h3 className="mt-4 font-semibold text-primary-950">
        No matching attendance records
      </h3>

      <p className="mt-2 text-sm text-stone-600">
        Record attendance or adjust the current filters.
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

  const date = new Date(
    `${String(value).slice(0, 10)}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

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

function compareAttendance(first, second) {
  return String(second.attendanceDate || "").localeCompare(
    String(first.attendanceDate || ""),
  );
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