import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  ClipboardCheck,
  ListChecks,
  RefreshCw,
  Sparkles,
  UserRoundCheck,
  Users,
} from "lucide-react";

import {
  getAllAttendance,
  getAllEmployeeTasks,
  getAllEmployees,
  getAllLeaveRequests,
  getAllShifts,
} from "../../api/staffApi";

const ACTIONS = [
  {
    title: "Staff",
    description:
      "Manage employee information and review staff records.",
    icon: Users,
    path: "/hr/staff",
  },
  {
    title: "Shifts",
    description:
      "Manage staff shift information and scheduling.",
    icon: CalendarDays,
    path: "/hr/shifts",
  },
  {
    title: "Staff Assignments",
    description:
      "Review assignments associated with restaurant and event operations.",
    icon: ListChecks,
    path: "/hr/assignments",
  },
  {
    title: "Attendance",
    description:
      "Review employee attendance information.",
    icon: ClipboardCheck,
    path: "/hr/attendance",
  },
  {
    title: "Leave Requests",
    description:
      "Review staff leave requests and record HR decisions.",
    icon: UserRoundCheck,
    path: "/hr/leave",
  },
  {
    title: "Staff Allocation",
    description:
      "Generate explainable staffing suggestions from workforce availability.",
    icon: Sparkles,
    path: "/hr/allocation",
  },
];

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    "An unexpected server error occurred."
  );
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

export default function HRDashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        employeeData,
        shiftData,
        taskData,
        attendanceData,
        leaveData,
      ] = await Promise.all([
        getAllEmployees(),
        getAllShifts(),
        getAllEmployeeTasks(),
        getAllAttendance(),
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

      setAttendance(
        Array.isArray(attendanceData) ? attendanceData : [],
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
      loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  const activeStaffCount = employees.filter(
    (employee) =>
      employee.employmentStatus?.toUpperCase() === "ACTIVE",
  ).length;

  const scheduledShiftCount = shifts.filter(
    (shift) =>
      shift.shiftStatus?.toUpperCase() === "SCHEDULED",
  ).length;

  const openAssignmentCount = tasks.filter(
    (task) =>
      task.taskStatus?.toUpperCase() !== "COMPLETED",
  ).length;

  const pendingLeaveCount = leaveRequests.filter(
    (request) =>
      request.requestStatus?.toUpperCase() === "PENDING",
  ).length;

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((first, second) =>
          String(first.dueDate).localeCompare(
            String(second.dueDate),
          ),
        )
        .slice(0, 5),
    [tasks],
  );

  const recentAttendance = useMemo(
    () =>
      [...attendance]
        .sort((first, second) =>
          String(second.attendanceDate).localeCompare(
            String(first.attendanceDate),
          ),
        )
        .slice(0, 5),
    [attendance],
  );

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            HR Manager Workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Staff management dashboard
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Monitor employee records, schedules, assignments,
            attendance and leave from one connected workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
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
      </section>

      {error && (
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <h2 className="font-semibold text-red-900">
                Dashboard data could not be loaded
              </h2>

              <p className="mt-1 text-sm text-red-800">
                {error}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Active Staff"
          value={activeStaffCount}
          loading={loading}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Scheduled Shifts"
          value={scheduledShiftCount}
          loading={loading}
        />

        <SummaryCard
          icon={ListChecks}
          label="Open Assignments"
          value={openAssignmentCount}
          loading={loading}
        />

        <SummaryCard
          icon={UserRoundCheck}
          label="Pending Leave"
          value={pendingLeaveCount}
          loading={loading}
        />
      </section>

      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Staff Operations
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage workforce activities
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-2">
        <DashboardList
          icon={ListChecks}
          title="Upcoming and open assignments"
          description="Assignment records requiring workforce attention."
          emptyText="No assignment records are available."
        >
          {recentTasks.map((task) => (
            <DashboardRow
              key={task.taskId}
              title={task.taskDescription}
              subtitle={`${task.employeeName} · Due ${formatDate(
                task.dueDate,
              )}`}
              status={task.taskStatus}
              warning={task.overdue}
            />
          ))}
        </DashboardList>

        <DashboardList
          icon={ClipboardCheck}
          title="Recent attendance"
          description="Latest recorded employee attendance."
          emptyText="No attendance records are available."
        >
          {recentAttendance.map((record) => (
            <DashboardRow
              key={record.attendanceId}
              title={record.employeeName}
              subtitle={`${formatDate(
                record.attendanceDate,
              )} · ${
                record.checkInTime
                  ? `Check-in ${record.checkInTime}`
                  : "No check-in recorded"
              }`}
              status={record.attendanceStatus}
            />
          ))}
        </DashboardList>
      </section>

      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Connected Workforce Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Workforce records support explainable allocation
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <FlowStep
            number="01"
            title="Staff"
            text="Active employee and role information identifies the workforce."
          />

          <FlowStep
            number="02"
            title="Schedule"
            text="Shift and assignment records identify existing workload."
          />

          <FlowStep
            number="03"
            title="Availability"
            text="Attendance and approved leave help evaluate availability."
          />

          <FlowStep
            number="04"
            title="Recommend"
            text="Allocation rules produce suggestions for HR review."
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
  loading,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function DashboardList({
  icon: Icon,
  title,
  description,
  emptyText,
  children,
}) {
  const records = Array.isArray(children)
    ? children.filter(Boolean)
    : children
      ? [children]
      : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="border-b border-stone-200 p-6">
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              {title}
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              {description}
            </p>
          </div>
        </div>
      </div>

      {records.length > 0 ? (
        <div className="divide-y divide-stone-200">
          {records}
        </div>
      ) : (
        <p className="p-8 text-center text-sm text-stone-500">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function DashboardRow({
  title,
  subtitle,
  status,
  warning = false,
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-primary-950">
          {title}
        </p>

        <p className="mt-1 text-sm text-stone-500">
          {subtitle}
        </p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          warning
            ? "bg-red-100 text-red-800"
            : "bg-primary-50 text-primary-800"
        }`}
      >
        {warning ? "Overdue" : formatLabel(status)}
      </span>
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