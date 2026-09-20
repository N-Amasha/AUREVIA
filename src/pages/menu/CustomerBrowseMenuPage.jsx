import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChefHat,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { menuItems } from "../../data/menuData";

export default function CustomerBrowseMenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
    ];
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const searchableText = [
        item.name,
        item.description,
        item.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Customer Menu
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Browse menu
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Explore available menu options and review category, dietary and
          allergen information before making your selections.
        </p>
      </section>

      {/* Demo Notice */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <ChefHat className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Frontend demonstration data
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              The menu information displayed on this page currently comes
              from the local frontend demo dataset. It will later be
              replaced with menu records retrieved from the Aurevia
              backend.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary-800" />
          <h2 className="font-semibold text-primary-950">
            Find menu items
          </h2>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search menu items"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Results */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Menu Items
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary-950">
              Available choices
            </h2>
          </div>

          <p className="text-sm text-stone-500">
            {filteredItems.length} item
            {filteredItems.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-primary-950">
                      {item.name}
                    </h3>
                  </div>

                  {item.price !== undefined && (
                    <span className="shrink-0 text-sm font-bold text-primary-900">
                      LKR {item.price}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {item.description}
                  </p>
                )}

                {/* Dietary Information */}
                {item.dietary?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Dietary
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.dietary.map((diet) => (
                        <span
                          key={diet}
                          className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {item.allergens?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Allergens
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-12 text-center">
            <Search className="mx-auto h-8 w-8 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No menu items found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              Try another search term or menu category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}