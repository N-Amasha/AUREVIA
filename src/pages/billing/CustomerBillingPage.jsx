import { Link } from "react-router-dom";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  ReceiptText,
  Upload,
} from "lucide-react";

export default function CustomerBillingPage() {
  const actions = [
    {
      title: "My Invoices",
      description:
        "View invoices generated for your Aurevia reservations and event bookings.",
      icon: ReceiptText,
      path: "/customer/billing/invoices",
    },
    {
      title: "Upload Payment Slip",
      description:
        "Upload a bank payment slip for an invoice awaiting payment verification.",
      icon: Upload,
      path: "/customer/billing/payment-slip",
    },
    {
      title: "Payment History",
      description:
        "Review the verification status of your submitted payments.",
      icon: Banknote,
      path: "/customer/billing/history",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          My billing
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review your invoices, submit bank payment slips and follow
          payment verification status.
        </p>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Billing records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Invoices and payment records will be retrieved from the
              Aurevia backend after the Billing & Payment service is
              implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={FileText}
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
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Billing Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage your payments
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

      {/* Payment Process */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Payment Process
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How bank payment verification works
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProcessStep
            number="01"
            title="Invoice"
            text="An invoice is generated for the relevant reservation or booking."
          />

          <ProcessStep
            number="02"
            title="Bank Payment"
            text="The customer makes the required payment through the supported bank process."
          />

          <ProcessStep
            number="03"
            title="Upload Slip"
            text="The customer uploads the bank payment slip as payment evidence."
          />

          <ProcessStep
            number="04"
            title="Verification"
            text="A cashier reviews the payment evidence and approves or rejects it."
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