import {
  AlertTriangle,
  Info,
  Search,
  ShieldCheck,
  Tags,
  UtensilsCrossed,
} from "lucide-react";

export default function DietaryAllergenPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Menu Operations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Dietary & allergen information
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review dietary classifications and allergen information associated
          with menu items for customer browsing and recommendation filtering.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Dietary records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Dietary classifications and allergen information will come from
              maintained menu records after Spring Boot and database
              integration. The current customer recommendation feature uses
              demonstration menu data only.
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
          label="Dietary Classifications"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Allergen Records"
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
            <option>All Dietary Types</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Allergen Records</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available when maintained menu
          records are connected to the backend.
        </p>
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Dietary and allergen records
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Maintained menu dietary information will appear here after
                backend integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Menu Item</span>
          <span>Category</span>
          <span>Dietary</span>
          <span>Allergens</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <ShieldCheck className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No dietary records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Dietary classifications and allergen information will appear
            here once menu records are connected to the database.
          </p>
        </div>
      </section>

      {/* Recommendation Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Recommendation Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Maintained menu information supports explainable filtering
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Menu Data"
            text="Read maintained dietary and allergen information for menu items."
          />

          <FlowStep
            number="02"
            title="Preferences"
            text="Receive the dietary preferences and allergen exclusions selected by the customer."
          />

          <FlowStep
            number="03"
            title="Filter"
            text="Apply transparent rules to identify menu items matching the selected criteria."
          />

          <FlowStep
            number="04"
            title="Explain"
            text="Present suitable items together with the reason they matched the selected preferences."
          />
        </div>
      </section>

      {/* Safety Warning */}
      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <h2 className="font-semibold text-stone-900">
              Allergen information requires special care
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
              Automated filtering should not be presented as a guarantee of
              allergen safety. Ingredient changes, preparation methods and
              cross-contact can affect suitability, so maintained menu
              information should be treated as guidance rather than a
              medical safety guarantee.
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