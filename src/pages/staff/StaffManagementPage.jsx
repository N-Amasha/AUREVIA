/* oxlint-disable react/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { getAllEmployees } from "../../api/staffApi";

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
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

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load staff records."
  );
}

export default function StaffManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAllEmployees();

      setEmployees(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const roles = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map((employee) => employee.role)
          .filter(Boolean),
      ),
    ).sort();
  }, [employees]);

  const statuses = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map(
            (employee) =>
              employee.employmentStatus,
          )
          .filter(Boolean),
      ),
    ).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const searchableText = [
        employee.fullName,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.role,
        employee.employmentStatus,
        employee.supervisorName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesRole =
        roleFilter === "ALL" ||
        employee.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        employee.employmentStatus === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  const activeCount = employees.filter(
    (employee) =>
      employee.employmentStatus?.toUpperCase() ===
      "ACTIVE",
  ).length;

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Management & Allocation
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Staff management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review employee identities, workforce roles,
            employment status and reporting relationships.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEmployees}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Staff Members"
          value={employees.length}
        />

        <SummaryCard
          icon={UserCheck}
          label="Active Staff"
          value={activeCount}
        />

        <SummaryCard
          icon={Users}
          label="Staff Roles"
          value={roles.length}
        />
      </section>

      {/* Search and filters */}
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
              placeholder="Search name, email or supervisor"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500"
          >
            <option value="ALL">All Roles</option>

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
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredEmployees.length} of{" "}
          {employees.length} staff members.
        </p>
      </section>

      {/* Staff table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Users className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Staff directory
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Authoritative employee records stored in the
                Aurevia database.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Employee</span>
          <span>Role</span>
          <span>Contact</span>
          <span>Status</span>
          <span>Joined</span>
          <span>Action</span>
        </div>

        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading staff records...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Users className="mx-auto h-7 w-7 text-primary-700" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No staff members found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No employee records match the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.employeeId}
                className="grid gap-4 px-6 py-5 xl:grid-cols-6 xl:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {employee.fullName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Employee #{employee.employeeId}
                  </p>
                </div>

                <p className="text-sm text-stone-600">
                  {formatLabel(employee.role)}
                </p>

                <p className="break-all text-sm text-stone-600">
                  {employee.email}
                </p>

                <div>
                  <StatusBadge
                    status={employee.employmentStatus}
                  />
                </div>

                <p className="text-sm text-stone-600">
                  {formatDate(employee.hireDate)}
                </p>

                <Link
                  to={`/hr/staff/${employee.employeeId}`}
                  className="text-sm font-semibold text-primary-700 hover:text-primary-900"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role explanation */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Roles come from employee subtype records
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Aurevia determines each employee role from the
          appropriate subtype table, such as restaurant
          manager, event coordinator, chef, cashier,
          inventory manager, HR manager or restaurant staff.
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

function StatusBadge({ status }) {
  const isActive =
    status?.toUpperCase() === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-stone-100 text-stone-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}