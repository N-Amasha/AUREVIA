import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  ClipboardList,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  createInventoryUsage,
  getAllInventoryItems,
  getInventoryUsageByItem,
} from "../../api/inventoryApi";

const EMPTY_FORM = {
  inventoryItemId: "",
  orderId: "",
  usageDate: "",
  quantityUsed: "",
  usageReason: "",
};

export default function StockTransactionsPage() {
  const [items, setItems] = useState([]);
  const [usageRecords, setUsageRecords] =
    useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [typeFilter, setTypeFilter] =
    useState("ALL");
  const [dateFilter, setDateFilter] =
    useState("");
  const [form, setForm] =
    useState(EMPTY_FORM);
  const [formVisible, setFormVisible] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [loading, setLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  async function loadUsageRecords() {
    const loadedItems =
      await getAllInventoryItems();

    const safeItems = Array.isArray(loadedItems)
      ? loadedItems
      : [];

    const usageResults = await Promise.all(
      safeItems.map((item) =>
        getInventoryUsageByItem(
          item.inventoryItemId,
        ),
      ),
    );

    const combinedUsage = usageResults
      .flatMap((records) =>
        Array.isArray(records) ? records : [],
      )
      .sort(
        (first, second) =>
          new Date(second.usageDate).getTime()
          - new Date(first.usageDate).getTime(),
      );

    setItems(safeItems);
    setUsageRecords(combinedUsage);
  }

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setErrorMessage("");

        const loadedItems =
          await getAllInventoryItems();

        const safeItems =
          Array.isArray(loadedItems)
            ? loadedItems
            : [];

        const usageResults =
          await Promise.all(
            safeItems.map((item) =>
              getInventoryUsageByItem(
                item.inventoryItemId,
              ),
            ),
          );

        if (!active) {
          return;
        }

        setItems(safeItems);
        setUsageRecords(
          usageResults
            .flatMap((records) =>
              Array.isArray(records)
                ? records
                : [],
            )
            .sort(
              (first, second) =>
                new Date(
                  second.usageDate,
                ).getTime()
                - new Date(
                  first.usageDate,
                ).getTime(),
            ),
        );
      } catch (error) {
        if (active) {
          setErrorMessage(
            getErrorMessage(
              error,
              "Unable to load inventory usage records.",
            ),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, []);

  const orderUsageCount = useMemo(
    () =>
      usageRecords.filter(
        (record) => record.orderId,
      ).length,
    [usageRecords],
  );

  const generalUsageCount = useMemo(
    () =>
      usageRecords.filter(
        (record) => !record.orderId,
      ).length,
    [usageRecords],
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return usageRecords.filter((record) => {
      const usageType = record.orderId
        ? "ORDER"
        : "GENERAL";

      const searchableText = [
        record.usageId,
        record.itemName,
        record.usageReason,
        record.orderId
          ? `ORD-${record.orderId}`
          : "General Usage",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch
        || searchableText.includes(normalizedSearch);

      const matchesType =
        typeFilter === "ALL"
        || usageType === typeFilter;

      const matchesDate =
        !dateFilter
        || record.usageDate?.slice(0, 10)
          === dateFilter;

      return (
        matchesSearch
        && matchesType
        && matchesDate
      );
    });
  }, [
    usageRecords,
    searchTerm,
    typeFilter,
    dateFilter,
  ]);

  function openForm() {
    setForm({
      ...EMPTY_FORM,
      usageDate: getCurrentDateTime(),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setFormVisible(true);
  }

  function closeForm() {
    if (submitting) {
      return;
    }

    setFormVisible(false);
    setForm(EMPTY_FORM);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createInventoryUsage({
        inventoryItemId:
          Number(form.inventoryItemId),
        orderId: form.orderId
          ? Number(form.orderId)
          : null,
        usageDate: form.usageDate,
        quantityUsed:
          Number(form.quantityUsed),
        usageReason:
          form.usageReason.trim(),
      });

      await loadUsageRecords();

      setSuccessMessage(
        "Inventory usage recorded successfully. The available stock quantity was updated.",
      );
      setFormVisible(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to record inventory usage.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Inventory & Food Waste Management
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Inventory usage
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Review ingredient usage and record
            quantities consumed by restaurant
            operations and customer orders.
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Record Usage
        </button>
      </section>

      {successMessage && (
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
          {successMessage}
        </section>
      )}

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Inventory action could not be completed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ArrowUpFromLine}
          label="Usage Records"
          value={
            loading
              ? "..."
              : usageRecords.length
          }
        />

        <SummaryCard
          icon={ShoppingBag}
          label="Order Usage"
          value={
            loading
              ? "..."
              : orderUsageCount
          }
        />

        <SummaryCard
          icon={ClipboardList}
          label="General Usage"
          value={
            loading
              ? "..."
              : generalUsageCount
          }
        />
      </section>

      {formVisible && (
        <UsageForm
          form={form}
          items={items}
          submitting={submitting}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

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
              placeholder="Search item, reason or order"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Usage Types
            </option>
            <option value="ORDER">
              Order Usage
            </option>
            <option value="GENERAL">
              General Usage
            </option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ArrowLeftRight className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Usage history
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading usage records..."
                  : `${filteredRecords.length} ${
                      filteredRecords.length === 1
                        ? "record"
                        : "records"
                    } found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1.5fr_0.9fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Usage</span>
          <span>Item</span>
          <span>Quantity</span>
          <span>Date</span>
          <span>Reason</span>
          <span>Reference</span>
        </div>

        {!loading && filteredRecords.length > 0 && (
          <div className="divide-y divide-stone-200">
            {filteredRecords.map((record) => (
              <UsageRow
                key={record.usageId}
                record={record}
              />
            ))}
          </div>
        )}

        {!loading && filteredRecords.length === 0 && (
          <div className="px-6 py-14 text-center">
            <ArrowLeftRight className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No matching usage records
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No inventory usage records match the
              current filters.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Stock Usage
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Recording inventory consumption
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <TransactionStep
            number="01"
            title="Select Item"
            text="Choose the inventory item consumed by restaurant operations."
          />

          <TransactionStep
            number="02"
            title="Record Usage"
            text="Enter the quantity, date, reason and optional customer-order reference."
          />

          <TransactionStep
            number="03"
            title="Update Stock"
            text="The backend validates availability and deducts the used quantity."
          />
        </div>
      </section>
    </div>
  );
}

function UsageForm({
  form,
  items,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-primary-950">
            Record inventory usage
          </h2>

          <p className="mt-1 text-sm text-primary-800">
            The recorded quantity will be deducted
            from the selected item.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg p-2 text-primary-700 hover:bg-white"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <FormField label="Inventory Item">
          <select
            name="inventoryItemId"
            value={form.inventoryItemId}
            onChange={onChange}
            required
            className={inputClassName}
          >
            <option value="">
              Select an item
            </option>

            {items.map((item) => (
              <option
                key={item.inventoryItemId}
                value={item.inventoryItemId}
              >
                {item.itemName} —{" "}
                {formatQuantity(
                  item.currentQuantity,
                )}{" "}
                {item.unit} available
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Quantity Used">
          <input
            type="number"
            name="quantityUsed"
            value={form.quantityUsed}
            onChange={onChange}
            min="0.001"
            step="0.001"
            required
            placeholder="0.000"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Usage Date and Time">
          <input
            type="datetime-local"
            name="usageDate"
            value={form.usageDate}
            onChange={onChange}
            required
            className={inputClassName}
          />
        </FormField>

        <FormField label="Order ID (Optional)">
          <input
            type="number"
            name="orderId"
            value={form.orderId}
            onChange={onChange}
            min="1"
            step="1"
            placeholder="Leave blank for general usage"
            className={inputClassName}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Usage Reason">
            <input
              type="text"
              name="usageReason"
              value={form.usageReason}
              onChange={onChange}
              required
              placeholder="Example: Kitchen preparation"
              className={inputClassName}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {submitting
            ? "Recording..."
            : "Record Usage"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function UsageRow({ record }) {
  const reference = record.orderId
    ? `ORD-${record.orderId}`
    : "General";

  return (
    <article className="grid gap-4 px-6 py-5 xl:grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1.5fr_0.9fr] xl:items-center">
      <TableValue
        label="Usage"
        value={`USE-${record.usageId}`}
        emphasized
      />

      <TableValue
        label="Item"
        value={record.itemName}
      />

      <TableValue
        label="Quantity"
        value={`${formatQuantity(
          record.quantityUsed,
        )} ${record.unit}`}
        emphasized
      />

      <TableValue
        label="Date"
        value={formatDateTime(
          record.usageDate,
        )}
      />

      <TableValue
        label="Reason"
        value={formatLabel(
          record.usageReason,
        )}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Reference
        </p>

        <span className="mt-1 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 xl:mt-0">
          {reference}
        </span>
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
        {value || "Not available"}
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

function FormField({ label, children }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      {children}
    </label>
  );
}

function TransactionStep({
  number,
  title,
  text,
}) {
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

const inputClassName =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function getCurrentDateTime() {
  const now = new Date();
  const timezoneOffset =
    now.getTimezoneOffset() * 60000;

  return new Date(
    now.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 16);
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
    maximumFractionDigits: 3,
  }).format(Number(value ?? 0));
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

function getErrorMessage(error, fallbackMessage) {
  const validationErrors =
    error.response?.data?.validationErrors;

  if (
    validationErrors
    && typeof validationErrors === "object"
  ) {
    const firstMessage =
      Object.values(validationErrors)[0];

    if (firstMessage) {
      return firstMessage;
    }
  }

  return (
    error.response?.data?.message
    || fallbackMessage
  );
}