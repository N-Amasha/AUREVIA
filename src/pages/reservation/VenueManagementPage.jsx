import {
  Building2,
  CalendarCheck,
  Info,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";

export default function VenueManagementPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Reservation Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Venue management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage event venues and the capacity information used when
            processing customer venue booking requests.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Venue
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Venue records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Venue information and booking availability will be retrieved
              from the Spring Boot backend after database integration. The
              frontend does not currently provide real-time venue
              availability.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Building2}
          label="Event Venues"
        />

        <SummaryCard
          icon={Users}
          label="Total Venue Capacity"
        />

        <SummaryCard
          icon={CalendarCheck}
          label="Venue Bookings"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search venue"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Capacities</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after venue records
          are connected to the backend.
        </p>
      </section>

      {/* Venue Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Event venues
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Venue records will appear here after backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Venue</span>
          <span>Capacity</span>
          <span>Location</span>
          <span>Status</span>
          <span>Availability</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <MapPin className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No venue records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Event venues will appear here once venue management and booking
            services are connected to the database.
          </p>
        </div>
      </section>

      {/* Availability */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Venue Availability
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Avoid overlapping venue bookings
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Request"
            text="Receive the requested venue, date, time and guest requirements."
          />

          <FlowStep
            number="02"
            title="Capacity"
            text="Check whether the venue can support the requested number of guests."
          />

          <FlowStep
            number="03"
            title="Conflict Check"
            text="Compare the requested period against existing venue bookings."
          />

          <FlowStep
            number="04"
            title="Availability"
            text="Return availability only when the applicable booking rules are satisfied."
          />
        </div>
      </section>

      {/* Integration */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Venue Booking → Event Coordination
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Venue booking and event coordination are related but separate
          responsibilities. Reservation management handles the venue booking
          process, while confirmed event information can later support event
          services, timelines and vendor coordination.
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