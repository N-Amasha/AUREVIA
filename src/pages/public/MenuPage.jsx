import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ChefHat,
  Leaf,
  Search,
  Sparkles,
  TriangleAlert,
  SlidersHorizontal,
  Heart,
  Check,
  Utensils,
} from "lucide-react";

import InputField from "../../components/forms/InputField";
import Badge from "../../components/ui/Badge";
import { menuCategories, menuItems } from "../../data/menuData";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    dairyFree: false,
    glutenFree: false,
  });

  const [showRecommendations, setShowRecommendations] = useState(false);  

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function handlePreferenceChange(event) {
  const { name, checked } = event.target;

  setPreferences((current) => ({
    ...current,
    [name]: checked,
  }));

  setShowRecommendations(false);
}

function handleRecommendationPreview() {
  setShowRecommendations(true);
}

  return (
    <>
      {/* Menu Hero */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ChefHat className="h-4 w-4 text-gold-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Aurevia Menu
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Discover flavours
              <span className="block text-gold-400">
                made for every experience.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Browse Aurevia menu options and explore dietary and
              allergen information before making your dining choices.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Browser */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8">
            
            {/* Heading */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
                Explore The Menu
              </p>

              <h2 className="mt-3 text-3xl font-bold text-primary-950">
                Find something for you
              </h2>
            </div>

            {/* Search */}
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2 text-sm text-stone-500">
                <Search className="h-4 w-4 text-primary-700" />
                Search menu
              </div>

              <InputField
                name="menuSearch"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by dish name..."
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {menuCategories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setActiveCategory(category.value)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-primary-800 text-white"
                        : "border border-stone-200 bg-white text-stone-600 hover:border-primary-300 hover:text-primary-800"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Demo Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />

              <p className="text-sm leading-6 text-stone-700">
                Menu items and prices shown on this frontend are
                demonstration data. Live menu information will be loaded
                from the Aurevia backend when integrated.
              </p>
            </div>

            {/* Menu Cards */}
            {filteredItems.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Visual */}
                    <div className="flex h-44 items-center justify-center bg-primary-100">
                      {item.dietary.includes("Vegetarian") ? (
                        <Leaf className="h-11 w-11 text-primary-700" />
                      ) : (
                        <ChefHat className="h-11 w-11 text-primary-700" />
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                            {item.categoryLabel}
                          </p>

                          <h3 className="mt-2 text-xl font-semibold text-primary-950">
                            {item.name}
                          </h3>
                        </div>

                        <p className="shrink-0 font-semibold text-primary-800">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-stone-600">
                        {item.description}
                      </p>

                      {/* Dietary */}
                      {item.dietary.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.dietary.map((diet) => (
                            <Badge key={diet} variant="success">
                              {diet}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Allergens */}
                      {item.allergens.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                          <TriangleAlert className="h-4 w-4 shrink-0" />

                          <span>
                            Contains: {item.allergens.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <ChefHat className="mx-auto h-9 w-9 text-stone-400" />

                <h3 className="mt-4 font-semibold text-stone-800">
                  No menu items found
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Try another search term or menu category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Preference & Recommendation Preview */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

            {/* Preference Panel */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
                Personalize Your Experience
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                Tell us your food preferences
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-stone-600">
                Select preferences to preview how Aurevia can help customers
                discover menu choices that better match their dining needs.
              </p>

              <div className="mt-8 space-y-3">
                {/* Vegetarian */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-cream-50 p-4 transition hover:border-primary-300">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-primary-700" />

                    <div>
                      <p className="text-sm font-semibold text-stone-800">
                        Vegetarian
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Prefer menu options without meat.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={preferences.vegetarian}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 accent-primary-700"
                  />
                </label>

                {/* Dairy Free */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-cream-50 p-4 transition hover:border-primary-300">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 text-primary-700" />

                    <div>
                      <p className="text-sm font-semibold text-stone-800">
                        Dairy Free
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Avoid items marked with dairy allergens.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="dairyFree"
                    checked={preferences.dairyFree}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 accent-primary-700"
                  />
                </label>

                {/* Gluten Free */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-cream-50 p-4 transition hover:border-primary-300">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 text-primary-700" />

                    <div>
                      <p className="text-sm font-semibold text-stone-800">
                        Gluten Free
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Avoid items marked with gluten allergens.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="glutenFree"
                    checked={preferences.glutenFree}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 accent-primary-700"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleRecommendationPreview}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-900"
              >
                <Sparkles className="h-4 w-4" />
                Preview Recommendations
              </button>
            </div>

            {/* Recommendation Panel */}
            <div className="rounded-[2rem] bg-primary-950 p-8 text-white sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500">
                <Heart className="h-6 w-6 text-primary-950" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Aurevia Recommendations
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Menu choices matched to your preferences
              </h3>

              {!showRecommendations ? (
                <p className="mt-4 leading-7 text-stone-300">
                  Select your dietary preferences and choose Preview
                  Recommendations to see how this experience works.
                </p>
              ) : (
                <div className="mt-6">
                  <p className="text-sm leading-6 text-stone-300">
                    Your selected preferences:
                  </p>

                  <div className="mt-4 space-y-3">
                    {preferences.vegetarian && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                        <Check className="h-4 w-4 text-gold-400" />
                        <span className="text-sm">Vegetarian</span>
                      </div>
                    )}

                    {preferences.dairyFree && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                        <Check className="h-4 w-4 text-gold-400" />
                        <span className="text-sm">Dairy Free</span>
                      </div>
                    )}

                    {preferences.glutenFree && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                        <Check className="h-4 w-4 text-gold-400" />
                        <span className="text-sm">Gluten Free</span>
                      </div>
                    )}

                    {!preferences.vegetarian &&
                      !preferences.dairyFree &&
                      !preferences.glutenFree && (
                        <p className="rounded-xl bg-white/10 p-4 text-sm text-stone-300">
                          No dietary preferences were selected.
                        </p>
                      )}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-sm leading-6 text-stone-300">
                      Matching menu recommendations will be generated here
                      when the recommendation service is integrated.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Menu Final CTA */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary-950 px-6 py-14 text-center sm:px-12 sm:py-16">
            
            {/* Decorative Elements */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gold-500/10" />

            <div className="relative mx-auto max-w-3xl">
              <ChefHat className="mx-auto h-10 w-10 text-gold-400" />

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                From Menu To Experience
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Found something you would love to try?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-stone-300">
                Explore Aurevia dining options and begin planning your next
                restaurant experience.
              </p>

              <Link
                to="/dining"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-primary-950 transition hover:bg-gold-600 hover:text-white"
              >
                Explore Dining
                <Utensils className="h-4 w-4" />
            </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}