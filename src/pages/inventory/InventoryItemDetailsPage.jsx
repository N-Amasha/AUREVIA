import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Banknote,
  Package,
  Store,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import {
  getInventoryItemById,
  getInventoryUsageByItem,
  getSupplierById,
  getTotalUsageForItem,
  getWasteCostForItem,
  getWasteRecordsByItem,
} from "../../api/inventoryApi";

export default function InventoryItemDetailsPage() {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [supplier, setSupplier] =
    useState(null);
  const [usageRecords, setUsageRecords] =
    useState([]);
  const [wasteRecords, setWasteRecords] =
    useState([]);
  const [totalUsage, setTotalUsage] =
    useState(0);
  const [totalWasteCost, setTotalWasteCost] =
    useState(0);
  const [loading, setLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadItemDetails() {
      try {
        setLoading(true);
        setErrorMessage("");

        const loadedItem =
          await getInventoryItemById(itemId);

        const [
          loadedSupplier,
          loadedUsage,
          loadedWaste,
          loadedTotalUsage,
          loadedWasteCost,
        ] = await Promise.all([
          getSupplierById(
            loadedItem.supplierId,
          ),
          getInventoryUsageByItem(
            loadedItem.inventoryItemId,
          ),
          getWasteRecordsByItem(
            loadedItem.inventoryItemId,
          ),
          getTotalUsageForItem(
            loadedItem.inventoryItemId,
          ),
          getWasteCostForItem(
            loadedItem.inventoryItemId,
          ),
        ]);

        if (!active) {
          return;
        }

        setItem(loadedItem);
        setSupplier(loadedSupplier);
        setUsageRecords(
          Array.isArray(loadedUsage)
            ? loadedUsage
            : [],
        );
        setWasteRecords(
          Array.isArray(loadedWaste)
            ? loadedWaste
            : [],
        );
        setTotalUsage(loadedTotalUsage ?? 0);
        setTotalWasteCost(loadedWasteCost ?? 0);
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.response?.data?.message
              || "Unable to load inventory item details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadItemDetails();

    return () => {
      active = false;
    };
  }, [itemId]);

  const activityRecords = useMemo(() => {
    const usageActivity = usageRecords.map(
      (usage) => ({
        id: `usage-${usage.usageId}`,
        type: "USAGE",
        quantity: usage.quantityUsed,
        unit: usage.unit,
        date: usage.usageDate,
        reason: usage.usageReason,
        reference: usage.orderId
          ? `ORD-${usage.orderId}`
          : "General Usage",
      }),
    );

    const wasteActivity = wasteRecords.map(
      (waste) => ({
        id: `waste-${waste.wasteId}`,
        type: "WASTE",
        quantity: waste.quantity,
        unit: waste.unit,
        date: waste.wasteDate,
        reason: waste.wasteReason,
        reference: waste.managerName
          || `Manager ${waste.managerId}`,
      }),
    );

    return [
      ...usageActivity,
      ...wasteActivity,
    ].sort(
      (first, second) =>
        new Date(second.date).getTime()
        - new Date(first.date).getTime(),
    );
  }, [usageRecords, wasteRecords]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
        Loading inventory item details...
      </div>
    );
  }

  if (errorMessage || !item) {
    return (
      <div>
        <Link
          to="/inventory/items"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory Items
        </Link>

        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Inventory item could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      </div>
    );
  }

  const stockStatus = getStockStatus(item);
  const inventoryValue =
    Number(item.currentQuantity)
    * Number(item.unitCost);

  return (
    <div>
      <Link
        to="/inventory/items"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory Items
      </Link>

      <section className="mt-7">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Inventory & Food Waste Management
          </p>

          <StockStatusBadge status={stockStatus} />
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          {item.itemName}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review stock, supplier, usage and waste
          information for ITEM-{item.inventoryItemId}.
        </p>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <InfoCard
          icon={Package}
          title="Item information"
          description="Basic information retrieved from the inventory-item record."
          items={[
            [
              "Item ID",
              `ITEM-${item.inventoryItemId}`,
            ],
            [
              "Item Name",
              item.itemName,
            ],
            [
              "Category",
              formatLabel(item.itemCategory),
            ],
            [
              "Unit",
              item.unit,
            ],
            [
              "Unit Cost",
              formatCurrency(item.unitCost),
            ],
            [
              "Expiry Date",
              formatDate(item.expiryDate),
            ],
          ]}
        />

        <InfoCard
          icon={Store}
          title="Supplier information"
          description="The supplier associated with this inventory item."
          items={[
            [
              "Supplier",
              supplier?.supplierName
              || item.supplierName,
            ],
            [
              "Email",
              supplier?.email
              || "Not available",
            ],
            [
              "Contact Number",
              supplier?.contactNumber
              || "Not available",
            ],
            [
              "City",
              supplier?.city
              || "Not available",
            ],
            [
              "Province",
              supplier?.province
              || "Not available",
            ],
            [
              "Postal Code",
              supplier?.postalCode
              || "Not available",
            ],
          ]}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Stock monitoring
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Live stock condition calculated using
              quantity, reorder level and expiry data.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatusBox
            label="Current Stock"
            value={`${formatQuantity(
              item.currentQuantity,
            )} ${item.unit}`}
          />

          <StatusBox
            label="Reorder Level"
            value={`${formatQuantity(
              item.reorderLevel,
            )} ${item.unit}`}
          />

          <StatusBox
            label="Stock Condition"
            value={formatLabel(stockStatus)}
          />

          <StatusBox
            label="Inventory Value"
            value={formatCurrency(inventoryValue)}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ArrowLeftRight}
          label="Usage Records"
          value={usageRecords.length}
          detail={`${formatQuantity(
            totalUsage,
          )} ${item.unit} total`}
        />

        <SummaryCard
          icon={Trash2}
          label="Waste Records"
          value={wasteRecords.length}
          detail="Recorded waste entries"
        />

        <SummaryCard
          icon={Banknote}
          label="Estimated Waste Cost"
          value={formatCurrency(totalWasteCost)}
          detail="Total estimated loss"
        />
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ArrowLeftRight className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Inventory activity
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Combined usage and waste history for
                this item.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[0.7fr_0.8fr_1fr_1.5fr_1fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Type</span>
          <span>Quantity</span>
          <span>Date</span>
          <span>Reason</span>
          <span>Reference</span>
        </div>

        {activityRecords.length > 0 ? (
          <div className="divide-y divide-stone-200">
            {activityRecords.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ArrowLeftRight className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No inventory activity available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No usage or waste records are associated
              with this inventory item.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Stock Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How inventory status is determined
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <RuleStep
            number="01"
            title="Current Quantity"
            text="The system retrieves the currently available quantity from the inventory record."
          />

          <RuleStep
            number="02"
            title="Compare"
            text="Current quantity is compared with the configured reorder level."
          />

          <RuleStep
            number="03"
            title="Alert"
            text="The item is flagged when stock is low, unavailable or expired."
          />
        </div>
      </section>
    </div>
  );
}

function ActivityRow({ activity }) {
  return (
    <article className="grid gap-4 px-6 py-5 lg:grid-cols-[0.7fr_0.8fr_1fr_1.5fr_1fr] lg:items-center">
      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            activity.type === "WASTE"
              ? "bg-red-50 text-red-700 ring-red-200"
              : "bg-blue-50 text-blue-700 ring-blue-200"
          }`}
        >
          {formatLabel(activity.type)}
        </span>
      </div>

      <ActivityValue
        label="Quantity"
        value={`${formatQuantity(
          activity.quantity,
        )} ${activity.unit}`}
        emphasized
      />

      <ActivityValue
        label="Date"
        value={formatDateTime(activity.date)}
      />

      <ActivityValue
        label="Reason"
        value={
          formatLabel(activity.reason)
        }
      />

      <ActivityValue
        label="Reference"
        value={activity.reference}
      />
    </article>
  );
}

function ActivityValue({
  label,
  value,
  emphasized = false,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
        {label}
      </p>

      <p
        className={`mt-1 text-sm lg:mt-0 ${
          emphasized
            ? "font-semibold text-primary-950"
            : "text-stone-700"
        }`}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
  items,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <DetailItem
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-primary-950">
        {value || "Not available"}
      </p>
    </div>
  );
}

function StatusBox({ label, value }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
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
        {detail}
      </p>
    </div>
  );
}

function StockStatusBadge({ status }) {
  const styles = {
    AVAILABLE:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    LOW_STOCK:
      "bg-amber-50 text-amber-700 ring-amber-200",
    OUT_OF_STOCK:
      "bg-red-50 text-red-700 ring-red-200",
    EXPIRED:
      "bg-stone-100 text-stone-700 ring-stone-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[status]
        ?? "bg-stone-100 text-stone-700 ring-stone-200"
      }`}
    >
      {formatLabel(status)}
    </span>
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

function getStockStatus(item) {
  if (item.expired) {
    return "EXPIRED";
  }

  if (Number(item.currentQuantity) <= 0) {
    return "OUT_OF_STOCK";
  }

  if (item.reorderRequired) {
    return "LOW_STOCK";
  }

  return "AVAILABLE";
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}