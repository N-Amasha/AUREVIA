import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Info,
  MapPin,
  Tags,
  TableProperties,
} from "lucide-react";

export default function RestaurantManagerDashboardPage() {
  const actions = [
    {
      title: "Manage Reservations",
      description:
        "Review table and venue reservation records and their current status.",
      icon: CalendarCheck,
      path: "/restaurant-manager/reservations",
    },
    {
      title: "Manage Tables",
      description:
        "Review restaurant tables, capacity and future availability information.",
      icon: TableProperties,
      path: "/restaurant-manager/tables",
    },
    {
      title: "Manage Venues",
      description:
        "Review event venues, capacity and future booking availability.",
      icon: MapPin,
      path: "/restaurant-manager/venues",
    },
    {
      title: "Pricing Rules",
      description:
        "Review future pricing rules used when reservation prices are calculated.",
      icon: Tags,
      path: "/restaurant-manager/pricing",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Reservation Operations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Restaurant manager dashboard
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Monitor table and venue reservation operations and manage the
          resources required for customer bookings.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Reservation backend not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Reservation records, table and venue availability, and pricing
              rules will be loaded from the Spring Boot backend after database
              integration. The current workspace is frontend only.
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
          label="Restaurant Tables"
        />

        <SummaryCard
          icon={MapPin}
          label="Event Venues"
        />

        <SummaryCard
          icon={Tags}
          label="Pricing Rules"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Management
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Reservation management
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reservation Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From availability to confirmed reservation
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Check Availability"
            text="The system checks the requested table or venue against existing bookings."
          />

          <FlowStep
            number="02"
            title="Calculate Price"
            text="Applicable reservation and pricing rules are evaluated."
          />

          <FlowStep
            number="03"
            title="Create Reservation"
            text="The booking request is recorded with its appropriate status."
          />

          <FlowStep
            number="04"
            title="Payment Verification"
            text="Reservation confirmation can follow the required payment-slip verification workflow."
          />
        </div>
      </section>

      {/* Important note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Availability must come from backend data
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          The frontend will not label a table or venue as available until
          availability can be evaluated against stored reservations and
          booking rules. This prevents the interface from presenting demo
          values as real-time availability.
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