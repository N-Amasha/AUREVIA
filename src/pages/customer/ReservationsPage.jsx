import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  History,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

export default function ReservationsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Reservations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Plan your next experience
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Manage restaurant table reservations and event venue bookings
          through your Aurevia account.
        </p>
      </section>

      {/* Reservation Options */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Table Reservation */}
        <Link
          to="/customer/reservations/table/new"
          className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-primary-900">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-primary-950">
            Reserve a Table
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Select your preferred date, time and number of guests before
            checking suitable restaurant table options.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-800">
            Start reservation
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Venue Reservation */}
        <Link
          to="/customer/reservations/venue/new"
          className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-gold-500">
            <MapPin className="h-6 w-6 text-primary-950" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-primary-950">
            Book an Event Venue
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Begin an event venue booking by providing your event date,
            guest count and venue requirements.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-800">
            Start venue booking
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* Reservation Management */}
      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            My Reservations
          </p>

          <h2 className="mt-2 text-2xl font-bold text-primary-950">
            Reservation activity
          </h2>
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <History className="h-5 w-5 text-primary-800" />
              </div>

              <div>
                <h3 className="font-semibold text-primary-950">
                  Reservation history
                </h3>

                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Your current and previous reservation records will be
                  displayed here after backend integration.
                </p>

                <Link
                    to="/customer/reservations/history"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:text-primary-950"
                    >
                    View reservation history
                    <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-8 text-center">
            <CalendarCheck className="mx-auto h-8 w-8 text-stone-400" />

            <p className="mt-3 text-sm font-medium text-stone-700">
              No reservation data available
            </p>

            <p className="mt-1 text-xs leading-5 text-stone-500">
              Reservation records will be retrieved from the Aurevia
              backend when the reservation service is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <CalendarPlus className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Availability integration
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Actual table and venue availability will be checked by the
              reservation service after backend integration. This
              frontend does not currently claim real-time availability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}