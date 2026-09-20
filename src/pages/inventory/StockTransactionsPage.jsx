import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Info,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function StockTransactionsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Stock transactions
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review stock additions, ingredient usage and inventory adjustments
          recorded for inventory items.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Stock transactions not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Stock movements will be retrieved from the Aurevia backend
              after inventory integration. No real stock quantities are
              currently being changed by this page.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ArrowDownToLine}
          label="Stock Additions"
        />

        <SummaryCard
          icon={ArrowUpFromLine}
          label="Ingredient Usage"
        />

        <SummaryCard
          icon={SlidersHorizontal}
          label="Adjustments"
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
              placeholder="Search item or reference"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Transaction Types</option>
            <option>Stock Addition</option>
            <option>Ingredient Usage</option>
            <option>Adjustment</option>
          </select>

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available when stock transaction
          records are connected to the backend.
        </p>
      </section>

      {/* Transactions */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ArrowLeftRight className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Stock movement history
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Inventory quantity changes will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Transaction</span>
          <span>Item</span>
          <span>Type</span>
          <span>Quantity</span>
          <span>Date</span>
          <span>Reference</span>
          <span>Recorded By</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ArrowLeftRight className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No stock transactions available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Stock additions, ingredient usage and adjustments will appear
            here after transaction records are connected to the backend.
          </p>
        </div>
      </section>

      {/* Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Stock Movement
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Why inventory quantities change
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <TransactionType
            icon={ArrowDownToLine}
            title="Stock Addition"
            text="New stock received into inventory increases the available quantity."
          />

          <TransactionType
            icon={ArrowUpFromLine}
            title="Ingredient Usage"
            text="Ingredient consumption associated with restaurant operations decreases available stock."
          />

          <TransactionType
            icon={SlidersHorizontal}
            title="Adjustment"
            text="Authorized corrections can reconcile recorded stock with the actual inventory count."
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

function TransactionType({ icon: Icon, title, text }) {
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