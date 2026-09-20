import { Link } from "react-router-dom";
import {
  Clock3,
  FileCheck2,
  Info,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function PaymentVerificationQueuePage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payment Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Payment verification
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review bank payment slips submitted by customers and process
          payments awaiting verification.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Payment queue not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Submitted payment records will appear here after the Billing
              & Payment service is connected to the Aurevia backend.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Pending Verification"
        />

        <SummaryCard
          icon={FileCheck2}
          label="Reviewed Today"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Awaiting Decision"
        />
      </section>

      {/* Search / Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search payment, invoice or customer"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>Pending Verification</option>
          </select>

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after payment records
          are retrieved from the backend.
        </p>
      </section>

      {/* Queue */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Verification queue
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Customer payments requiring cashier review will appear
                here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Payment</span>
          <span>Invoice</span>
          <span>Customer</span>
          <span>Payment Date</span>
          <span>Reference</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ShieldCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No payments awaiting verification
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Pending payment submissions will appear here after payment
            records are connected to the backend.
          </p>
        </div>
      </section>

      {/* Development Route */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <FileCheck2 className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Payment verification details
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
              Each pending payment will later open a verification screen
              where the cashier can compare the invoice and submitted
              payment evidence before making a decision.
            </p>

            <Link
              to="/cashier/payments/demo"
              className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              Open verification template →
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Verification Process
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From payment submission to cashier decision
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Pending"
            text="A customer submits payment evidence for an invoice."
          />

          <FlowStep
            number="02"
            title="Review"
            text="The cashier opens the payment and reviews its related information."
          />

          <FlowStep
            number="03"
            title="Compare"
            text="The submitted evidence is checked against the relevant invoice."
          />

          <FlowStep
            number="04"
            title="Decide"
            text="The cashier approves the payment or rejects it with a reason."
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