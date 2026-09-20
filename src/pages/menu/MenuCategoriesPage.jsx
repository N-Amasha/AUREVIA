import {
  Info,
  ListTree,
  Plus,
  Search,
  UtensilsCrossed,
} from "lucide-react";

export default function MenuCategoriesPage() {
  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Menu categories
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Organize menu items into clear categories for customer browsing,
            catering customization and menu management.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available after backend integration"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Category management not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Menu category records and their relationships with menu items
              will be managed through the Spring Boot backend after database
              integration.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ListTree}
          label="Categories"
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Categorized Items"
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Uncategorized Items"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search category"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Statuses</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after category records
          are connected to the backend.
        </p>
      </section>

      {/* Category Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListTree className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Category records
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Menu categories will appear here after backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Category</span>
          <span>Description</span>
          <span>Menu Items</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ListTree className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No category records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Menu categories will appear here once category management is
            connected to the database.
          </p>
        </div>
      </section>

      {/* Relationship */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Menu Organization
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Categories help organize menu items
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <FlowStep
            number="01"
            title="Create Category"
            text="Authorized staff define the categories required by the menu."
          />

          <FlowStep
            number="02"
            title="Assign Items"
            text="Menu items are associated with the appropriate category."
          />

          <FlowStep
            number="03"
            title="Customer Browsing"
            text="Customers can use category information to browse and filter menu items."
          />
        </div>
      </section>

      {/* Design note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Categories and menu items are different concepts
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          A category organizes menu items, while a menu item represents an
          individual dish or offering. Category information should therefore
          support menu organization without duplicating the actual menu item
          records.
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