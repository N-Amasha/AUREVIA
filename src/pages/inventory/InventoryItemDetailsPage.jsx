import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Info,
  Package,
  TriangleAlert,
} from "lucide-react";

export default function InventoryItemDetailsPage() {
  const { itemId } = useParams();

  return (
    <div>
      {/* Back */}
      <Link
        to="/inventory/items"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory Items
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Inventory item details
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review stock information and inventory activity for a selected
          item.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Inventory item not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This page is ready to load inventory item{" "}
              <span className="font-semibold">{itemId}</span> from the
              Aurevia backend. No real inventory record is currently loaded.
            </p>
          </div>
        </div>
      </section>

      {/* Item Information */}
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <InfoCard
          icon={Package}
          title="Item information"
          description="Basic information about the selected inventory item."
          items={[
            ["Item ID", itemId || "—"],
            ["Item Name", "—"],
            ["Category", "—"],
            ["Unit", "—"],
          ]}
        />

        <InfoCard
          icon={TriangleAlert}
          title="Stock information"
          description="Current stock and threshold information."
          items={[
            ["Current Quantity", "—"],
            ["Reorder Threshold", "—"],
            ["Stock Status", "—"],
            ["Last Updated", "—"],
          ]}
        />
      </section>

      {/* Stock Status */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Stock monitoring
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Stock condition will be calculated from backend inventory
              data and the configured threshold.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatusBox
            label="Current Stock"
            value="—"
          />

          <StatusBox
            label="Threshold"
            value="—"
          />

          <StatusBox
            label="Condition"
            value="—"
          />
        </div>
      </section>

      {/* Inventory Activity */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ArrowLeftRight className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Recent inventory activity
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Stock additions, usage and adjustments related to this item
                will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Type</span>
          <span>Quantity</span>
          <span>Date</span>
          <span>Reference</span>
          <span>Recorded By</span>
        </div>

        <div className="px-6 py-12 text-center">
          <ArrowLeftRight className="mx-auto h-7 w-7 text-stone-400" />

          <h3 className="mt-4 font-semibold text-primary-950">
            No inventory activity available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Inventory activity will appear here after stock records are
            connected to the backend.
          </p>
        </div>
      </section>

      {/* Rule Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Stock Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How low-stock detection will work
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <RuleStep
            number="01"
            title="Current Quantity"
            text="The system obtains the item's current available stock."
          />

          <RuleStep
            number="02"
            title="Compare"
            text="The current quantity is compared with the configured stock threshold."
          />

          <RuleStep
            number="03"
            title="Alert"
            text="If the defined low-stock condition is met, the item can be flagged for attention."
          />
        </div>

        <p className="mt-7 text-xs leading-5 text-stone-400">
          The exact threshold and reorder rules will be finalized with the
          backend business logic and database design.
        </p>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description, items }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <DetailItem
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-primary-950">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBox({ label, value }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-primary-950">
        {value}
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