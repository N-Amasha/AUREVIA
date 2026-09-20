import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  Search,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

export default function LeaveRequestsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Staff Management & Allocation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Leave requests
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review employee leave requests and monitor their approval status
          before planning staff availability.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Leave records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Leave requests will be retrieved from the Aurevia backend
              after database integration. Approval and rejection actions are
              not active in the current frontend.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={UserRoundCheck}
          label="Leave Requests"
        />

        <SummaryCard
          icon={Clock}
          label="Pending"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved"
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected"
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
              placeholder="Search employee"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Leave Types</option>
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
          Search and filtering will become available after leave request
          records are connected to the backend.
        </p>
      </section>

      {/* Leave Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Leave request records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Submitted staff leave requests will appear here after
                backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Employee</span>
          <span>Leave Type</span>
          <span>Start Date</span>
          <span>End Date</span>
          <span>Reason</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <UserRoundCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No leave requests available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Employee leave requests will appear here once leave information
            is connected to the backend.
          </p>
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Leave Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From leave request to workforce availability
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Request"
            text="An employee submits a leave request for a specified period."
          />

          <FlowStep
            number="02"
            title="Review"
            text="The authorized manager reviews the leave information."
          />

          <FlowStep
            number="03"
            title="Decision"
            text="The request can be approved or rejected according to defined business rules."
          />

          <FlowStep
            number="04"
            title="Availability"
            text="Approved leave can later be considered when planning shifts and staff allocation."
          />
        </div>
      </section>

      {/* Integration */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Why leave matters for staff allocation
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          A staff member may exist in the employee records but still be
          unavailable for a particular period because of approved leave.
          Future allocation logic should therefore consider staff
          availability before recommending employees for operational work.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-primary-900">
          <span className="rounded-lg bg-white px-3 py-2">
            Employee
          </span>

          <span>→</span>

          <span className="rounded-lg bg-white px-3 py-2">
            Leave
          </span>

          <span>→</span>

          <span className="rounded-lg bg-white px-3 py-2">
            Availability
          </span>

          <span>→</span>

          <span className="rounded-lg bg-white px-3 py-2">
            Staff Allocation
          </span>
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