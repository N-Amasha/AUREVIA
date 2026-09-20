import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Info,
  ReceiptText,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export default function TableReservationDetailsPage() {
  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/reservations/history"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reservation history
      </Link>

      {/* Header */}
      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Reservation Details
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Table reservation
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review the selected table, reservation schedule, pricing and
          confirmation status.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Reservation details not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              The selected reservation will be retrieved using its reservation
              identifier after the Spring Boot reservation API is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Reservation
            </p>

            <p className="mt-2 text-lg font-semibold text-primary-950">
              Table Reservation
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Status
            </p>

            <p className="mt-2 font-semibold text-stone-400">
              —
            </p>
          </div>
        </div>
      </section>

      {/* Reservation Information */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Reservation information
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Details associated with the selected restaurant table booking.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            icon={UtensilsCrossed}
            label="Table"
          />

          <DetailField
            icon={CalendarDays}
            label="Reservation Date"
          />

          <DetailField
            icon={Clock3}
            label="Reservation Time"
          />

          <DetailField
            icon={Users}
            label="Guests"
          />

          <DetailField
            icon={ReceiptText}
            label="Calculated Price"
          />
        </div>
      </section>

      {/* Payment */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Billing
        </p>

        <h2 className="mt-2 text-lg font-semibold text-primary-950">
          Payment & confirmation
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          When payment is required, the related invoice and bank payment slip
          verification status will be provided through the Billing & Payments
          module.
        </p>

        <Link
          to="/customer/billing"
          className="mt-5 inline-flex rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
        >
          View Billing & Payments
        </Link>
      </section>

      {/* Workflow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reservation Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How a reservation reaches confirmation
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Availability"
            text="The requested table and time are checked for availability."
          />

          <FlowStep
            number="02"
            title="Reservation"
            text="The reservation request is created with its calculated price."
          />

          <FlowStep
            number="03"
            title="Payment"
            text="The customer follows the required invoice and bank-slip payment process."
          />

          <FlowStep
            number="04"
            title="Confirmation"
            text="The reservation status is updated according to the completed verification workflow."
          />
        </div>
      </section>
    </div>
  );
}

function DetailField({ icon: Icon, label }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-700" />

        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </p>
      </div>

      <p className="mt-3 text-sm font-semibold text-stone-400">
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