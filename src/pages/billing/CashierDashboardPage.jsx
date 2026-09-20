import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  History,
  Info,
  ReceiptText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function CashierDashboardPage() {
  const actions = [
    {
      title: "Manage Invoices",
      description:
        "Review invoice records associated with reservations and event bookings.",
      icon: ReceiptText,
      path: "/cashier/invoices",
    },
    {
      title: "Verify Payment Slips",
      description:
        "Review bank payment evidence submitted by customers.",
      icon: ShieldCheck,
      path: "/cashier/payments",
    },
    {
      title: "Payment History",
      description:
        "Review previously processed payment verification records.",
      icon: History,
      path: "/cashier/history",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Cashier Workspace
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Billing dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoices, verify customer payment evidence and track
          payment processing activity.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Cashier records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Invoice and payment verification records will be retrieved
              from the Aurevia backend after Billing & Payment integration.
              No real financial records are currently displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={ReceiptText}
          label="Invoices"
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Verification"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Verified Payments"
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected Payments"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Cashier Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Payment management
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
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
          Verification Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Cashier payment verification
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProcessStep
            number="01"
            title="Receive"
            text="Customer payment evidence enters the verification queue."
          />

          <ProcessStep
            number="02"
            title="Review"
            text="The cashier reviews the related invoice and payment evidence."
          />

          <ProcessStep
            number="03"
            title="Decide"
            text="The authorized cashier approves or rejects the submitted payment."
          />

          <ProcessStep
            number="04"
            title="Update"
            text="The payment status is updated and becomes visible to the customer."
          />
        </div>
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

function ProcessStep({ number, title, text }) {
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