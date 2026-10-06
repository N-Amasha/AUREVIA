import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  Lightbulb,
  Package,
  RefreshCw,
  TriangleAlert,
  Trash2,
} from "lucide-react";
import {
  getAllInventoryItems,
  getReorderAlerts,
  getTotalEstimatedWasteCost,
  getWasteRecordsByItem,
} from "../../api/inventoryApi";

export default function InventoryDashboardPage() {
  const [items, setItems] = useState([]);
  const [reorderAlerts, setReorderAlerts] =
    useState([]);
  const [wasteRecords, setWasteRecords] =
    useState([]);
  const [totalWasteCost, setTotalWasteCost] =
    useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const actions = [
    {
      title: "Inventory Items",
      description:
        "Review ingredients, suppliers, quantities and stock conditions.",
      icon: Package,
      path: "/inventory/items",
    },
    {
      title: "Stock Transactions",
      description:
        "Record ingredient usage and review inventory movements.",
      icon: ArrowLeftRight,
      path: "/inventory/stock",
    },
    {
      title: "Low Stock",
      description:
        "Identify items that require attention based on reorder levels.",
      icon: TriangleAlert,
      path: "/inventory/low-stock",
    },
    {
      title: "Waste Records",
      description:
        "Record and review food waste and its estimated financial cost.",
      icon: Trash2,
      path: "/inventory/waste",
    },
    {
      title: "Reorder Recommendations",
      description:
        "Review explainable suggestions generated from inventory data.",
      icon: Lightbulb,
      path: "/inventory/recommendations",
    },
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [itemData, alertData, wasteCostData] =
        await Promise.all([
          getAllInventoryItems(),
          getReorderAlerts(),
          getTotalEstimatedWasteCost(),
        ]);

      const safeItems = Array.isArray(itemData)
        ? itemData
        : [];

      const safeAlerts = Array.isArray(alertData)
        ? alertData
        : [];

      const wasteResults = await Promise.all(
        safeItems.map(async (item) => {
          try {
            const records =
              await getWasteRecordsByItem(
                item.inventoryItemId,
              );

            return Array.isArray(records)
              ? records
              : [];
          } catch {
            return [];
          }
        }),
      );

      const uniqueWasteRecords = Array.from(
        new Map(
          wasteResults
            .flat()
            .map((record) => [
              record.wasteId,
              record,
            ]),
        ).values(),
      );

      setItems(safeItems);
      setReorderAlerts(safeAlerts);
      setWasteRecords(uniqueWasteRecords);
      setTotalWasteCost(Number(wasteCostData || 0));
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load inventory dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  const reorderAlertIds = useMemo(
    () =>
      new Set(
        reorderAlerts.map(
          (item) => item.inventoryItemId,
        ),
      ),
    [reorderAlerts],
  );

  const lowStockItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.reorderRequired ||
          reorderAlertIds.has(
            item.inventoryItemId,
          ) ||
          Number(item.currentQuantity || 0) <=
            Number(item.reorderLevel || 0),
      ),
    [items, reorderAlertIds],
  );

  const expiredItems = useMemo(
    () => items.filter((item) => item.expired),
    [items],
  );

  const totalInventoryValue = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Number(item.currentQuantity || 0) *
            Number(item.unitCost || 0),
        0,
      ),
    [items],
  );

  const recentWasteRecords = useMemo(
    () =>
      [...wasteRecords]
        .sort(
          (first, second) =>
            new Date(second.wasteDate) -
            new Date(first.wasteDate),
        )
        .slice(0, 5),
    [wasteRecords],
  );

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Inventory Manager Workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Inventory dashboard
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Monitor inventory quantities, stock
            conditions, usage and food waste from one
            workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <h2 className="font-semibold text-red-950">
                Unable to load inventory information
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Package}
          label="Inventory Items"
          value={loading ? "…" : items.length}
          description={formatCurrency(
            totalInventoryValue,
          )}
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock Items"
          value={
            loading ? "…" : lowStockItems.length
          }
          description={`${expiredItems.length} expired`}
        />

        <SummaryCard
          icon={Trash2}
          label="Waste Records"
          value={
            loading ? "…" : wasteRecords.length
          }
          description={formatCurrency(
            totalWasteCost,
          )}
        />

        <SummaryCard
          icon={Lightbulb}
          label="Reorder Suggestions"
          value={
            loading ? "…" : reorderAlerts.length
          }
          description="Manager review required"
        />
      </section>

      {/* Attention */}
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          icon={TriangleAlert}
          title="Items requiring attention"
          description="Inventory items at or below their reorder level."
          actionText="View Low Stock"
          actionPath="/inventory/low-stock"
        >
          {loading ? (
            <LoadingMessage />
          ) : lowStockItems.length === 0 ? (
            <EmptyMessage text="No low-stock items require attention." />
          ) : (
            <div className="mt-5 space-y-3">
              {lowStockItems
                .slice(0, 5)
                .map((item) => (
                  <Link
                    key={item.inventoryItemId}
                    to={`/inventory/items/${item.inventoryItemId}`}
                    className="flex items-center justify-between gap-4 rounded-xl bg-cream-50 p-4 transition hover:bg-primary-50"
                  >
                    <div>
                      <p className="font-semibold text-primary-950">
                        {item.itemName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {formatLabel(
                          item.itemCategory,
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-700">
                        {formatQuantity(
                          item.currentQuantity,
                        )}{" "}
                        {item.unit}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Level:{" "}
                        {formatQuantity(
                          item.reorderLevel,
                        )}{" "}
                        {item.unit}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel
          icon={Trash2}
          title="Recent waste records"
          description="Latest food-waste activity recorded in the system."
          actionText="View Waste Records"
          actionPath="/inventory/waste"
        >
          {loading ? (
            <LoadingMessage />
          ) : recentWasteRecords.length === 0 ? (
            <EmptyMessage text="No waste records are available." />
          ) : (
            <div className="mt-5 space-y-3">
              {recentWasteRecords.map((record) => (
                <div
                  key={record.wasteId}
                  className="flex items-center justify-between gap-4 rounded-xl bg-cream-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {record.itemName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {formatLabel(
                        record.wasteReason,
                      )}{" "}
                      ·{" "}
                      {formatDateTime(
                        record.wasteDate,
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-950">
                      {formatQuantity(
                        record.quantity,
                      )}{" "}
                      {record.unit}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {formatCurrency(
                        record.estimatedCost,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Inventory Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage inventory operations
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      {/* Workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Inventory Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From ingredient usage to inventory decisions
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <FlowStep
            number="01"
            title="Track"
            text="Maintain inventory items, quantities, costs and supplier information."
          />

          <FlowStep
            number="02"
            title="Use"
            text="Record ingredient usage and automatically reduce available stock."
          />

          <FlowStep
            number="03"
            title="Monitor"
            text="Identify low-stock conditions and record food waste."
          />

          <FlowStep
            number="04"
            title="Recommend"
            text="Use explainable inventory rules to support reorder decisions."
          />
        </div>
      </section>
    </div>
  );
}

function DashboardPanel({
  icon: Icon,
  title,
  description,
  actionText,
  actionPath,
  children,
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              {description}
            </p>
          </div>
        </div>

        <Link
          to={actionPath}
          className="shrink-0 text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          {actionText}
        </Link>
      </div>

      {children}
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
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

      <p className="mt-2 text-xs text-stone-500">
        {description}
      </p>
    </div>
  );
}

function LoadingMessage() {
  return (
    <p className="mt-6 text-sm text-stone-500">
      Loading records...
    </p>
  );
}

function EmptyMessage({ text }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-6 text-center">
      <p className="text-sm text-stone-600">
        {text}
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

function formatQuantity(value) {
  return Number(value || 0).toLocaleString("en-LK", {
    maximumFractionDigits: 3,
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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