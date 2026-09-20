import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  Info,
  Lightbulb,
  Package,
  TriangleAlert,
  Trash2,
} from "lucide-react";

export default function InventoryDashboardPage() {
  const actions = [
    {
      title: "Inventory Items",
      description:
        "Manage ingredients and other inventory items used by restaurant operations.",
      icon: Package,
      path: "/inventory/items",
    },
    {
      title: "Stock Transactions",
      description:
        "Review stock additions, usage and other inventory movements.",
      icon: ArrowLeftRight,
      path: "/inventory/stock",
    },
    {
      title: "Low Stock",
      description:
        "Identify inventory items that require attention based on stock thresholds.",
      icon: TriangleAlert,
      path: "/inventory/low-stock",
    },
    {
      title: "Waste Records",
      description:
        "Record and review food waste to support waste monitoring and analysis.",
      icon: Trash2,
      path: "/inventory/waste",
    },
    {
      title: "Reorder Recommendations",
      description:
        "Review explainable reorder suggestions based on future inventory rules.",
      icon: Lightbulb,
      path: "/inventory/recommendations",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory Manager Workspace
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Inventory dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Monitor inventory operations, stock conditions and food waste
          from one workspace.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Inventory data not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Inventory levels, stock movements and waste records will be
              retrieved from the Aurevia backend after database integration.
              No real stock data is currently displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Package}
          label="Inventory Items"
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock Items"
        />

        <SummaryCard
          icon={Trash2}
          label="Waste Records"
        />

        <SummaryCard
          icon={Lightbulb}
          label="Reorder Suggestions"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Inventory Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage inventory operations
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Inventory Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From ingredient usage to inventory decisions
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <FlowStep
            number="01"
            title="Track"
            text="Maintain inventory items and their stock information."
          />

          <FlowStep
            number="02"
            title="Update"
            text="Record stock additions, ingredient usage and adjustments."
          />

          <FlowStep
            number="03"
            title="Monitor"
            text="Identify low-stock conditions and record food waste."
          />

          <FlowStep
            number="04"
            title="Recommend"
            text="Use explainable inventory rules to support future reorder decisions."
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