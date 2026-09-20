import { Link } from "react-router-dom";
import {
  Info,
  ListTree,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

export default function ChefDashboardPage() {
  const actions = [
    {
      title: "Manage Menu Items",
      description:
        "Review dishes, prices, descriptions and menu item information.",
      icon: UtensilsCrossed,
      path: "/chef/menu-items",
    },
    {
      title: "Manage Categories",
      description:
        "Organize menu items into categories used throughout the menu.",
      icon: ListTree,
      path: "/chef/categories",
    },
    {
      title: "Dietary & Allergens",
      description:
        "Maintain dietary and allergen information used for customer filtering and recommendations.",
      icon: ShieldCheck,
      path: "/chef/dietary",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Menu Operations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Chef dashboard
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Manage menu information that supports customer dining,
          catering customization and food recommendations.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Menu backend not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Menu items, categories, dietary information and allergen
              details will be retrieved from the Spring Boot backend after
              database integration. Current public menu data remains
              demonstration data.
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
          icon={ListTree}
          label="Categories"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Dietary Information"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Management
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Menu management
        </h2>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
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

      {/* Connected workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Connected Menu Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Menu data supports multiple Aurevia functions
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Maintain Menu"
            text="Menu items and their information are maintained by authorized staff."
          />

          <FlowStep
            number="02"
            title="Customer Browsing"
            text="Customers can view available menu information through the dining experience."
          />

          <FlowStep
            number="03"
            title="Customization"
            text="Menu items can support catering-menu customization for events."
          />

          <FlowStep
            number="04"
            title="Recommendations"
            text="Dietary and allergen information can support explainable food filtering and recommendations."
          />
        </div>
      </section>

      {/* Safety note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Dietary filtering is not a medical guarantee
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Dietary and allergen information must come from maintained menu
          records. Recommendation filtering can help customers find suitable
          items, but the system should not present automated filtering as a
          guarantee that a dish is safe for a specific medical allergy.
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