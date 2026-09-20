import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  FileText,
  Info,
  Search,
} from "lucide-react";

export default function CustomerInvoicesPage() {
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
          My invoices
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoices generated for your Aurevia reservations and
          event bookings.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Invoice records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Your invoices will appear here after the Billing & Payment
              service is connected to the Aurevia backend.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Invoices" />
        <SummaryCard label="Awaiting Payment" />
        <SummaryCard label="Paid / Verified" />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search invoices"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Invoice Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and status filtering will become available when invoice
          records are loaded from the backend.
        </p>
      </section>

      {/* Invoice List */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Invoice records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Invoices associated with your account will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop headings */}
        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Invoice</span>
          <span>Reference</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <FileText className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No invoices available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Your invoice records will appear here after billing data is
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Development Route */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Invoice details
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Each invoice will later open a detailed view containing its
              billing information and payment status.
            </p>

            <Link
              to="/customer/billing/invoices/demo"
              className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              Open invoice details template →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <FileText className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}