import {
  Building2,
  CheckCircle2,
  Info,
  Search,
  Store,
  Wrench,
} from "lucide-react";

export default function VendorManagementPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Vendor management
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review vendors that can support event services and coordinate
          external service requirements.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Vendor records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Vendor information and event-service assignments will be
              retrieved from the Aurevia backend after the Event
              Coordination service is implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Store}
          label="Total Vendors"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Available Vendors"
        />

        <SummaryCard
          icon={Wrench}
          label="Service Assignments"
        />
      </section>

      {/* Search and filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search vendors"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Service Types</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Vendor search and service filtering will become available when
          vendor records are loaded from the backend.
        </p>
      </section>

      {/* Vendor Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Vendor directory
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Vendors available for event-service coordination will appear
              here.
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Available after backend integration"
            className="cursor-not-allowed rounded-xl bg-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-500"
          >
            Add Vendor
          </button>
        </div>

        {/* Desktop headings */}
        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Vendor</span>
          <span>Service Type</span>
          <span>Contact</span>
          <span>Availability</span>
          <span>Assignments</span>
          <span>Action</span>
        </div>

        {/* Empty State */}
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Building2 className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No vendor records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Vendor records will appear here after vendor management is
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Relationship Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Vendor Coordination
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How vendors support an event
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Event"
            text="The coordinator reviews the event requirements."
          />

          <FlowStep
            number="02"
            title="Service"
            text="Required event services are identified."
          />

          <FlowStep
            number="03"
            title="Vendor"
            text="A suitable vendor can be associated with the required service."
          />

          <FlowStep
            number="04"
            title="Coordinate"
            text="The coordinator follows the service and vendor arrangement."
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