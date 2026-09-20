import {
  CalendarDays,
  Info,
  ListChecks,
  Plus,
  Search,
  Users,
} from "lucide-react";

export default function StaffAssignmentsPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Staff Management & Allocation
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Staff assignments
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review operational work assigned to staff members across
            restaurant and event activities.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Assignment records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Staff assignments will be retrieved from the Aurevia backend
              after database integration. No real assignments are currently
              being created or modified.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={ListChecks}
          label="Assignments"
        />

        <SummaryCard
          icon={Users}
          label="Staff Assigned"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Upcoming"
        />

        <SummaryCard
          icon={ListChecks}
          label="Completed"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_200px_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search employee or assignment"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Assignment Types</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after assignment
          records are connected to the backend.
        </p>
      </section>

      {/* Assignment Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Assignment records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Staff task and operational assignment records will appear
                here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Employee</span>
          <span>Assignment</span>
          <span>Type</span>
          <span>Date</span>
          <span>Reference</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ListChecks className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No staff assignments available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Operational assignments will appear here once workforce records
            are connected to the backend.
          </p>
        </div>
      </section>

      {/* Assignment Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Assignment Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Connecting staff with operational work
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Operational Need"
            text="Restaurant or event operations create a need for staff support."
          />

          <FlowStep
            number="02"
            title="Select Staff"
            text="An appropriate available employee is identified."
          />

          <FlowStep
            number="03"
            title="Assign"
            text="The operational task is associated with the selected employee."
          />

          <FlowStep
            number="04"
            title="Track"
            text="The assignment status can later be monitored through the workforce system."
          />
        </div>
      </section>

      {/* Distinction */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Example
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <ExampleItem
            label="Employee"
            value="Staff member"
          />

          <ExampleItem
            label="Shift"
            value="5:00 PM – 10:00 PM"
          />

          <ExampleItem
            label="Assignment"
            value="Support an evening event"
          />
        </div>

        <p className="mt-5 text-xs leading-5 text-stone-600">
          This example explains the concepts only. It is not a stored Aurevia
          employee or assignment record.
        </p>
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

function ExampleItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
        {label}
      </p>

      <p className="mt-2 font-medium text-primary-950">
        {value}
      </p>
    </div>
  );
}