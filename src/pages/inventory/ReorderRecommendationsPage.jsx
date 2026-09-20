import {
  Info,
  Lightbulb,
  PackageCheck,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

export default function ReorderRecommendationsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Reorder recommendations
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review explainable inventory recommendations designed to help
          managers identify items that may require replenishment.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Recommendation engine not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Reorder recommendations will be generated after real inventory
              quantities, thresholds and usage information are available
              from the backend. No real recommendations are currently being
              produced.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Lightbulb}
          label="Recommendations"
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Needs Attention"
        />

        <SummaryCard
          icon={PackageCheck}
          label="Stock Sufficient"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search recommendations"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Categories</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Recommendation Levels</option>
            <option>Reorder Suggested</option>
            <option>Monitor</option>
            <option>Stock Sufficient</option>
          </select>
        </div>
      </section>

      {/* Recommendation Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Inventory recommendations
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Explainable reorder suggestions will appear here when
                backend inventory data becomes available.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Current Stock</span>
          <span>Threshold</span>
          <span>Usage</span>
          <span>Suggestion</span>
          <span>Reason</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Lightbulb className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No recommendations available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Recommendations will appear here after inventory levels and
            related business rules are connected to the backend.
          </p>
        </div>
      </section>

      {/* Recommendation Logic */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Recommendation Logic
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How a reorder suggestion can be generated
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <RuleStep
            number="01"
            title="Read Stock"
            text="Retrieve the item's current available quantity."
          />

          <RuleStep
            number="02"
            title="Check Threshold"
            text="Compare current stock with the configured reorder threshold."
          />

          <RuleStep
            number="03"
            title="Review Usage"
            text="Consider available usage information when evaluating inventory demand."
          />

          <RuleStep
            number="04"
            title="Recommend"
            text="Produce an explainable suggestion for the inventory manager to review."
          />
        </div>
      </section>

      {/* Human Decision */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-gold-600" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Recommendation, not automatic purchasing
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
              Aurevia's recommendation feature is intended to support the
              Inventory Manager's decision. A recommendation does not
              automatically create a supplier order or purchase stock.
            </p>
          </div>
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

function RuleStep({ number, title, text }) {
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