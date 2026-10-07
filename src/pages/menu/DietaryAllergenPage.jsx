/* oxlint-disable react/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  Database,
  RefreshCw,
  Search,
  ShieldCheck,
  Tags,
  UtensilsCrossed,
} from "lucide-react";
import { getAllMenuItems } from "../../api/menuApi";

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load menu records."
  );
}

export default function DietaryAllergenPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAllMenuItems();

      setMenuItems(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        menuItems
          .map((item) => item.category?.trim())
          .filter(Boolean),
      ),
    ).sort();
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const searchableText = [
        item.itemName,
        item.menuName,
        item.category,
        item.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.availabilityStatus?.toUpperCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    menuItems,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Dietary & allergen information
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review menu-item coverage for dietary
            classifications and allergen information.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Schema status */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Not stored in the current database schema
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-700">
              The current 40-table Aurevia schema does not
              contain dietary-classification or allergen
              tables or columns. The menu items below are real
              database records, while dietary and allergen
              values are correctly shown as not recorded.
            </p>
          </div>
        </div>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={UtensilsCrossed}
          label="Menu Items"
          value={menuItems.length}
        />

        <SummaryCard
          icon={Tags}
          label="Dietary Records"
          value={0}
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Allergen Records"
          value={0}
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search item, menu or description"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500"
          >
            <option value="ALL">All Categories</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {formatLabel(category)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">
              Unavailable
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredItems.length} of{" "}
          {menuItems.length} menu items.
        </p>
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Menu-item dietary coverage
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Authoritative menu items and the current
                coverage of dietary and allergen information.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Menu Item</span>
          <span>Menu</span>
          <span>Category</span>
          <span>Dietary</span>
          <span>Allergens</span>
          <span>Status</span>
        </div>

        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading menu items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-primary-700" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No menu items found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No menu items match the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredItems.map((item) => (
              <div
                key={item.menuItemId}
                className="grid gap-4 px-6 py-5 xl:grid-cols-6 xl:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {item.itemName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Item #{item.menuItemId}
                  </p>
                </div>

                <p className="text-sm text-stone-600">
                  {item.menuName}
                </p>

                <p className="text-sm text-stone-600">
                  {formatLabel(item.category)}
                </p>

                <CoverageBadge text="Not recorded" />

                <CoverageBadge text="Not recorded" />

                <AvailabilityBadge
                  status={item.availabilityStatus}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Safety warning */}
      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <h2 className="font-semibold text-stone-900">
              Do not infer allergen safety
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
              Aurevia does not infer dietary suitability or
              allergen safety from item names, categories or
              descriptions. Reliable filtering requires
              explicitly maintained ingredient and allergen
              records, including consideration of preparation
              methods and cross-contact.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function CoverageBadge({ text }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
      {text}
    </span>
  );
}

function AvailabilityBadge({ status }) {
  const isAvailable =
    status?.toUpperCase() === "AVAILABLE";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700"
          : "bg-stone-100 text-stone-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}