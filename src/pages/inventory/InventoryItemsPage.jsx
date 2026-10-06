import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  TriangleAlert,
} from "lucide-react";

import { getAllInventoryItems } from "../../api/inventoryApi";

export default function InventoryItemsPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadInventoryItems() {
      try {
        setLoading(true);
        setErrorMessage("");

        const itemData =
          await getAllInventoryItems();

        if (active) {
          setItems(
            Array.isArray(itemData)
              ? itemData
              : [],
          );
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.response?.data?.message
              || "Unable to load inventory items.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInventoryItems();

    return () => {
      active = false;
    };
  }, []);

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

  const lowStockCount = useMemo(
    () =>
      items.filter(
        (item) => item.reorderRequired,
      ).length,
    [items],
  );

  const availableCount = useMemo(
    () =>
      items.filter(
        (item) =>
          !item.expired
          && Number(item.currentQuantity) > 0,
      ).length,
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const status = getStockStatus(item);

      const searchableText = [
        item.inventoryItemId,
        item.itemName,
        item.itemCategory,
        item.supplierName,
        item.unit,
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

      const matchesStatus =
        statusFilter === "ALL"
        || status === statusFilter;

      return (
        matchesSearch
        && matchesCategory
        && matchesStatus
      );
    });
  }, [
    items,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Inventory & Food Waste Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Inventory items
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review ingredients and stock quantities used
          across restaurant operations.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Inventory records could not be loaded
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Package}
          label="Total Items"
          value={loading ? "..." : items.length}
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Low Stock"
          value={
            loading
              ? "..."
              : lowStockCount
          }
        />

        <SummaryCard
          icon={Package}
          label="Available Items"
          value={
            loading
              ? "..."
              : availableCount
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
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Stock Statuses
            </option>
            <option value="AVAILABLE">
              Available
            </option>
            <option value="LOW_STOCK">
              Low Stock
            </option>
            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>
            <option value="EXPIRED">
              Expired
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search by item, supplier or category and
          filter using live stock information.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Package className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Inventory records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading inventory records..."
                  : `${filteredItems.length} ${
                      filteredItems.length === 1
                        ? "item"
                        : "items"
                    } found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.9fr_0.7fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Item</span>
          <span>Supplier</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Reorder Level</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {!loading && filteredItems.length > 0 && (
          <div className="divide-y divide-stone-200">
            {filteredItems.map((item) => (
              <InventoryItemRow
                key={item.inventoryItemId}
                item={item}
              />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Package className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No matching inventory items
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No inventory records match the current
              search and filter selections.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Stock Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Inventory status is calculated automatically
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Available"
            text="The item has usable stock above its reorder level."
          />

          <FlowStep
            number="02"
            title="Low Stock"
            text="Current quantity has reached or fallen below the reorder level."
          />

          <FlowStep
            number="03"
            title="Out of Stock"
            text="The item currently has no remaining quantity."
          />

          <FlowStep
            number="04"
            title="Expired"
            text="The item has passed its recorded expiry date."
          />
        </div>
      </section>
    </div>
  );
}

function InventoryItemRow({ item }) {
  const status = getStockStatus(item);

  return (
    <article className="grid gap-4 px-6 py-5 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.9fr_0.7fr] xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {item.itemName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          ITEM-{item.inventoryItemId}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          Expires: {formatDate(item.expiryDate)}
        </p>
      </div>

      <TableValue
        label="Supplier"
        value={item.supplierName}
      />

      <TableValue
        label="Category"
        value={formatLabel(item.itemCategory)}
      />

      <TableValue
        label="Quantity"
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
          Status
        </p>

        <span
          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 xl:mt-0 ${stockStatusClass(
            status,
          )}`}
        >
          {formatLabel(status)}
        </span>
      </div>

      <div>
        <Link
          to={`/inventory/items/${item.inventoryItemId}`}
          className="text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          View details
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
        {value ?? "Not available"}
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

function stockStatusClass(status) {
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
    styles[status]
    ?? "bg-stone-100 text-stone-700 ring-stone-200"
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not available";
  }

  return value
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