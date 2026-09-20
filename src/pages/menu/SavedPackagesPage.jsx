import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChefHat,
  Heart,
  Info,
  Plus,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function SavedPackagesPage() {
  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      {/* Header */}
      <section className="mt-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
          <Heart className="h-5 w-5 text-white" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Catering Packages
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Saved packages
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Access catering packages you have saved for future events and
          recurring dining requirements.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Saved package integration
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Saved catering packages will be retrieved from the
              customer's account after the catering and favorite-package
              services are connected to the backend.
            </p>
          </div>
        </div>
      </section>

      {/* Saved Package Area */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary-950">
              My saved packages
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Packages saved by the customer will appear here.
            </p>
          </div>

          <Link to="/customer/menu/customize">
            <Button>
              <Plus className="h-4 w-4" />
              Customize Menu
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Heart className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No saved packages available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Your saved catering packages will appear here after package
            saving and customer account services are implemented.
          </p>

          <Link
            to="/customer/menu/customize"
            className="mt-6 inline-block"
          >
            <Button variant="outline">
              <ChefHat className="h-4 w-4" />
              Create Catering Selection
            </Button>
          </Link>
        </div>
      </section>

      {/* Future functionality */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <Heart className="h-5 w-5 text-primary-700" />

          <h3 className="mt-4 font-semibold text-primary-950">
            Save Favorites
          </h3>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Keep useful catering packages associated with your customer
            account.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <ChefHat className="h-5 w-5 text-primary-700" />

          <h3 className="mt-4 font-semibold text-primary-950">
            Review Items
          </h3>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Review the menu items included in a saved catering package.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <Plus className="h-5 w-5 text-primary-700" />

          <h3 className="mt-4 font-semibold text-primary-950">
            Reuse Selection
          </h3>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Use saved package information as a starting point for future
            event catering.
          </p>
        </div>
      </section>
    </div>
  );
}