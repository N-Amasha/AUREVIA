import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  ListChecks,
  RefreshCw,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import {
  getEmployeeAttendance,
  getEmployeeById,
  getEmployeeLeaveRequests,
  getEmployeeShifts,
  getEmployeeTasks,
} from "../../api/staffApi";

export default function StaffDetailsPage() {
  const { staffId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        const [
          employeeData,
          shiftData,
          taskData,
          attendanceData,
          leaveData,
        ] = await Promise.all([
          getEmployeeById(staffId),
          getEmployeeShifts(staffId),
          getEmployeeTasks(staffId),
          getEmployeeAttendance(staffId),
          getEmployeeLeaveRequests(staffId),
        ]);

        if (!active) {
          return;
        }

        setEmployee(employeeData);
        setShifts(Array.isArray(shiftData) ? shiftData : []);
        setTasks(Array.isArray(taskData) ? taskData : []);
        setAttendance(
          Array.isArray(attendanceData) ? attendanceData : [],
        );
        setLeaveRequests(
          Array.isArray(leaveData) ? leaveData : [],
        );
        setError("");
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(requestError));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [staffId, refreshKey]);

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((first, second) =>
          compareDates(
            second.assignedDate,
            first.assignedDate,
          ),
        )
        .slice(0, 5),
    [tasks],
  );

  const recentAttendance = useMemo(
    () =>
      [...attendance]
        .sort((first, second) =>
          compareDates(
            second.attendanceDate,
            first.attendanceDate,
          ),
        )
        .slice(0, 5),
    [attendance],
  );

  function refreshDetails() {
    setLoading(true);
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/hr/staff"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Staff
        </Link>

        <button
          type="button"
          onClick={refreshDetails}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Staff Management & Allocation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Staff member details
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review employee information and related workforce
          activity for the selected staff member.
        </p>
      </section>

      {error && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">
            Unable to load staff details
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            {error}
          </p>
        </section>
      )}

      {loading ? (
        <LoadingState />
      ) : employee ? (
        <>
          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <InfoCard
              icon={UserRound}
              title="Employee information"
              description="Account and role information for this staff member."
              items={[
                ["Employee ID", employee.employeeId],
                ["User ID", employee.userId],
                ["Name", employee.fullName],
                ["Email", employee.email],
              ]}
            />

            <InfoCard
              icon={UserRoundCheck}
              title="Employment information"
              description="Current employment and reporting information."
              items={[
                ["Role", formatLabel(employee.role)],
                [
                  "Status",
                  formatLabel(employee.employmentStatus),
                ],
                ["Hire Date", formatDate(employee.hireDate)],
                [
                  "Supervisor",
                  employee.supervisorName || "Not assigned",
                ],
              ]}
            />
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-primary-950">
              Workforce overview
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Workforce records currently associated with{" "}
              {employee.fullName}.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewCard
                icon={CalendarDays}
                label="Scheduled Shifts"
                value={shifts.length}
              />

              <OverviewCard
                icon={ListChecks}
                label="Assignments"
                value={tasks.length}
              />

              <OverviewCard
                icon={ClipboardCheck}
                label="Attendance Records"
                value={attendance.length}
              />

              <OverviewCard
                icon={UserRoundCheck}
                label="Leave Requests"
                value={leaveRequests.length}
              />
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <SectionHeader
              icon={CalendarDays}
              title="Scheduled shifts"
              description="Shift records assigned to this employee."
            />

            {shifts.length === 0 ? (
              <EmptySection
                icon={CalendarDays}
                title="No shift records available"
                text="No shifts are currently assigned to this employee."
              />
            ) : (
              <div className="divide-y divide-stone-200">
                {[...shifts]
                  .sort((first, second) =>
                    compareDates(
                      second.shiftDate,
                      first.shiftDate,
                    ),
                  )
                  .slice(0, 5)
                  .map((shift) => (
                    <div
                      key={shift.shiftId}
                      className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <div>
                        <p className="font-semibold text-primary-950">
                          {formatDate(shift.shiftDate)}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          Shift #{shift.shiftId}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          {formatTime(shift.startTime)} –{" "}
                          {formatTime(shift.endTime)}
                        </p>
                      </div>

                      <StatusBadge value={shift.shiftStatus} />
                    </div>
                  ))}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <SectionHeader
              icon={ListChecks}
              title="Recent assignments"
              description="Operational tasks assigned to this employee."
            />

            {recentTasks.length === 0 ? (
              <EmptySection
                icon={ListChecks}
                title="No assignment records available"
                text="No tasks are currently assigned to this employee."
              />
            ) : (
              <div className="divide-y divide-stone-200">
                {recentTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_180px_150px_auto]"
                  >
                    <div>
                      <p className="font-semibold text-primary-950">
                        {task.taskDescription}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        {task.eventName
                          ? `Event: ${task.eventName}`
                          : "General assignment"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Assigned
                      </p>

                      <p className="mt-1 text-sm text-stone-700">
                        {formatDate(task.assignedDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Due
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          task.overdue
                            ? "font-semibold text-red-700"
                            : "text-stone-700"
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </p>
                    </div>

                    <StatusBadge value={task.taskStatus} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <SectionHeader
              icon={ClipboardCheck}
              title="Recent attendance"
              description="Latest attendance records for this employee."
            />

            {recentAttendance.length === 0 ? (
              <EmptySection
                icon={ClipboardCheck}
                title="No attendance records available"
                text="No attendance history is currently recorded for this employee."
              />
            ) : (
              <div className="divide-y divide-stone-200">
                {recentAttendance.map((record) => (
                  <div
                    key={record.attendanceId}
                    className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <div>
                      <p className="font-semibold text-primary-950">
                        {formatDate(record.attendanceDate)}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        Attendance #{record.attendanceId}
                      </p>
                    </div>

                    <DetailValue
                      label="Check In"
                      value={formatTime(record.checkInTime)}
                    />

                    <DetailValue
                      label="Check Out"
                      value={formatTime(record.checkOutTime)}
                    />

                    <StatusBadge
                      value={record.attendanceStatus}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <SectionHeader
              icon={UserRoundCheck}
              title="Leave requests"
              description="Leave requests submitted by this employee."
            />

            {leaveRequests.length === 0 ? (
              <EmptySection
                icon={UserRoundCheck}
                title="No leave requests available"
                text="No leave requests are currently recorded for this employee."
              />
            ) : (
              <div className="divide-y divide-stone-200">
                {[...leaveRequests]
                  .sort((first, second) =>
                    compareDates(
                      second.requestDate,
                      first.requestDate,
                    ),
                  )
                  .slice(0, 5)
                  .map((request) => (
                    <div
                      key={request.leaveRequestId}
                      className="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_160px_160px_auto]"
                    >
                      <div>
                        <p className="font-semibold text-primary-950">
                          {formatLabel(request.leaveType)}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-500">
                          {request.reason || "No reason provided"}
                        </p>
                      </div>

                      <DetailValue
                        label="Start Date"
                        value={formatDate(request.startDate)}
                      />

                      <DetailValue
                        label="End Date"
                        value={formatDate(request.endDate)}
                      />

                      <StatusBadge value={request.requestStatus} />
                    </div>
                  ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
          <UserRound className="mx-auto h-8 w-8 text-stone-400" />

          <h2 className="mt-4 font-semibold text-primary-950">
            Staff member not found
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            No employee record is available for ID {staffId}.
          </p>
        </section>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
      <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary-700" />

      <p className="mt-4 font-semibold text-primary-950">
        Loading staff details...
      </p>
    </section>
  );
}

function InfoCard({ icon: Icon, title, description, items }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <DetailValue
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-3 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="border-b border-stone-200 p-6">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailValue({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-primary-950">
        {value ?? "—"}
      </p>
    </div>
  );
}

function StatusBadge({ value }) {
  const normalizedValue = String(value || "").toUpperCase();

  const successfulStatuses = [
    "ACTIVE",
    "APPROVED",
    "COMPLETED",
    "PRESENT",
    "SCHEDULED",
  ];

  const warningStatuses = [
    "PENDING",
    "IN_PROGRESS",
    "LATE",
  ];

  let classes = "bg-stone-100 text-stone-700";

  if (successfulStatuses.includes(normalizedValue)) {
    classes = "bg-emerald-100 text-emerald-800";
  } else if (warningStatuses.includes(normalizedValue)) {
    classes = "bg-amber-100 text-amber-800";
  } else if (
    ["REJECTED", "CANCELLED", "ABSENT"].includes(
      normalizedValue,
    )
  ) {
    classes = "bg-red-100 text-red-800";
  }

  return (
    <span
      className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {formatLabel(value)}
    </span>
  );
}

function EmptySection({ icon: Icon, title, text }) {
  return (
    <div className="px-6 py-12 text-center">
      <Icon className="mx-auto h-7 w-7 text-stone-400" />

      <h3 className="mt-4 font-semibold text-primary-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {text}
      </p>
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

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

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

  const [hour = "0", minute = "0"] = String(value).split(":");
  const date = new Date();

  date.setHours(Number(hour), Number(minute), 0, 0);

  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function compareDates(firstValue, secondValue) {
  return String(firstValue || "").localeCompare(
    String(secondValue || ""),
  );
}

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  return (
    responseData?.message ||
    responseData?.detail ||
    error?.message ||
    "An unexpected server error occurred."
  );
}