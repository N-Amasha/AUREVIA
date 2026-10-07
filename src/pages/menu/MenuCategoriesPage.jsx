/* oxlint-disable react/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ListTree,
  RefreshCw,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import { getAllMenuItems } from "../../api/menuApi";

function formatLabel(value) {
  if (!value) {
    return "Uncategorized";
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
    "Unable to load menu categories."
  );
}

export default function MenuCategoriesPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAllMenuItems();
      setMenuItems(Array.isArray(data) ? data : []);
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
    const categoryMap = new Map();

    menuItems.forEach((item) => {
      const category =
        item.category?.trim() || "UNCATEGORIZED";

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          itemCount: 0,
          availableCount: 0,
          unavailableCount: 0,
          menus: new Set(),
        });
      }

      const record = categoryMap.get(category);

      record.itemCount += 1;

      if (
        item.availabilityStatus?.toUpperCase() ===
        "AVAILABLE"
      ) {
        record.availableCount += 1;
      } else {
        record.unavailableCount += 1;
      }

      if (item.menuName) {
        record.menus.add(item.menuName);
      }
    });

    return Array.from(categoryMap.values())
      .map((category) => ({
        ...category,
        menus: Array.from(category.menus).sort(),
        status:
          category.availableCount > 0
            ? "ACTIVE"
            : "UNAVAILABLE",
      }))
      .sort((first, second) =>
        first.name.localeCompare(second.name),
      );
  }, [menuItems]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        formatLabel(category.name)
          .toLowerCase()
          .includes(normalizedSearch) ||
        category.menus.some((menuName) =>
          menuName
            .toLowerCase()
            .includes(normalizedSearch),
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const categorizedItemCount = menuItems.filter(
    (item) => item.category?.trim(),
  ).length;

  const uncategorizedItemCount =
    menuItems.length - categorizedItemCount;

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Menu categories
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review the categories currently assigned to
            authoritative menu items in the Aurevia database.
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

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ListTree}
          label="Categories"
          value={categories.length}
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Categorized Items"
          value={categorizedItemCount}
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Uncategorized Items"
          value={uncategorizedItemCount}
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search category or menu"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">
              Has Available Items
            </option>
            <option value="UNAVAILABLE">
              No Available Items
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Showing {filteredCategories.length} of{" "}
          {categories.length} categories.
        </p>
      </section>

      {/* Category Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListTree className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Category records
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Categories are derived from the category
                assigned to each menu item.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Category</span>
          <span>Menus</span>
          <span>Menu Items</span>
          <span>Available</span>
          <span>Status</span>
        </div>

        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading menu categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <ListTree className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No categories found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No menu categories match the selected search
              and status filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredCategories.map((category) => (
              <div
                key={category.name}
                className="grid gap-4 px-6 py-5 md:grid-cols-5 md:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {formatLabel(category.name)}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {category.name}
                  </p>
                </div>

                <p className="text-sm text-stone-600">
                  {category.menus.join(", ") || "—"}
                </p>

                <p className="text-sm font-semibold text-primary-950">
                  {category.itemCount}
                </p>

                <p className="text-sm font-semibold text-primary-950">
                  {category.availableCount}
                </p>

                <div>
                  <StatusBadge status={category.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Management note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Categories are maintained through menu items
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          The current database stores the category directly
          on each menu item. To add, rename or reassign a
          category, create or edit the relevant menu item.
        </p>

        <Link
          to="/chef/menu-items"
          className="mt-5 inline-flex rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          Manage Menu Items
        </Link>
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

function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-stone-100 text-stone-600"
      }`}
    >
      {isActive
        ? "Has Available Items"
        : "No Available Items"}
    </span>
  );
}