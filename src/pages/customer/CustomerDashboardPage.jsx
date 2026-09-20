import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarDays,
  ChefHat,
  CreditCard,
  ArrowRight,
  Clock3,
} from "lucide-react";

const quickActions = [
  {
    title: "Make a Reservation",
    description: "Plan a restaurant table or event venue reservation.",
    icon: CalendarCheck,
    path: "/customer/reservations",
  },
  {
    title: "Explore Menu",
    description: "Browse menu options and dietary information.",
    icon: ChefHat,
    path: "/customer/menu",
  },
  {
    title: "My Events",
    description: "View your event requests and coordination progress.",
    icon: CalendarDays,
    path: "/customer/events",
  },
  {
    title: "Billing & Payments",
    description: "View invoices and manage payment slip submissions.",
    icon: CreditCard,
    path: "/customer/billing",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Customer Portal
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Welcome to Aurevia
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Manage your dining reservations, events, menu preferences,
          invoices and feedback from one place.
        </p>
      </section>

      {/* Backend Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Customer dashboard preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Reservation, event, invoice and account information will
              appear here after the customer services are connected to
              the backend.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Quick Access
          </p>

          <h2 className="mt-2 text-2xl font-bold text-primary-950">
            What would you like to do?
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-800">
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Future Account Information */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Upcoming Reservations
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-8 text-center">
            <CalendarCheck className="mx-auto h-8 w-8 text-stone-400" />

            <p className="mt-3 text-sm font-medium text-stone-700">
              No reservation data available
            </p>

            <p className="mt-1 text-xs leading-5 text-stone-500">
              Your upcoming reservations will be displayed here after
              backend integration.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Recent Payment Activity
          </h2>

          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-8 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-stone-400" />

            <p className="mt-3 text-sm font-medium text-stone-700">
              No payment data available
            </p>

            <p className="mt-1 text-xs leading-5 text-stone-500">
              Invoice and payment verification information will appear
              here when billing services are connected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}