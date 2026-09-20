import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  MessageSquareHeart,
  Users,
  Wrench,
} from "lucide-react";

export default function EventDetailsPage() {
  const { eventId } = useParams();

  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Events
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Event details
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review event information, coordination progress, services and
          timeline updates.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Event record integration
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This page is prepared to display event record{" "}
              <span className="font-semibold">
                {eventId || "—"}
              </span>
              . Actual event information will be retrieved from the
              backend after the event coordination service is implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Event Overview */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Overview
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Event information
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={CalendarDays}
            label="Event Date"
          />

          <InfoCard
            icon={Clock3}
            label="Event Time"
          />

          <InfoCard
            icon={Users}
            label="Guests"
          />

          <InfoCard
            icon={MapPin}
            label="Venue"
          />
        </div>
      </section>

      {/* Coordination Status */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary-700" />

            <h2 className="text-lg font-semibold text-primary-950">
              Coordination status
            </h2>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-7 text-center">
            <p className="text-sm font-medium text-stone-700">
              No status data available
            </p>

            <p className="mt-2 text-xs leading-5 text-stone-500">
              The current event status will appear here after backend
              integration.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-primary-700" />

            <h2 className="text-lg font-semibold text-primary-950">
              Event services
            </h2>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-7 text-center">
            <p className="text-sm font-medium text-stone-700">
              No service data available
            </p>

            <p className="mt-2 text-xs leading-5 text-stone-500">
              Services associated with this event will be displayed here.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Event timeline
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Follow coordination progress and event updates.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-8 text-center">
          <Clock3 className="mx-auto h-7 w-7 text-stone-400" />

          <p className="mt-3 text-sm font-medium text-stone-700">
            No timeline updates available
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Event timeline records will appear here after the coordination
            service is connected.
          </p>
        </div>
      </section>

      {/* Feedback */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <div className="flex items-start gap-4">
          <MessageSquareHeart className="mt-1 h-6 w-6 shrink-0 text-gold-400" />

          <div>
            <h2 className="text-lg font-semibold">
              Event feedback
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
              After an event is completed, customers will be able to
              provide a rating and written feedback. Sentiment analysis
              can then be applied to the submitted review.
            </p>

            <p className="mt-3 text-xs text-stone-400">
              Feedback submission is not available until an actual
              completed event is loaded.
            </p>

            <Link
                to={`/customer/events/${eventId}/feedback`}
                className="mt-5 inline-block"
                >
                <span className="inline-flex items-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                    Give Feedback
                </span>
            </Link>

            <p className="mt-3 text-xs text-stone-400">
                Final feedback availability will depend on the event completion status
                after backend integration.
            </p>

          </div>
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