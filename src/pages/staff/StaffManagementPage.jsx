import { Link } from "react-router-dom";
import {
  Info,
  Plus,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

export default function StaffManagementPage() {
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
            Review employee information and manage staff records used across
            Aurevia restaurant and event operations.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Staff records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Employee information will be retrieved from the Aurevia
              backend after database and authentication integration. No real
              employee records are currently displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Staff Members"
        />

        <SummaryCard
          icon={UserCheck}
          label="Active Staff"
        />

        <SummaryCard
          icon={Users}
          label="Staff Roles"
        />
      </section>

      {/* Search and filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search staff members"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Roles</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after staff records are
          loaded from the backend.
        </p>
      </section>

      {/* Staff Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Users className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Staff directory
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Employee records will appear here after backend integration.
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

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Users className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No staff records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Staff members will appear here once employee information is
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Development detail route */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <UserCheck className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Staff member details
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
              Each employee will later open a dedicated page containing
              their staff information and related workforce records.
            </p>

            <Link
              to="/hr/staff/demo"
              className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              Open staff detail template →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}