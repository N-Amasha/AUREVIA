import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Info,
  Leaf,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { menuItems } from "../../data/menuData";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
];

const allergenOptions = [
  "Dairy",
  "Egg",
  "Fish",
  "Gluten",
  "Nuts",
  "Shellfish",
  "Soy",
];

export default function FoodRecommendationsPage() {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [avoidAllergens, setAvoidAllergens] = useState([]);
  const [recommendationReady, setRecommendationReady] = useState(false);

  function togglePreference(value) {
    setDietaryPreferences((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );

    setRecommendationReady(false);
  }

  function toggleAllergen(value) {
    setAvoidAllergens((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );

    setRecommendationReady(false);
  }

  const recommendedItems = useMemo(() => {
    if (!recommendationReady) {
      return [];
    }

    return menuItems.filter((item) => {
      const itemDietary = (item.dietary || []).map((value) =>
        value.toLowerCase()
      );

      const itemAllergens = (item.allergens || []).map((value) =>
        value.toLowerCase()
      );

      const matchesDietary =
        dietaryPreferences.length === 0 ||
        dietaryPreferences.every((preference) =>
          itemDietary.includes(preference.toLowerCase())
        );

      const containsAvoidedAllergen = avoidAllergens.some((allergen) =>
        itemAllergens.includes(allergen.toLowerCase())
      );

      return matchesDietary && !containsAvoidedAllergen;
    });
  }, [
    recommendationReady,
    dietaryPreferences,
    avoidAllergens,
  ]);

  function generateRecommendations() {
    setRecommendationReady(true);
  }

  function clearPreferences() {
    setDietaryPreferences([]);
    setAvoidAllergens([]);
    setRecommendationReady(false);
  }

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
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Food Recommendations
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Find food that suits you
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Select dietary preferences and allergens you want to avoid to
          explore more suitable menu choices.
        </p>
      </section>

      {/* Explanation */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Recommendation preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              The current frontend uses simple explainable filtering
              against demonstration menu data. Personalized
              recommendation logic will be implemented through the
              backend later.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        {/* Dietary Preferences */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <Leaf className="h-5 w-5 text-primary-700" />
            </div>

            <div>
              <h2 className="font-semibold text-primary-950">
                Dietary preferences
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Select any dietary requirements that should be considered.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {dietaryOptions.map((option) => {
              const selected =
                dietaryPreferences.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => togglePreference(option)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition ${
                    selected
                      ? "border-primary-700 bg-primary-50 text-primary-950"
                      : "border-stone-200 text-stone-700 hover:border-primary-300"
                  }`}
                >
                  {option}

                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-primary-800 bg-primary-800 text-white"
                        : "border-stone-300"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Allergens */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <ShieldAlert className="h-5 w-5 text-amber-700" />
            </div>

            <div>
              <h2 className="font-semibold text-primary-950">
                Allergens to avoid
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Select allergens that should be excluded from the
                recommendation results.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {allergenOptions.map((option) => {
              const selected = avoidAllergens.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleAllergen(option)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition ${
                    selected
                      ? "border-amber-600 bg-amber-50 text-amber-950"
                      : "border-stone-200 text-stone-700 hover:border-amber-300"
                  }`}
                >
                  {option}

                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-amber-700 bg-amber-700 text-white"
                        : "border-stone-300"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Actions */}
      <section className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={generateRecommendations}
        >
          <Sparkles className="h-4 w-4" />
          Find Suitable Items
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={clearPreferences}
        >
          Clear Preferences
        </Button>
      </section>

      {/* Results */}
      {recommendationReady && (
        <section className="mt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Recommendation Results
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary-950">
              Suitable menu choices
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              These results are produced by frontend filtering rules,
              not by a trained AI model.
            </p>
          </div>

          {recommendedItems.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendedItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-white p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-primary-950">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-5 rounded-xl bg-primary-50 p-3">
                    <p className="text-xs font-semibold text-primary-900">
                      Why this item?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-primary-700">
                      It matches the selected dietary filters and does
                      not contain any of the selected allergens according
                      to the current demo data.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-stone-400" />

              <h3 className="mt-4 font-semibold text-primary-950">
                No suitable menu items found
              </h3>

              <p className="mt-2 text-sm text-stone-600">
                Try changing your dietary preferences or allergen
                exclusions.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Safety Note */}
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <h2 className="font-semibold text-amber-950">
              Allergen information
            </h2>

            <p className="mt-1 text-sm leading-6 text-amber-900">
              Recommendation filtering should not be treated as a
              guarantee of allergen safety. Final allergen information
              should be confirmed with restaurant staff.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}