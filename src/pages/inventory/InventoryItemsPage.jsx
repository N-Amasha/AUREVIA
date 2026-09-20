import { Link } from "react-router-dom";
import {
  Info,
  Package,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";

export default function InventoryItemsPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Inventory & Food Waste Management
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Inventory items
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Manage ingredients and other stock items used in restaurant
            operations.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Inventory Item
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Inventory records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Inventory items and stock quantities will be retrieved from
              the Aurevia backend after database integration. No real
              inventory records are currently displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Package}
          label="Total Items"
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock"
        />

        <SummaryCard
          icon={Package}
          label="Available Items"
        />
      </section>

      {/* Search + Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search inventory items"
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
            <option>All Stock Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available when inventory records
          are loaded from the backend.
        </p>
      </section>

      {/* Inventory Table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Package className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Inventory records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Stock items will appear here after backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span>Threshold</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Package className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No inventory items available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Inventory items will appear here once inventory data is
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Development Detail Route */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <Package className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Inventory item details
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
              Each inventory record will later open a detail screen showing
              its stock information, threshold and related inventory
              activity.
            </p>

            <Link
              to="/inventory/items/demo"
              className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              Open item detail template →
            </Link>
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