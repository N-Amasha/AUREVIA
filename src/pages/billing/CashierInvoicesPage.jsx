import {
  FileText,
  Info,
  ReceiptText,
  Search,
} from "lucide-react";

export default function CashierInvoicesPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payment Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Invoice management
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoices generated for customer reservations and event
          bookings.
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
              Invoice records will be retrieved from the Aurevia backend
              after the Billing & Payment service is implemented.
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search invoice or customer"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Invoice Statuses</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Booking Types</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available when invoice records
          are loaded from the backend.
        </p>
      </section>

      {/* Invoice Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Invoice records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Customer billing records will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Invoice</span>
          <span>Customer</span>
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
            No invoice records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Invoice records will appear here after billing data is
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Responsibility Note */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Cashier Responsibility
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Invoice and payment are separate records
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <FlowStep
            number="01"
            title="Invoice"
            text="The invoice records what the customer is required to pay."
          />

          <FlowStep
            number="02"
            title="Payment"
            text="The payment record represents the customer's submitted payment evidence."
          />

          <FlowStep
            number="03"
            title="Verification"
            text="The cashier verifies the payment evidence against the relevant invoice."
          />
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