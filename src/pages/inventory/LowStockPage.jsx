import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  PackageSearch,
  Search,
  TriangleAlert,
} from "lucide-react";

import {
  getAllInventoryItems,
  getReorderAlerts,
} from "../../api/inventoryApi";

export default function LowStockPage() {
  const [allItems, setAllItems] = useState([]);
  const [alertItems, setAlertItems] =
    useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");
  const [levelFilter, setLevelFilter] =
    useState("ALL");
  const [loading, setLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadAlerts() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [
          loadedItems,
          loadedAlerts,
        ] = await Promise.all([
          getAllInventoryItems(),
          getReorderAlerts(),
        ]);

        if (!active) {
          return;
        }

        setAllItems(
          Array.isArray(loadedItems)
            ? loadedItems
            : [],
        );
        setAlertItems(
          Array.isArray(loadedAlerts)
            ? loadedAlerts
            : [],
        );
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.response?.data?.message
              || "Unable to load low-stock alerts.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          alertItems
            .map((item) => item.itemCategory)
            .filter(Boolean),
        ),
      ].sort(),
    [alertItems],
  );

  const criticalCount = useMemo(
    () =>
      alertItems.filter(
        (item) =>
          getAlertLevel(item) === "CRITICAL",
      ).length,
    [alertItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return alertItems.filter((item) => {
      const alertLevel = getAlertLevel(item);

      const searchableText = [
        item.inventoryItemId,
        item.itemName,
        item.itemCategory,
        item.supplierName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch
        || searchableText.includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "ALL"
        || item.itemCategory
          === categoryFilter;

      const matchesLevel =
        levelFilter === "ALL"
        || alertLevel === levelFilter;

      return (
        matchesSearch
        && matchesCategory
        && matchesLevel
      );
    });
  }, [
    alertItems,
    searchTerm,
    categoryFilter,
    levelFilter,
  ]);

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Low stock alerts
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Monitor inventory items whose current
          quantity has reached or fallen below their
          configured reorder level.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Low-stock alerts could not be loaded
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock Items"
          value={
            loading
              ? "..."
              : alertItems.length
          }
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Critical Items"
          value={
            loading
              ? "..."
              : criticalCount
          }
        />

        <SummaryCard
          icon={PackageSearch}
          label="Items Monitored"
          value={
            loading
              ? "..."
              : allItems.length
          }
        />
      </section>

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
              placeholder="Search item or supplier"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Categories
            </option>

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
            value={levelFilter}
            onChange={(event) =>
              setLevelFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Alert Levels
            </option>
            <option value="LOW_STOCK">
              Low Stock
            </option>
            <option value="CRITICAL">
              Critical
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Items requiring attention
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading low-stock alerts..."
                  : `${filteredItems.length} ${
                      filteredItems.length === 1
                        ? "alert"
                        : "alerts"
                    } found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Category</span>
          <span>Current Stock</span>
          <span>Reorder Level</span>
          <span>Alert Level</span>
          <span>Action</span>
        </div>

        {!loading && filteredItems.length > 0 && (
          <div className="divide-y divide-stone-200">
            {filteredItems.map((item) => (
              <AlertRow
                key={item.inventoryItemId}
                item={item}
              />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <TriangleAlert className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No matching low-stock alerts
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No inventory items match the current
              alert filters.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How an inventory alert is determined
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <RuleStep
            number="01"
            title="Read Stock"
            text="The system retrieves the item's current available quantity."
          />

          <RuleStep
            number="02"
            title="Check Level"
            text="Current quantity is compared with the item's configured reorder level."
          />

          <RuleStep
            number="03"
            title="Flag Item"
            text="Items at or below their reorder level are returned by the alert endpoint."
          />
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-gold-400">
            Alert classification
          </p>

          <p className="mt-2 text-sm leading-6 text-stone-300">
            An alert is marked critical when the item
            is out of stock or its quantity is at or
            below half of its reorder level. Other
            reorder alerts are marked low stock.
          </p>
        </div>
      </section>
    </div>
  );
}

function AlertRow({ item }) {
  const alertLevel = getAlertLevel(item);
  const shortage =
    Math.max(
      Number(item.reorderLevel)
      - Number(item.currentQuantity),
      0,
    );

  return (
    <article className="grid gap-4 px-6 py-5 xl:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_0.7fr] xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {item.itemName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {item.supplierName}
        </p>

        <p className="mt-1 text-xs text-red-600">
          Short by {formatQuantity(shortage)}{" "}
          {item.unit}
        </p>
      </div>

      <TableValue
        label="Category"
        value={formatLabel(item.itemCategory)}
      />

      <TableValue
        label="Current Stock"
        value={`${formatQuantity(
          item.currentQuantity,
        )} ${item.unit}`}
        emphasized
      />

      <TableValue
        label="Reorder Level"
        value={`${formatQuantity(
          item.reorderLevel,
        )} ${item.unit}`}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Alert Level
        </p>

        <span
          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 xl:mt-0 ${
            alertLevel === "CRITICAL"
              ? "bg-red-50 text-red-700 ring-red-200"
              : "bg-amber-50 text-amber-700 ring-amber-200"
          }`}
        >
          {formatLabel(alertLevel)}
        </span>
      </div>

      <div>
        <Link
          to={`/inventory/items/${item.inventoryItemId}`}
          className="text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          View item
        </Link>
      </div>
    </article>
  );
}

function TableValue({
  label,
  value,
  emphasized = false,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
        {label}
      </p>

      <p
        className={`mt-1 text-sm xl:mt-0 ${
          emphasized
            ? "font-semibold text-primary-950"
            : "text-stone-700"
        }`}
      >
        {value}
      </p>
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

function getAlertLevel(item) {
  const currentQuantity =
    Number(item.currentQuantity);
  const reorderLevel =
    Number(item.reorderLevel);

  if (
    currentQuantity <= 0
    || currentQuantity <= reorderLevel / 2
  ) {
    return "CRITICAL";
  }

  return "LOW_STOCK";
}

function formatLabel(value) {
  if (!value) {
    return "Not available";
  }

  return String(value)
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase()
        + word.slice(1),
    )
    .join(" ");
}

function formatQuantity(value) {
  return new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}