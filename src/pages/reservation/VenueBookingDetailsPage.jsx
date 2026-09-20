import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Info,
  ReceiptText,
  Users,
} from "lucide-react";

export default function VenueBookingDetailsPage() {
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
          Booking Details
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Event venue booking
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review the selected venue, event schedule, guest information,
          pricing and booking status.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Venue booking details not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              The selected venue booking will be retrieved using its booking
              identifier after the Spring Boot reservation API is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Status */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Booking Type
            </p>

            <p className="mt-2 text-lg font-semibold text-primary-950">
              Event Venue
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

      {/* Booking Information */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Venue booking information
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Details associated with the selected event venue booking.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            icon={Building2}
            label="Venue"
          />

          <DetailField
            icon={CalendarDays}
            label="Event Date"
          />

          <DetailField
            icon={Clock3}
            label="Event Time"
          />

          <DetailField
            icon={Users}
            label="Expected Guests"
          />

          <DetailField
            icon={ReceiptText}
            label="Calculated Price"
          />
        </div>
      </section>

      {/* Event Coordination */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Event Coordination
        </p>

        <h2 className="mt-2 text-lg font-semibold text-primary-950">
          Booking and event coordination
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          A venue booking reserves the required venue and schedule. Event
          coordination can then manage the wider event activities such as
          timeline progress, services and vendor coordination.
        </p>

        <Link
          to="/customer/events"
          className="mt-5 inline-flex rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
        >
          View My Events
        </Link>
      </section>

      {/* Billing */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Billing
        </p>

        <h2 className="mt-2 text-lg font-semibold text-primary-950">
          Payment & confirmation
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          When payment is required, the related invoice and uploaded bank
          payment slip will be handled through the Billing & Payments module.
          Cashier verification determines the payment verification result.
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
          Venue Booking Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From venue selection to confirmed booking
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Availability"
            text="The venue and requested event schedule are checked for conflicts."
          />

          <FlowStep
            number="02"
            title="Pricing"
            text="Applicable pricing information is used to calculate the booking price."
          />

          <FlowStep
            number="03"
            title="Payment"
            text="The customer follows the invoice and bank-slip payment process when required."
          />

          <FlowStep
            number="04"
            title="Confirmation"
            text="The booking status is updated according to the completed verification workflow."
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