import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  PackageCheck,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  getAllInventoryItems,
  getReorderAlerts,
  getTotalUsageForItem,
} from "../../api/inventoryApi";

export default function ReorderRecommendationsPage() {
  const [items, setItems] = useState([]);
  const [reorderAlerts, setReorderAlerts] = useState([]);
  const [usageTotals, setUsageTotals] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [itemData, alertData] = await Promise.all([
        getAllInventoryItems(),
        getReorderAlerts(),
      ]);

      const safeItems = Array.isArray(itemData)
        ? itemData
        : [];

      const safeAlerts = Array.isArray(alertData)
        ? alertData
        : [];

      const usageEntries = await Promise.all(
        safeItems.map(async (item) => {
          try {
            const total = await getTotalUsageForItem(
              item.inventoryItemId,
            );

            return [
              item.inventoryItemId,
              Number(total || 0),
            ];
          } catch {
            return [item.inventoryItemId, 0];
          }
        }),
      );

      setItems(safeItems);
      setReorderAlerts(safeAlerts);
      setUsageTotals(Object.fromEntries(usageEntries));
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load inventory recommendations.",
      );
    } finally {
      setLoading(false);
    }
  }

  const alertIds = useMemo(
    () =>
      new Set(
        reorderAlerts.map(
          (item) => item.inventoryItemId,
        ),
      ),
    [reorderAlerts],
  );

  const recommendations = useMemo(
    () =>
      items.map((item) => {
        const currentQuantity = Number(
          item.currentQuantity || 0,
        );

        const reorderLevel = Number(
          item.reorderLevel || 0,
        );

        const totalUsage = Number(
          usageTotals[item.inventoryItemId] || 0,
        );

        const requiresReorder =
          item.reorderRequired ||
          alertIds.has(item.inventoryItemId) ||
          currentQuantity <= reorderLevel;

        const monitorLimit = reorderLevel * 1.5;

        let recommendationLevel = "STOCK_SUFFICIENT";
        let suggestion = "Stock Sufficient";
        let reason =
          "Current stock is above the configured monitoring level.";

        if (requiresReorder) {
          recommendationLevel = "REORDER_SUGGESTED";
          suggestion = "Reorder Suggested";

          const shortage = Math.max(
            reorderLevel - currentQuantity,
            0,
          );

          reason =
            shortage > 0
              ? `Current stock is ${formatQuantity(
                  shortage,
                )} ${item.unit} below the reorder level.`
              : "Current stock has reached the configured reorder level.";
        } else if (
          reorderLevel > 0 &&
          currentQuantity <= monitorLimit
        ) {
          recommendationLevel = "MONITOR";
          suggestion = "Monitor";

          reason =
            "Current stock is approaching the configured reorder level.";
        }

        if (item.expired) {
          recommendationLevel = "REORDER_SUGGESTED";
          suggestion = "Reorder Suggested";
          reason =
            "The current inventory batch is expired and requires manager attention.";
        }

        return {
          ...item,
          currentQuantity,
          reorderLevel,
          totalUsage,
          recommendationLevel,
          suggestion,
          reason,
        };
      }),
    [items, usageTotals, alertIds],
  );

  const categories = useMemo(
    () =>
      [
        ...new Set(
          items
            .map((item) => item.itemCategory)
            .filter(Boolean),
        ),
      ].sort(),
    [items],
  );

  const filteredRecommendations = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return recommendations.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.itemName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item.itemCategory
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item.supplierName
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.itemCategory === categoryFilter;

      const matchesLevel =
        levelFilter === "ALL" ||
        item.recommendationLevel === levelFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [
    recommendations,
    searchTerm,
    categoryFilter,
    levelFilter,
  ]);

  const recommendationCount = recommendations.filter(
    (item) =>
      item.recommendationLevel !== "STOCK_SUFFICIENT",
  ).length;

  const needsAttentionCount = recommendations.filter(
    (item) =>
      item.recommendationLevel === "REORDER_SUGGESTED",
  ).length;

  const sufficientCount = recommendations.filter(
    (item) =>
      item.recommendationLevel === "STOCK_SUFFICIENT",
  ).length;

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Reorder recommendations
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review explainable inventory recommendations
          generated from current quantities, reorder levels
          and recorded usage.
        </p>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <h2 className="font-semibold text-red-950">
                Unable to load recommendations
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-800">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={loadRecommendations}
                className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Lightbulb}
          label="Recommendations"
          value={recommendationCount}
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Needs Attention"
          value={needsAttentionCount}
        />

        <SummaryCard
          icon={PackageCheck}
          label="Stock Sufficient"
          value={sufficientCount}
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
              placeholder="Search item, category or supplier"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
            value={levelFilter}
            onChange={(event) =>
              setLevelFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="ALL">
              All Recommendation Levels
            </option>

            <option value="REORDER_SUGGESTED">
              Reorder Suggested
            </option>

            <option value="MONITOR">
              Monitor
            </option>

            <option value="STOCK_SUFFICIENT">
              Stock Sufficient
            </option>
          </select>
        </div>
      </section>

      {/* Recommendation Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Inventory recommendations
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading inventory recommendations..."
                  : `${filteredRecommendations.length} recommendations displayed.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Current Stock</span>
          <span>Threshold</span>
          <span>Usage</span>
          <span>Suggestion</span>
          <span>Reason</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-stone-600">
              Loading recommendations...
            </p>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Lightbulb className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No matching recommendations
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No inventory records match the selected
              search and filter conditions.
            </p>
          </div>
        ) : (
          <div>
            {filteredRecommendations.map((item) => (
              <RecommendationRow
                key={item.inventoryItemId}
                item={item}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recommendation Logic */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Recommendation Logic
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How a reorder suggestion is generated
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <RuleStep
            number="01"
            title="Read Stock"
            text="Retrieve the item's current available quantity."
          />

          <RuleStep
            number="02"
            title="Check Threshold"
            text="Compare current stock with the configured reorder level."
          />

          <RuleStep
            number="03"
            title="Review Usage"
            text="Display recorded usage to support the manager's decision."
          />

          <RuleStep
            number="04"
            title="Recommend"
            text="Produce an explainable recommendation for manager review."
          />
        </div>
      </section>

      {/* Human Decision */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-gold-600" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Recommendation, not automatic purchasing
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
              Aurevia supports the Inventory Manager's
              decision. A recommendation does not
              automatically create a supplier order or
              purchase stock.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RecommendationRow({ item }) {
  return (
    <div className="grid gap-4 border-b border-stone-100 px-6 py-5 last:border-b-0 xl:grid-cols-7 xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {item.itemName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {formatLabel(item.itemCategory)}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {item.supplierName || "No supplier"}
        </p>
      </div>

      <DataField
        label="Current Stock"
        value={`${formatQuantity(
          item.currentQuantity,
        )} ${item.unit}`}
      />

      <DataField
        label="Threshold"
        value={`${formatQuantity(
          item.reorderLevel,
        )} ${item.unit}`}
      />

      <DataField
        label="Usage"
        value={`${formatQuantity(
          item.totalUsage,
        )} ${item.unit}`}
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Suggestion
        </p>

        <RecommendationBadge
          level={item.recommendationLevel}
          label={item.suggestion}
        />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Reason
        </p>

        <p className="text-sm leading-5 text-stone-600">
          {item.reason}
        </p>
      </div>

      <div>
        <Link
          to={`/inventory/items/${item.inventoryItemId}`}
          className="inline-flex rounded-lg border border-primary-200 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
        {label}
      </p>

      <p className="text-sm font-medium text-primary-950">
        {value}
      </p>
    </div>
  );
}

function RecommendationBadge({ level, label }) {
  const styles = {
    REORDER_SUGGESTED:
      "border-red-200 bg-red-50 text-red-700",
    MONITOR:
      "border-amber-200 bg-amber-50 text-amber-700",
    STOCK_SUFFICIENT:
      "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[level] ||
        "border-stone-200 bg-stone-50 text-stone-700"
      }`}
    >
      {label}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
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

function formatQuantity(value) {
  return Number(value || 0).toLocaleString("en-LK", {
    maximumFractionDigits: 3,
  });
}

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}