import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  Filter,
  History,
  MapPin,
  Search,
  UtensilsCrossed,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function ReservationHistoryPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            My Reservations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Reservation history
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            View and manage your restaurant table reservations and event
            venue bookings.
          </p>
        </div>

        <Link to="/customer/reservations">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            New Reservation
          </Button>
        </Link>
      </section>

      {/* Summary Cards */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <CalendarCheck className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Upcoming
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">—</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <UtensilsCrossed className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Table Reservations
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">—</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <MapPin className="h-5 w-5 text-gold-600" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Venue Bookings
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">—</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <History className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Previous
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">—</p>
        </div>
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              placeholder="Search reservations"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            >
              <option>All Types</option>
              <option>Table Reservation</option>
              <option>Venue Booking</option>
            </select>
          </div>

          <select
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-stone-500">
          Search and filtering will become available when reservation
          records are connected to the backend.
        </p>
      </section>

      {/* Reservation List */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary-950">
              Reservation records
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Your table and venue booking records will appear here.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No reservation records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Reservation history will be retrieved from the Aurevia
            database after the reservation backend service is implemented.
          </p>

          <Link
            to="/customer/reservations"
            className="mt-6 inline-block"
          >
            <Button variant="outline">
              Make a Reservation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}