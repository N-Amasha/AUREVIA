import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  History,
  Info,
  Search,
  XCircle,
} from "lucide-react";

export default function CustomerPaymentHistoryPage() {
  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/billing"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Billing
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Payment history
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review your submitted payment records and their cashier
          verification status.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Payment records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Your payment submissions and cashier verification results
              will appear here after the Billing & Payment service is
              connected to the Aurevia backend.
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
          icon={CheckCircle2}
          label="Verified Payments"
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected Payments"
        />
      </section>

      {/* Search + Status Filter */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_230px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search payment records"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Payment Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and status filtering will become available after payment
          records are loaded from the backend.
        </p>
      </section>

      {/* Payment Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <History className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Payment records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Submitted payment evidence and verification results will
                appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table Headings */}
        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Payment</span>
          <span>Invoice</span>
          <span>Reference</span>
          <span>Payment Date</span>
          <span>Submitted</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <History className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No payment history available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Payment submissions will appear here after payment records are
            connected to the backend.
          </p>

          <Link
            to="/customer/billing/invoices"
            className="mt-5 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            View My Invoices →
          </Link>
        </div>
      </section>

      {/* Status Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Payment Status
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Understanding verification status
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <StatusExplanation
            icon={Clock3}
            title="Pending Verification"
            text="The payment slip has been submitted and is waiting for cashier review."
          />

          <StatusExplanation
            icon={CheckCircle2}
            title="Verified"
            text="The cashier has reviewed and approved the submitted payment evidence."
          />

          <StatusExplanation
            icon={XCircle}
            title="Rejected"
            text="The submitted payment evidence was rejected and a reason should be provided."
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

function StatusExplanation({ icon: Icon, title, text }) {
  return (
    <div>
      <Icon className="h-5 w-5 text-gold-400" />

      <h3 className="mt-3 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
}