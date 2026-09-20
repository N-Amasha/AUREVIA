import {
  Info,
  Plus,
  Search,
  ShieldCheck,
  Tags,
  UtensilsCrossed,
} from "lucide-react";

export default function MenuItemManagementPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Menu item management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage the dishes and menu information used by customer
            browsing, catering customization and food recommendations.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Menu records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Menu items will be loaded and maintained through the Spring
              Boot backend after database integration. The existing public
              menu dataset remains demonstration data.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={UtensilsCrossed}
          label="Menu Items"
        />

        <SummaryCard
          icon={Tags}
          label="Menu Categories"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Items With Dietary Details"
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
              placeholder="Search menu item"
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
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after menu records are
          connected to the backend.
        </p>
      </section>

      {/* Menu Item Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <UtensilsCrossed className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Menu items
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Menu item records will appear here after backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Category</span>
          <span>Price</span>
          <span>Dietary</span>
          <span>Allergens</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <UtensilsCrossed className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No menu records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Menu items will appear here once menu management is connected
            to the database.
          </p>
        </div>
      </section>

      {/* Data flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Menu Data Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One maintained menu supports multiple customer features
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Maintain Item"
            text="Authorized staff maintain menu item information."
          />

          <FlowStep
            number="02"
            title="Publish Menu"
            text="Available menu information can be presented to customers."
          />

          <FlowStep
            number="03"
            title="Customize"
            text="Eligible items can support catering-menu customization."
          />

          <FlowStep
            number="04"
            title="Recommend"
            text="Dietary and allergen information can support explainable recommendation filtering."
          />
        </div>
      </section>

      {/* Integrity note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Avoid separate copies of the same menu data
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          After backend integration, customer menu pages and staff
          management pages should use the same authoritative menu records.
          The current local frontend dataset is only for demonstrating the
          interface before database integration.
        </p>
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