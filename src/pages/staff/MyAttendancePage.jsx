import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  getCurrentEmployee,
  getEmployeeAttendance,
} from "../../api/staffApi";

export default function MyAttendancePage() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const filteredAttendance = useMemo(() => {
    if (statusFilter === "ALL") {
      return attendance;
    }

    return attendance.filter(
      (record) =>
        record.attendanceStatus?.toUpperCase() ===
        statusFilter,
    );
  }, [attendance, statusFilter]);

  const presentCount = attendance.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() ===
      "PRESENT",
  ).length;

  const lateCount = attendance.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() ===
      "LATE",
  ).length;

  const absentCount = attendance.filter(
    (record) =>
      record.attendanceStatus?.toUpperCase() ===
      "ABSENT",
  ).length;

  async function loadAttendance() {
    setLoading(true);
    setErrorMessage("");

    try {
      const currentEmployee =
        await getCurrentEmployee();

      const employeeAttendance =
        await getEmployeeAttendance(
          currentEmployee.employeeId,
        );

      setEmployee(currentEmployee);
      setAttendance(employeeAttendance);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to load your attendance records.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getCurrentEmployee()
      .then(async (currentEmployee) => {
        const employeeAttendance =
          await getEmployeeAttendance(
            currentEmployee.employeeId,
          );

        if (!cancelled) {
          setEmployee(currentEmployee);
          setAttendance(employeeAttendance);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message ??
              "Unable to load your attendance records.",
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
            My attendance
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review your recorded attendance, check-in times
            and check-out times.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAttendance}
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
          icon={CalendarCheck}
          label="Total Records"
          value={attendance.length}
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
          icon={XCircle}
          label="Absent"
          value={absentCount}
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
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="ABSENT">Absent</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Attendance history
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Showing {filteredAttendance.length} of{" "}
            {attendance.length} personal attendance records.
          </p>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Attendance</span>
          <span>Shift</span>
          <span>Date</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading your attendance records...
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarCheck className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No attendance records found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No personal attendance records match the
              selected status.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredAttendance.map((record) => (
              <article
                key={record.attendanceId}
                className="grid gap-4 px-6 py-5 lg:grid-cols-6 lg:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                    Attendance
                  </p>

                  <p className="font-semibold text-primary-950">
                    Record #{record.attendanceId}
                  </p>
                </div>

                <DataValue
                  label="Shift"
                  value={
                    record.shiftId
                      ? `Shift #${record.shiftId}`
                      : "Not Linked"
                  }
                />

                <DataValue
                  label="Date"
                  value={formatDate(
                    record.attendanceDate,
                  )}
                />

                <DataValue
                  label="Check In"
                  value={formatTime(
                    record.checkInTime,
                  )}
                />

                <DataValue
                  label="Check Out"
                  value={formatTime(
                    record.checkOutTime,
                  )}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                    Status
                  </p>

                  <StatusBadge
                    status={record.attendanceStatus}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Incorrect attendance record?
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-700">
          Attendance records are maintained by authorized
          HR personnel. Contact the HR Manager if a check-in,
          check-out or attendance status is incorrect.
        </p>
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

function DataValue({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
        {label}
      </p>

      <p className="mt-1 text-sm text-stone-700 lg:mt-0">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() ?? "UNKNOWN";

  const styles = {
    PRESENT:
      "bg-emerald-100 text-emerald-700",
    LATE:
      "bg-amber-100 text-amber-700",
    ABSENT:
      "bg-red-100 text-red-700",
    ON_LEAVE:
      "bg-blue-100 text-blue-700",
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

function formatTime(value) {
  if (!value) {
    return "Not recorded";
  }

  const [hours, minutes] = value.split(":");

  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(
    new Date(
      2000,
      0,
      1,
      Number(hours),
      Number(minutes),
    ),
  );
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