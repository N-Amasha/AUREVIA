import {
  CalendarCheck,
  Clock,
  Info,
  Search,
  TableProperties,
  MapPin,
} from "lucide-react";

export default function ManageReservationsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Reservation Operations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Manage reservations
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review customer table reservations and event venue booking
          requests from one reservation management workspace.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Reservation records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Table reservations, venue bookings, customer information and
              reservation statuses will be retrieved from the Spring Boot
              backend after database integration.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarCheck}
          label="Reservations"
        />

        <SummaryCard
          icon={TableProperties}
          label="Table Reservations"
        />

        <SummaryCard
          icon={MapPin}
          label="Venue Bookings"
        />

        <SummaryCard
          icon={Clock}
          label="Pending Requests"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_200px_200px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search reservation or customer"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Types</option>
            <option>Table Reservation</option>
            <option>Venue Booking</option>
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
          Search and filtering will become available when reservation
          records are connected to the backend.
        </p>
      </section>

      {/* Reservation Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Reservation records
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Table and venue reservation records will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Reference</span>
          <span>Customer</span>
          <span>Type</span>
          <span>Date</span>
          <span>Time</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No reservation records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Customer reservation and venue booking records will appear here
            after the reservation backend is connected.
          </p>
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reservation Status Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          A booking request is not automatically a confirmed reservation
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Request"
            text="The customer submits a table reservation or venue booking request."
          />

          <FlowStep
            number="02"
            title="Record"
            text="The system stores the reservation request with its appropriate status."
          />

          <FlowStep
            number="03"
            title="Payment"
            text="Where payment is required, the customer uploads bank payment evidence."
          />

          <FlowStep
            number="04"
            title="Confirmation"
            text="Confirmation follows the defined reservation and payment-verification rules."
          />
        </div>
      </section>

      {/* Integration */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Connected to Billing & Payments
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Reservation management and payment verification are separate
          responsibilities. The Restaurant Manager reviews reservation
          operations, while payment evidence is verified through the Cashier
          workflow. Backend business rules will coordinate the resulting
          reservation status.
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