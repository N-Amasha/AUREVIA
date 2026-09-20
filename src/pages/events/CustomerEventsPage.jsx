import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function CustomerEventsPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Event Coordination
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            My events
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            View your Aurevia events and follow their coordination
            progress from one place.
          </p>
        </div>

        <Link to="/customer/reservations/venue/new">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            Plan New Event
          </Button>
        </Link>
      </section>

      {/* Summary */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <CalendarDays className="h-5 w-5 text-primary-700" />

          <p className="mt-4 text-sm font-medium text-stone-500">
            Upcoming Events
          </p>

          <p className="mt-1 text-2xl font-bold text-primary-950">
            —
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <Clock3 className="h-5 w-5 text-gold-600" />

          <p className="mt-4 text-sm font-medium text-stone-500">
            In Coordination
          </p>

          <p className="mt-1 text-2xl font-bold text-primary-950">
            —
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <CheckCircle2 className="h-5 w-5 text-primary-700" />

          <p className="mt-4 text-sm font-medium text-stone-500">
            Completed Events
          </p>

          <p className="mt-1 text-2xl font-bold text-primary-950">
            —
          </p>
        </div>
      </section>

      {/* Search / Filter Preview */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search your events"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Event Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and status filtering will become available when customer
          event records are connected to the backend.
        </p>
      </section>

      {/* Event Records */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Event Records
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Your coordinated events
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Event details, coordination status and timeline information
            will appear here.
          </p>
        </div>

        {/* Empty State */}
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarDays className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No event records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Your event records will be displayed here after the event
            coordination service is connected to the Aurevia backend.
          </p>

          <Link
            to="/customer/reservations/venue/new"
            className="mt-6 inline-block"
          >
            <Button variant="outline">
              <MapPin className="h-4 w-4" />
              Start Venue Booking
            </Button>
          </Link>
        </div>
      </section>

      {/* Coordination Information */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Event Coordination
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          What you'll be able to follow
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold">Event Details</p>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Review the main information associated with your event.
            </p>
          </div>

          <div>
            <p className="font-semibold">Services</p>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Review services associated with event coordination.
            </p>
          </div>

          <div>
            <p className="font-semibold">Timeline</p>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Follow coordination activities and event progress.
            </p>
          </div>

          <div>
            <p className="font-semibold">Feedback</p>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Provide feedback after the event is completed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}