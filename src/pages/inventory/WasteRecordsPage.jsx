import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createWasteRecord,
  getAllInventoryItems,
  getTotalEstimatedWasteCost,
  getWasteRecordsByItem,
} from "../../api/inventoryApi";

const EMPTY_FORM = {
  inventoryItemId: "",
  managerId: "",
  wasteDate: "",
  wasteReason: "",
  quantity: "",
};

export default function WasteRecordsPage() {
  const [items, setItems] = useState([]);
  const [records, setRecords] = useState([]);
  const [totalWasteCost, setTotalWasteCost] =
    useState(0);
  const [form, setForm] =
    useState(EMPTY_FORM);
  const [formVisible, setFormVisible] =
    useState(false);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [reasonFilter, setReasonFilter] =
    useState("ALL");
  const [dateFilter, setDateFilter] =
    useState("");
  const [loading, setLoading] =
    useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  async function loadWasteData() {
    const loadedItems =
      await getAllInventoryItems();

    const safeItems = Array.isArray(loadedItems)
      ? loadedItems
      : [];

    const [recordGroups, loadedCost] =
      await Promise.all([
        Promise.all(
          safeItems.map((item) =>
            getWasteRecordsByItem(
              item.inventoryItemId,
            ),
          ),
        ),
        getTotalEstimatedWasteCost(),
      ]);

    setItems(safeItems);
    setRecords(
      recordGroups
        .flatMap((group) =>
          Array.isArray(group) ? group : [],
        )
        .sort(
          (first, second) =>
            new Date(second.wasteDate).getTime()
            - new Date(first.wasteDate).getTime(),
        ),
    );
    setTotalWasteCost(loadedCost ?? 0);
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

        const [recordGroups, loadedCost] =
          await Promise.all([
            Promise.all(
              safeItems.map((item) =>
                getWasteRecordsByItem(
                  item.inventoryItemId,
                ),
              ),
            ),
            getTotalEstimatedWasteCost(),
          ]);

        if (!active) {
          return;
        }

        setItems(safeItems);
        setRecords(
          recordGroups
            .flatMap((group) =>
              Array.isArray(group)
                ? group
                : [],
            )
            .sort(
              (first, second) =>
                new Date(
                  second.wasteDate,
                ).getTime()
                - new Date(
                  first.wasteDate,
                ).getTime(),
            ),
        );
        setTotalWasteCost(loadedCost ?? 0);
      } catch (error) {
        if (active) {
          setErrorMessage(
            getErrorMessage(
              error,
              "Unable to load waste records.",
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

  const reasons = useMemo(
    () =>
      [
        ...new Set(
          records
            .map((record) =>
              record.wasteReason,
            )
            .filter(Boolean),
        ),
      ].sort(),
    [records],
  );

  const affectedItemCount = useMemo(
    () =>
      new Set(
        records.map(
          (record) =>
            record.inventoryItemId,
        ),
      ).size,
    [records],
  );

  const totalWasteQuantity = useMemo(
    () =>
      records.reduce(
        (total, record) =>
          total + Number(record.quantity || 0),
        0,
      ),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const searchableText = [
        record.wasteId,
        record.itemName,
        record.managerName,
        record.wasteReason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch
        || searchableText.includes(normalizedSearch);

      const matchesReason =
        reasonFilter === "ALL"
        || record.wasteReason === reasonFilter;

      const matchesDate =
        !dateFilter
        || record.wasteDate?.slice(0, 10)
          === dateFilter;

      return (
        matchesSearch
        && matchesReason
        && matchesDate
      );
    });
  }, [
    records,
    searchTerm,
    reasonFilter,
    dateFilter,
  ]);

  function openForm() {
    setForm({
      ...EMPTY_FORM,
      wasteDate: getCurrentDateTime(),
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

  function handleChange(event) {
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
      await createWasteRecord({
        inventoryItemId:
          Number(form.inventoryItemId),
        managerId: Number(form.managerId),
        wasteDate: form.wasteDate,
        wasteReason:
          form.wasteReason.trim(),
        quantity: Number(form.quantity),
      });

      await loadWasteData();

      setSuccessMessage(
        "Waste record created successfully. The inventory quantity was updated.",
      );
      setFormVisible(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to create the waste record.",
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
            Food waste records
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Record and review wasted inventory to
            monitor quantity loss and estimated cost.
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Record Waste
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
            Waste action could not be completed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Trash2}
          label="Waste Records"
          value={
            loading ? "..." : records.length
          }
        />

        <SummaryCard
          icon={Package}
          label="Items Affected"
          value={
            loading
              ? "..."
              : affectedItemCount
          }
        />

        <SummaryCard
          icon={Trash2}
          label="Total Quantity"
          value={
            loading
              ? "..."
              : formatQuantity(
                  totalWasteQuantity,
                )
          }
        />

        <SummaryCard
          icon={Banknote}
          label="Estimated Waste Cost"
          value={
            loading
              ? "..."
              : formatCurrency(
                  totalWasteCost,
                )
          }
        />
      </section>

      {formVisible && (
        <WasteForm
          form={form}
          items={items}
          submitting={submitting}
          onChange={handleChange}
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
              placeholder="Search item, reason or manager"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={reasonFilter}
            onChange={(event) =>
              setReasonFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Waste Reasons
            </option>

            {reasons.map((reason) => (
              <option
                key={reason}
                value={reason}
              >
                {formatLabel(reason)}
              </option>
            ))}
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
            <Trash2 className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Waste history
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading waste records..."
                  : `${filteredRecords.length} ${
                      filteredRecords.length === 1
                        ? "record"
                        : "records"
                    } found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[0.7fr_1.2fr_0.8fr_1fr_1fr_1fr_0.9fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Record</span>
          <span>Item</span>
          <span>Quantity</span>
          <span>Reason</span>
          <span>Date</span>
          <span>Manager</span>
          <span>Cost</span>
        </div>

        {!loading && filteredRecords.length > 0 && (
          <div className="divide-y divide-stone-200">
            {filteredRecords.map((record) => (
              <WasteRow
                key={record.wasteId}
                record={record}
              />
            ))}
          </div>
        )}

        {!loading && filteredRecords.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Trash2 className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No matching waste records
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No waste records match the current
              search and filter selections.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Waste Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From waste records to useful insight
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <FlowStep
            number="01"
            title="Record"
            text="Capture the item, quantity, date, reason and responsible manager."
          />

          <FlowStep
            number="02"
            title="Calculate"
            text="The backend calculates estimated loss using quantity and unit cost."
          />

          <FlowStep
            number="03"
            title="Improve"
            text="Waste trends support improved inventory and purchasing decisions."
          />
        </div>
      </section>
    </div>
  );
}

function WasteForm({
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
            Record food waste
          </h2>

          <p className="mt-1 text-sm text-primary-800">
            The recorded quantity will be removed
            from available stock.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg p-2 text-primary-700 hover:bg-white"
          aria-label="Close waste form"
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

        <FormField label="Inventory Manager ID">
          <input
            type="number"
            name="managerId"
            value={form.managerId}
            onChange={onChange}
            min="1"
            step="1"
            required
            placeholder="Enter your manager ID"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Waste Quantity">
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={onChange}
            min="0.001"
            step="0.001"
            required
            placeholder="0.000"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Waste Date and Time">
          <input
            type="datetime-local"
            name="wasteDate"
            value={form.wasteDate}
            onChange={onChange}
            required
            className={inputClassName}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Waste Reason">
            <select
              name="wasteReason"
              value={form.wasteReason}
              onChange={onChange}
              required
              className={inputClassName}
            >
              <option value="">
                Select a reason
              </option>
              <option value="SPOILAGE">
                Spoilage
              </option>
              <option value="EXPIRED">
                Expired
              </option>
              <option value="PREPARATION_WASTE">
                Preparation Waste
              </option>
              <option value="DAMAGED">
                Damaged
              </option>
              <option value="OTHER">
                Other
              </option>
            </select>
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
            : "Record Waste"}
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

function WasteRow({ record }) {
  return (
    <article className="grid gap-4 px-6 py-5 xl:grid-cols-[0.7fr_1.2fr_0.8fr_1fr_1fr_1fr_0.9fr] xl:items-center">
      <TableValue
        label="Record"
        value={`WASTE-${record.wasteId}`}
        emphasized
      />

      <TableValue
        label="Item"
        value={record.itemName}
      />

      <TableValue
        label="Quantity"
        value={`${formatQuantity(
          record.quantity,
        )} ${record.unit}`}
        emphasized
      />

      <TableValue
        label="Reason"
        value={formatLabel(
          record.wasteReason,
        )}
      />

      <TableValue
        label="Date"
        value={formatDateTime(
          record.wasteDate,
        )}
      />

      <TableValue
        label="Manager"
        value={record.managerName}
      />

      <TableValue
        label="Cost"
        value={formatCurrency(
          record.estimatedCost,
        )}
        emphasized
      />
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

const inputClassName =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function getCurrentDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset)
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
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