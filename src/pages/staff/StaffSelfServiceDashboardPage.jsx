import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  ListChecks,
  RefreshCw,
  UserRoundCheck,
} from "lucide-react";

import {
  getCurrentEmployee,
  getEmployeeAttendance,
  getEmployeeLeaveRequests,
  getEmployeeShifts,
  getEmployeeTasks,
} from "../../api/staffApi";

export default function StaffSelfServiceDashboardPage() {
  const [employee, setEmployee] = useState(null);
  const [summary, setSummary] = useState({
    shifts: 0,
    assignments: 0,
    attendance: 0,
    leaveRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setErrorMessage("");

    try {
      const currentEmployee =
        await getCurrentEmployee();

      const employeeId =
        currentEmployee.employeeId;

      const [
        shifts,
        assignments,
        attendance,
        leaveRequests,
      ] = await Promise.all([
        getEmployeeShifts(employeeId),
        getEmployeeTasks(employeeId),
        getEmployeeAttendance(employeeId),
        getEmployeeLeaveRequests(employeeId),
      ]);

      setEmployee(currentEmployee);
      setSummary({
        shifts: shifts.length,
        assignments: assignments.length,
        attendance: attendance.length,
        leaveRequests: leaveRequests.length,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to load your staff records.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const request = getCurrentEmployee()
      .then(async (currentEmployee) => {
        const employeeId =
          currentEmployee.employeeId;

        const [
          shifts,
          assignments,
          attendance,
          leaveRequests,
        ] = await Promise.all([
          getEmployeeShifts(employeeId),
          getEmployeeTasks(employeeId),
          getEmployeeAttendance(employeeId),
          getEmployeeLeaveRequests(employeeId),
        ]);

        setEmployee(currentEmployee);
        setSummary({
          shifts: shifts.length,
          assignments: assignments.length,
          attendance: attendance.length,
          leaveRequests: leaveRequests.length,
        });
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load your staff records.",
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      void request;
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
            Welcome{employee?.firstName
              ? `, ${employee.firstName}`
              : ""}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            View your assigned shifts, operational tasks,
            attendance and leave requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
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

      {employee && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            Logged-in Employee
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Information
              label="Employee ID"
              value={employee.employeeId}
            />

            <Information
              label="Name"
              value={employee.fullName}
            />

            <Information
              label="Role"
              value={formatLabel(employee.role)}
            />

            <Information
              label="Employment Status"
              value={formatLabel(
                employee.employmentStatus,
              )}
            />
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="My Shifts"
          value={summary.shifts}
        />

        <SummaryCard
          icon={ListChecks}
          label="My Assignments"
          value={summary.assignments}
        />

        <SummaryCard
          icon={ClipboardCheck}
          label="Attendance Records"
          value={summary.attendance}
        />

        <SummaryCard
          icon={UserRoundCheck}
          label="Leave Requests"
          value={summary.leaveRequests}
        />
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Access Control
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Your records only
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
          This workspace displays information related to the
          authenticated employee. HR management functions,
          employee salaries, allocation decisions and leave
          approval controls are not available here.
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

function Information({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
        {label}
      </p>

      <p className="mt-2 font-medium text-primary-950">
        {value ?? "—"}
      </p>
    </div>
  );
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