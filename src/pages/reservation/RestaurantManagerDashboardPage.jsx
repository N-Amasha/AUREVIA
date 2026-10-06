/* oxlint-disable react/set-state-in-effect */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CircleAlert,
  MapPin,
  Tags,
  TableProperties,
} from "lucide-react";
import {
  getAllEventBookings,
  getAllRestaurantTables,
  getAllTableReservations,
  getAllVenues,
} from "../../api/reservationApi";
import { getAllPricingRules } from "../../api/pricingApi";

export default function RestaurantManagerDashboardPage() {
  const [summary, setSummary] = useState({
    reservations: 0,
    tables: 0,
    venues: 0,
    pricingRules: 0,
    pendingReservations: 0,
    pendingPricingRules: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const actions = [
    {
      title: "Manage Reservations",
      description:
        "Review table reservations and venue bookings with their current statuses.",
      icon: CalendarCheck,
      path: "/restaurant-manager/reservations",
      value: summary.reservations,
      detail: `${summary.pendingReservations} pending requests`,
    },
    {
      title: "Manage Tables",
      description:
        "Manage restaurant tables, seating capacity and operational status.",
      icon: TableProperties,
      path: "/restaurant-manager/tables",
      value: summary.tables,
      detail: "Database table records",
    },
    {
      title: "Manage Venues",
      description:
        "Manage event venues, capacities, prices, features and availability.",
      icon: MapPin,
      path: "/restaurant-manager/venues",
      value: summary.venues,
      detail: "Database venue records",
    },
    {
      title: "Pricing Rules",
      description:
        "Manage venue prices, surcharges, effective dates and approval status.",
      icon: Tags,
      path: "/restaurant-manager/pricing",
      value: summary.pricingRules,
      detail: `${summary.pendingPricingRules} pending approval`,
    },
  ];

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          tableReservations,
          eventBookings,
          tables,
          venues,
          pricingRules,
        ] = await Promise.all([
          getAllTableReservations(),
          getAllEventBookings(),
          getAllRestaurantTables(),
          getAllVenues(),
          getAllPricingRules(),
        ]);

        const safeTableReservations = Array.isArray(
          tableReservations,
        )
          ? tableReservations
          : [];

        const safeEventBookings = Array.isArray(
          eventBookings,
        )
          ? eventBookings
          : [];

        const safeTables = Array.isArray(tables)
          ? tables
          : [];

        const safeVenues = Array.isArray(venues)
          ? venues
          : [];

        const safePricingRules = Array.isArray(
          pricingRules,
        )
          ? pricingRules
          : [];

        const pendingTableReservations =
          safeTableReservations.filter(
            (reservation) =>
              reservation.reservationStatus ===
              "PENDING",
          ).length;

        const pendingEventBookings =
          safeEventBookings.filter(
            (booking) =>
              booking.bookingStatus === "PENDING",
          ).length;

        const pendingPricingRules =
          safePricingRules.filter(
            (rule) =>
              rule.approvalStatus === "PENDING",
          ).length;

        setSummary({
          reservations:
            safeTableReservations.length +
            safeEventBookings.length,
          tables: safeTables.length,
          venues: safeVenues.length,
          pricingRules: safePricingRules.length,
          pendingReservations:
            pendingTableReservations +
            pendingEventBookings,
          pendingPricingRules,
        });
      } catch (loadError) {
        setError(
          getErrorMessage(
            loadError,
            "Unable to load restaurant manager dashboard.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Reservation Operations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Restaurant manager dashboard
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Monitor reservation activity and manage
          tables, venues and pricing rules from one
          database-connected workspace.
        </p>
      </section>

      {error && (
        <section className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-semibold">
              Dashboard data could not be loaded
            </h2>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarCheck}
          label="Reservations"
          value={
            loading
              ? "—"
              : summary.reservations
          }
          description={
            loading
              ? "Loading records"
              : `${summary.pendingReservations} pending`
          }
        />

        <SummaryCard
          icon={TableProperties}
          label="Restaurant Tables"
          value={
            loading ? "—" : summary.tables
          }
          description="Managed table records"
        />

        <SummaryCard
          icon={MapPin}
          label="Event Venues"
          value={
            loading ? "—" : summary.venues
          }
          description="Managed venue records"
        />

        <SummaryCard
          icon={Tags}
          label="Pricing Rules"
          value={
            loading
              ? "—"
              : summary.pricingRules
          }
          description={
            loading
              ? "Loading records"
              : `${summary.pendingPricingRules} pending approval`
          }
        />
      </section>

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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                    <Icon className="h-5 w-5 text-primary-700" />
                  </div>

                  <p className="text-2xl font-bold text-primary-950">
                    {loading
                      ? "—"
                      : action.value}
                  </p>
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xs font-medium text-stone-500">
                    {loading
                      ? "Loading..."
                      : action.detail}
                  </p>

                  <p className="text-sm font-semibold text-primary-700">
                    Open →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reservation Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From availability to confirmed
          reservation
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Check Availability"
            text="The backend checks tables or venues against existing reservations."
          />

          <FlowStep
            number="02"
            title="Calculate Price"
            text="Approved pricing rules are evaluated for venue bookings."
          />

          <FlowStep
            number="03"
            title="Create Reservation"
            text="The booking request is stored with its initial status."
          />

          <FlowStep
            number="04"
            title="Monitor"
            text="The manager reviews reservation, resource and pricing information."
          />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Live database integration
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Dashboard totals come from the reservation,
          event-booking, restaurant-table, venue and
          pricing-rule backend services. Changes made
          through the management pages are reflected
          when this dashboard reloads.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-stone-500">
        {description}
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

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}