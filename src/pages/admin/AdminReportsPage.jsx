import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Download,
  Info,
  PackageSearch,
  Users,
} from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            System Administration
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Reports
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review future operational summaries across Aurevia's connected
            restaurant and event management functions.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend reporting integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Reporting data not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Reports will be generated from backend data after database
              integration. No operational totals or analytics shown on this
              page currently represent real Aurevia records.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Reservations"
        />

        <SummaryCard
          icon={CreditCard}
          label="Verified Payments"
        />

        <SummaryCard
          icon={PackageSearch}
          label="Inventory Activity"
        />

        <SummaryCard
          icon={Users}
          label="Staff Activity"
        />
      </section>

      {/* Report Period */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-semibold text-primary-950">
          Report period
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Report Areas</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Date filtering will become available after the reporting service
          is connected to backend records.
        </p>
      </section>

      {/* Report Areas */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Reporting Areas
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Cross-module operational reporting
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ReportCard
            icon={CalendarDays}
            title="Reservation Activity"
            description="Future summaries of table reservations, venue bookings and booking activity."
          />

          <ReportCard
            icon={CreditCard}
            title="Billing & Payments"
            description="Future summaries based on invoices and cashier-verified payment records."
          />

          <ReportCard
            icon={PackageSearch}
            title="Inventory & Waste"
            description="Future summaries of stock activity, low-stock conditions and recorded food waste."
          />

          <ReportCard
            icon={Users}
            title="Staff Operations"
            description="Future summaries of shifts, assignments, attendance and workforce activity."
          />

          <ReportCard
            icon={BarChart3}
            title="Event Activity"
            description="Future summaries of coordinated events, timelines and operational event activity."
          />

          <ReportCard
            icon={BarChart3}
            title="Customer Feedback"
            description="Future summaries of customer ratings and analyzed feedback after sentiment processing is connected."
          />
        </div>
      </section>

      {/* Empty Analytics */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Report results
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Generated reporting results will appear here after backend
                integration.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <BarChart3 className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No report data available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Report results and visualizations will be generated after
            Aurevia's database and reporting APIs are available.
          </p>
        </div>
      </section>

      {/* Reporting Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reporting Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Operational records become management information
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Collect"
            text="Aurevia modules create operational records through normal system activities."
          />

          <FlowStep
            number="02"
            title="Filter"
            text="The reporting service selects relevant records for the requested period and report."
          />

          <FlowStep
            number="03"
            title="Aggregate"
            text="Backend logic calculates appropriate totals and summaries from stored data."
          />

          <FlowStep
            number="04"
            title="Present"
            text="The administrator reviews the resulting report without changing the source records."
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

function ReportCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
        <Icon className="h-5 w-5 text-primary-700" />
      </div>

      <h3 className="mt-5 font-semibold text-primary-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-600">
        {description}
      </p>

      <p className="mt-5 text-sm font-semibold text-stone-400">
        Awaiting backend data
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