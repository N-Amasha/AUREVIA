import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  RefreshCw,
} from "lucide-react";

import {
  getCurrentEmployee,
  getEmployeeShifts,
} from "../../api/staffApi";

export default function MyShiftsPage() {
  const [employee, setEmployee] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const filteredShifts = useMemo(() => {
    if (statusFilter === "ALL") {
      return shifts;
    }

    return shifts.filter(
      (shift) =>
        shift.shiftStatus?.toUpperCase() ===
        statusFilter,
    );
  }, [shifts, statusFilter]);

  const upcomingCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return shifts.filter((shift) => {
      if (!shift.shiftDate) {
        return false;
      }

      return (
        new Date(`${shift.shiftDate}T00:00:00`) >=
        today
      );
    }).length;
  }, [shifts]);

  async function loadShifts() {
    setLoading(true);
    setErrorMessage("");

    try {
      const currentEmployee =
        await getCurrentEmployee();

      const employeeShifts =
        await getEmployeeShifts(
          currentEmployee.employeeId,
        );

      setEmployee(currentEmployee);
      setShifts(employeeShifts);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to load your shifts.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getCurrentEmployee()
      .then(async (currentEmployee) => {
        const employeeShifts =
          await getEmployeeShifts(
            currentEmployee.employeeId,
          );

        if (!cancelled) {
          setEmployee(currentEmployee);
          setShifts(employeeShifts);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.message ??
              "Unable to load your shifts.",
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
            My shifts
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review your personal work schedule and shift
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadShifts}
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

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CalendarDays}
          label="Total Shifts"
          value={shifts.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Upcoming Shifts"
          value={upcomingCount}
        />

        <SummaryCard
          icon={Clock}
          label="Scheduled Shifts"
          value={
            shifts.filter(
              (shift) =>
                shift.shiftStatus?.toUpperCase() ===
                "SCHEDULED",
            ).length
          }
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
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Shift schedule
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Showing {filteredShifts.length} of{" "}
            {shifts.length} personal shift records.
          </p>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Shift</span>
          <span>Date</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading your shifts...
          </div>
        ) : filteredShifts.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No shifts found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No personal shifts match the selected
              status.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredShifts.map((shift) => (
              <article
                key={shift.shiftId}
                className="grid gap-4 px-6 py-5 md:grid-cols-5 md:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 md:hidden">
                    Shift
                  </p>

                  <p className="font-semibold text-primary-950">
                    Shift #{shift.shiftId}
                  </p>
                </div>

                <DataValue
                  label="Date"
                  value={formatDate(shift.shiftDate)}
                />

                <DataValue
                  label="Start Time"
                  value={formatTime(shift.startTime)}
                />

                <DataValue
                  label="End Time"
                  value={formatTime(shift.endTime)}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 md:hidden">
                    Status
                  </p>

                  <StatusBadge
                    status={shift.shiftStatus}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Shift changes
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-700">
          This self-service page is read-only. Contact the
          HR Manager if a scheduled shift must be changed
          or cancelled.
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
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 md:hidden">
        {label}
      </p>

      <p className="mt-1 text-sm text-stone-700 md:mt-0">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() ?? "UNKNOWN";

  const styles = {
    SCHEDULED:
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

function formatTime(value) {
  if (!value) {
    return "—";
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