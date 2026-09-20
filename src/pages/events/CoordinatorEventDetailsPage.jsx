import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  ListChecks,
  MapPin,
  Store,
  Users,
  Wrench,
} from "lucide-react";

export default function CoordinatorEventDetailsPage() {
  const { eventId } = useParams();

  return (
    <div>
      {/* Back */}
      <Link
        to="/event-coordinator/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Manage event
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review event information and manage services, timeline progress,
          vendor coordination and event completion.
        </p>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Event management template
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This workspace is prepared for event record{" "}
              <span className="font-semibold">{eventId || "—"}</span>.
              Real event information and management actions will become
              available after backend integration.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Event Overview
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Event information
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={CalendarDays} label="Event Date" />
          <InfoCard icon={Clock3} label="Event Time" />
          <InfoCard icon={Users} label="Customer / Guests" />
          <InfoCard icon={MapPin} label="Venue" />
        </div>
      </section>

      {/* Status */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Coordination status
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Current event coordination state.
            </p>
          </div>
        </div>

        <EmptyPanel
          title="No status available"
          text="Status information will be loaded from the event record."
        />
      </section>

      {/* Services + Vendors */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <ManagementCard
          icon={Wrench}
          title="Event services"
          description="Review services associated with this event."
          emptyTitle="No services available"
          emptyText="Event service records will appear here after backend integration."
        />

        <ManagementCard
          icon={Store}
          title="Vendor coordination"
          description="Review vendors associated with event services."
          emptyTitle="No vendor assignments available"
          emptyText="Vendor coordination information will appear here."
        />
      </section>

      {/* Timeline */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Event timeline
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Track coordination activities and event progress.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            title="Available after backend integration"
            className="cursor-not-allowed rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-500"
          >
            Add Timeline Update
          </button>
        </div>

        <EmptyPanel
          title="No timeline updates"
          text="Timeline records for this event will appear here."
        />
      </section>

      {/* Management Controls */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Event Management
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Coordination actions
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
          Event status updates and completion controls will be enabled
          only when an actual event record is loaded and the coordinator
          is authorized to manage it.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-stone-400"
          >
            Update Status
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-stone-400"
          >
            Complete Event
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, label }) {
  return (
    <div className="rounded-xl bg-cream-50 p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-primary-950">
        —
      </p>
    </div>
  );
}

function ManagementCard({
  icon: Icon,
  title,
  description,
  emptyTitle,
  emptyText,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
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

      <EmptyPanel
        title={emptyTitle}
        text={emptyText}
      />
    </div>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-7 text-center">
      <p className="text-sm font-medium text-stone-700">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-stone-500">
        {text}
      </p>
    </div>
  );
}