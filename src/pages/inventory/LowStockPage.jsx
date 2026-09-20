import {
  AlertTriangle,
  Info,
  PackageSearch,
  Search,
  TriangleAlert,
} from "lucide-react";

export default function LowStockPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Low stock alerts
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Monitor inventory items that require attention because their
          available stock has reached a defined low-stock condition.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Low-stock monitoring not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Low-stock conditions will be determined using inventory data
              and backend business rules. No real inventory alerts are
              currently being generated.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock Items"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Critical Items"
        />

        <SummaryCard
          icon={PackageSearch}
          label="Items Monitored"
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
              placeholder="Search low-stock items"
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
            <option>All Alert Levels</option>
            <option>Low Stock</option>
            <option>Critical</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after inventory data
          is connected to the backend.
        </p>
      </section>

      {/* Alert Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Items requiring attention
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Inventory items meeting a low-stock condition will appear
                here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Category</span>
          <span>Current Stock</span>
          <span>Threshold</span>
          <span>Unit</span>
          <span>Alert Level</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <TriangleAlert className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No low-stock data available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Low-stock alerts will appear here after inventory quantities
            and threshold information are connected to the backend.
          </p>
        </div>
      </section>

      {/* Logic */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How an inventory alert is determined
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <RuleStep
            number="01"
            title="Read Stock"
            text="Obtain the current available quantity of the inventory item."
          />

          <RuleStep
            number="02"
            title="Check Threshold"
            text="Compare the current quantity with the threshold defined for that item."
          />

          <RuleStep
            number="03"
            title="Flag Item"
            text="When the configured low-stock condition is met, flag the item for manager attention."
          />
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-gold-400">
            Important
          </p>

          <p className="mt-2 text-sm leading-6 text-stone-300">
            A low-stock alert identifies a stock condition. It does not
            automatically place an order with a supplier. Reordering remains
            a separate inventory decision.
          </p>
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