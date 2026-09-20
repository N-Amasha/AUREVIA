import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  Search,
} from "lucide-react";

export default function ManageEventsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Manage events
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review event records, monitor coordination status and open
          individual events for further management.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Event records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Event records will be retrieved from the Aurevia backend
              after the Event Coordination service and database integration
              are implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CalendarDays}
          label="Upcoming Events"
        />

        <SummaryCard
          icon={Clock3}
          label="In Coordination"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed Events"
        />
      </section>

      {/* Search and Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search events"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

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
          Search, status and date filtering will become available when
          event records are loaded from the backend.
        </p>
      </section>

      {/* Event Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Event records
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Events assigned for coordination will appear here.
          </p>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Event</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Venue</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarDays className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No event records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Coordinator event records will appear here after the Event
            Coordination backend is connected.
          </p>
        </div>
      </section>

      {/* Future record behavior */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-primary-950">
          Event management flow
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FlowItem number="01" text="Open event record" />
          <FlowItem number="02" text="Review requirements" />
          <FlowItem number="03" text="Coordinate services and timeline" />
          <FlowItem number="04" text="Track event completion" />
        </div>

        {/* Temporary route test */}
        <div className="mt-6 border-t border-stone-200 pt-5">
          <p className="text-xs leading-5 text-stone-500">
            Development route test:
          </p>

          <Link
            to="/event-coordinator/events/demo"
            className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            Open event management template →
          </Link>
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

function FlowItem({ number, text }) {
  return (
    <div className="rounded-xl bg-cream-50 p-4">
      <p className="text-xs font-bold text-gold-600">
        {number}
      </p>

      <p className="mt-2 text-sm font-medium text-primary-950">
        {text}
      </p>
    </div>
  );
}