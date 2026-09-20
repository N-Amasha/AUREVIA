import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Info,
  Search,
  Users,
} from "lucide-react";

export default function AttendanceManagementPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Staff Management & Allocation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Attendance management
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review employee attendance records and compare actual attendance
          with scheduled workforce activities.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Attendance records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Attendance information will be retrieved from the Aurevia
              backend after database integration. No real attendance records
              are currently displayed or modified.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Staff Records"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Present"
        />

        <SummaryCard
          icon={Clock}
          label="Late"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Absent"
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

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />

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
            <option>All Attendance Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Attendance search and filtering will become available after
          attendance records are connected to the backend.
        </p>
      </section>

      {/* Attendance Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Attendance records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Employee attendance information will appear here after
                backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Employee</span>
          <span>Date</span>
          <span>Shift</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ClipboardCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No attendance records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Attendance records will appear here once workforce information
            is connected to the backend.
          </p>
        </div>
      </section>

      {/* Attendance Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Attendance Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Connecting schedules with actual attendance
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Scheduled"
            text="The employee has an approved work shift."
          />

          <FlowStep
            number="02"
            title="Check In"
            text="The employee's arrival can be recorded."
          />

          <FlowStep
            number="03"
            title="Check Out"
            text="The employee's departure can be recorded."
          />

          <FlowStep
            number="04"
            title="Attendance Status"
            text="The system can determine the relevant attendance status using defined backend rules."
          />
        </div>
      </section>

      {/* Concept */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Important distinction
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Concept
            title="Shift"
            text="The planned working period."
          />

          <Concept
            title="Attendance"
            text="The employee's actual attendance information."
          />

          <Concept
            title="Assignment"
            text="The operational work allocated to the employee."
          />
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

function Concept({ title, text }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gold-600">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-stone-700">
        {text}
      </p>
    </div>
  );
}