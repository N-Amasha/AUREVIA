import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChefHat,
  Heart,
  Search,
  Settings2,
  Sparkles,
  Utensils,
} from "lucide-react";

const menuActions = [
  {
    title: "Browse Menu",
    description:
      "Explore available menu items, categories, dietary information and allergens.",
    icon: Utensils,
    path: "/customer/menu/browse",
  },
  {
    title: "Customize Catering Menu",
    description:
      "Build a catering selection according to your event and food preferences.",
    icon: ChefHat,
    path: "/customer/menu/customize",
  },
  {
    title: "Food Recommendations",
    description:
      "Set your preferences and explore suitable menu recommendations.",
    icon: Sparkles,
    path: "/customer/menu/recommendations",
  },
  {
    title: "Saved Packages",
    description:
      "Access catering packages you have saved for future use.",
    icon: Heart,
    path: "/customer/menu/saved",
  },
];

export default function CustomerMenuPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Menu & Recommendations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Discover your dining options
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Browse Aurevia's menu, review dietary information, customize
          catering selections and manage your food preferences.
        </p>
      </section>

      {/* Actions */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        {menuActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                <Icon className="h-5 w-5 text-white" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-primary-950">
                {action.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {action.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-800">
                Open
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Preference Section */}
      <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-50">
            <Settings2 className="h-5 w-5 text-gold-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Food preferences
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Dietary preferences and allergen information will be used
              by the recommendation functionality to help identify more
              suitable menu choices.
            </p>

            <Link
              to="/customer/menu/recommendations"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:text-primary-950"
            >
              Manage preferences
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Menu service integration
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Customer menu records, saved packages and personalized
              recommendations will be connected to the Aurevia backend
              later. Demo menu information may be used only for the
              current frontend demonstration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}