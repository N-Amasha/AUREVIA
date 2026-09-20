import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  ListChecks,
  Search,
} from "lucide-react";

export default function EventTimelinesPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Event timelines
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Track coordination activities, milestones and progress updates
          across Aurevia events.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Timeline records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Timeline activities will be retrieved from the backend after
              the Event Coordination service and database integration are
              implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ListChecks}
          label="Timeline Activities"
        />

        <SummaryCard
          icon={Clock3}
          label="In Progress"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
        />
      </section>

      {/* Search and filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search timeline activities"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Events</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Timeline search and filtering will become available when real
          event timeline records are loaded.
        </p>
      </section>

      {/* Timeline Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Coordination timeline
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Progress updates associated with coordinated events will
                appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Table headings */}
        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Event</span>
          <span>Activity</span>
          <span>Date</span>
          <span>Status</span>
          <span>Updated By</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarDays className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No timeline activities available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Event timeline activities will appear here after timeline
            records are connected to the backend.
          </p>
        </div>
      </section>

      {/* Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Timeline Purpose
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Track event coordination progress
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TimelinePurpose
            number="01"
            title="Create"
            text="Record a coordination activity for an event."
          />

          <TimelinePurpose
            number="02"
            title="Track"
            text="Follow the current progress of the activity."
          />

          <TimelinePurpose
            number="03"
            title="Update"
            text="Record changes as coordination work progresses."
          />

          <TimelinePurpose
            number="04"
            title="Complete"
            text="Mark the activity complete when its work is finished."
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

function TimelinePurpose({ number, title, text }) {
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