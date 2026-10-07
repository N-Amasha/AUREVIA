import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  createEmployeeTask,
  getAllEmployeeTasks,
  getAllEmployees,
  updateEmployeeTaskStatus,
} from "../../api/staffApi";

const initialForm = {
  employeeId: "",
  eventId: "",
  taskDescription: "",
  dueDate: "",
};

export default function StaffAssignmentsPage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
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
        const [taskData, employeeData] = await Promise.all([
          getAllEmployeeTasks(),
          getAllEmployees(),
        ]);

        if (!active) {
          return;
        }

        setTasks(Array.isArray(taskData) ? taskData : []);
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

  const statuses = useMemo(
    () =>
      [
        ...new Set(
          tasks
            .map((task) => task.taskStatus)
            .filter(Boolean),
        ),
      ].sort(),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return tasks.filter((task) => {
      const searchableText = [
        task.taskId,
        task.employeeName,
        task.taskDescription,
        task.eventName,
        task.eventId,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const taskType = task.eventId
        ? "EVENT"
        : "GENERAL";

      const matchesType =
        !typeFilter || taskType === typeFilter;

      const matchesStatus =
        !statusFilter ||
        task.taskStatus?.toUpperCase() ===
          statusFilter.toUpperCase();

      const matchesDate =
        !dateFilter || task.dueDate === dateFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    tasks,
    searchTerm,
    typeFilter,
    statusFilter,
    dateFilter,
  ]);

  const assignedStaffCount = new Set(
    tasks.map((task) => task.employeeId),
  ).size;

  const upcomingCount = tasks.filter(
    (task) =>
      !task.overdue &&
      task.taskStatus?.toUpperCase() !== "COMPLETED",
  ).length;

  const completedCount = tasks.filter(
    (task) =>
      task.taskStatus?.toUpperCase() === "COMPLETED",
  ).length;

  const overdueCount = tasks.filter(
    (task) => task.overdue,
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

  async function handleCreateTask(event) {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (
      !form.employeeId ||
      !form.taskDescription.trim() ||
      !form.dueDate
    ) {
      setFormError(
        "Employee, task description and due date are required.",
      );
      return;
    }

    try {
      setSaving(true);

      const createdTask = await createEmployeeTask({
        employeeId: Number(form.employeeId),
        eventId: form.eventId
          ? Number(form.eventId)
          : null,
        taskDescription: form.taskDescription.trim(),
        dueDate: form.dueDate,
      });

      setTasks((current) =>
        [...current, createdTask].sort(compareTasks),
      );
      setForm(initialForm);
      setShowForm(false);
      setSuccess("Assignment created successfully.");
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(task, taskStatus) {
    if (
      !taskStatus ||
      taskStatus === task.taskStatus
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const updatedTask =
        await updateEmployeeTaskStatus(
          task.taskId,
          taskStatus,
        );

      setTasks((current) =>
        current.map((item) =>
          item.taskId === updatedTask.taskId
            ? updatedTask
            : item,
        ),
      );

      setSuccess(
        `Assignment #${task.taskId} status updated successfully.`,
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
            Staff assignments
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review and manage operational work assigned to
            staff across restaurant and event activities.
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
            Create Assignment
          </button>
        </div>
      </section>

      {error && (
        <MessageBox type="error" message={error} />
      )}

      {success && (
        <MessageBox type="success" message={success} />
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={ListChecks}
          label="Assignments"
          value={tasks.length}
        />

        <SummaryCard
          icon={Users}
          label="Staff Assigned"
          value={assignedStaffCount}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Upcoming"
          value={upcomingCount}
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
              placeholder="Search employee or assignment"
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
            <option value="">All Assignment Types</option>
            <option value="GENERAL">General</option>
            <option value="EVENT">Event</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          >
            <option value="">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredTasks.length} of {tasks.length}{" "}
          assignments.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Assignment records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Authoritative staff task records stored in the
                Aurevia database.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
              <span>Employee</span>
              <span className="col-span-2">
                Assignment
              </span>
              <span>Type</span>
              <span>Due Date</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-stone-200">
              {filteredTasks.map((task) => (
                <div
                  key={task.taskId}
                  className="grid gap-4 px-6 py-5 xl:grid-cols-7 xl:items-center"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {task.employeeName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Employee #{task.employeeId}
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <p className="font-medium text-primary-950">
                      {task.taskDescription}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Assignment #{task.taskId} · Assigned{" "}
                      {formatDate(task.assignedDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {task.eventId ? "Event" : "General"}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {task.eventName ||
                        (task.eventId
                          ? `Event #${task.eventId}`
                          : "No event reference")}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`text-sm ${
                        task.overdue
                          ? "font-semibold text-red-700"
                          : "text-stone-700"
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </p>

                    {task.overdue && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        Overdue
                      </p>
                    )}
                  </div>

                  <StatusBadge
                    value={task.taskStatus}
                  />

                  <select
                    value={task.taskStatus}
                    onChange={(event) =>
                      handleStatusChange(
                        task,
                        event.target.value,
                      )
                    }
                    className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-primary-900 outline-none"
                  >
                    <option value="PENDING">
                      Pending
                    </option>
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
              ))}
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
                  Create assignment
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Assign operational work to an employee.
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
              onSubmit={handleCreateTask}
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

              <FormField label="Event ID (optional)">
                <input
                  type="number"
                  name="eventId"
                  min="1"
                  value={form.eventId}
                  onChange={handleInputChange}
                  placeholder="Leave blank for a general task"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </FormField>

              <FormField label="Task Description">
                <textarea
                  name="taskDescription"
                  value={form.taskDescription}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  maxLength="500"
                  placeholder="Describe the operational work"
                  className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </FormField>

              <FormField label="Due Date">
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  min={getLocalDate()}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-500"
                />
              </FormField>

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
                    ? "Creating..."
                    : "Create Assignment"}
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

  if (normalized === "COMPLETED") {
    classes = "bg-emerald-100 text-emerald-800";
  } else if (normalized === "IN_PROGRESS") {
    classes = "bg-blue-100 text-blue-800";
  } else if (normalized === "PENDING") {
    classes = "bg-amber-100 text-amber-800";
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
        Loading assignments...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <ListChecks className="mx-auto h-7 w-7 text-stone-400" />

      <h3 className="mt-4 font-semibold text-primary-950">
        No matching assignments
      </h3>

      <p className="mt-2 text-sm text-stone-600">
        Create an assignment or adjust the current filters.
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

function getLocalDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
}

function compareTasks(first, second) {
  return String(first.dueDate || "").localeCompare(
    String(second.dueDate || ""),
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