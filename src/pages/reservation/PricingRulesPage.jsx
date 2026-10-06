/* oxlint-disable react/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Percent,
  Plus,
  Search,
  Tags,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { getAllVenues } from "../../api/reservationApi";
import {
  createPricingRule,
  deletePricingRule,
  getAllPricingRules,
  updatePricingRule,
} from "../../api/pricingApi";

const EMPTY_FORM = {
  venueId: "",
  ruleName: "",
  startDate: "",
  endDate: "",
  surcharge: "",
  price: "",
  approvalStatus: "PENDING",
};

export default function PricingRulesPage() {
  const [pricingRules, setPricingRules] = useState([]);
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingRuleId, setEditingRuleId] =
    useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [ruleData, venueData] =
        await Promise.all([
          getAllPricingRules(),
          getAllVenues(),
        ]);

      setPricingRules(
        Array.isArray(ruleData) ? ruleData : [],
      );

      setVenues(
        Array.isArray(venueData) ? venueData : [],
      );
    } catch (loadError) {
      setError(
        getErrorMessage(
          loadError,
          "Unable to load pricing rules.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRules = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return pricingRules.filter((rule) => {
      const matchesSearch =
        !normalizedSearch ||
        rule.ruleName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        rule.venueName
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesVenue =
        !venueFilter ||
        String(rule.venueId) === venueFilter;

      const matchesStatus =
        !statusFilter ||
        rule.approvalStatus === statusFilter;

      return (
        matchesSearch &&
        matchesVenue &&
        matchesStatus
      );
    });
  }, [
    pricingRules,
    searchTerm,
    venueFilter,
    statusFilter,
  ]);

  const approvedCount = pricingRules.filter(
    (rule) =>
      rule.approvalStatus === "APPROVED",
  ).length;

  const pendingCount = pricingRules.filter(
    (rule) =>
      rule.approvalStatus === "PENDING",
  ).length;

  const totalSurcharge = pricingRules.reduce(
    (total, rule) =>
      total + Number(rule.surcharge || 0),
    0,
  );

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingRuleId(null);
    setFormData(EMPTY_FORM);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(rule) {
    setEditingRuleId(rule.pricingRuleId);

    setFormData({
      venueId: String(rule.venueId),
      ruleName: rule.ruleName || "",
      startDate: rule.startDate || "",
      endDate: rule.endDate || "",
      surcharge: String(rule.surcharge ?? ""),
      price: String(rule.price ?? ""),
      approvalStatus:
        rule.approvalStatus || "PENDING",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setEditingRuleId(null);
    setFormData(EMPTY_FORM);
    setShowForm(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.venueId ||
      !formData.ruleName.trim() ||
      !formData.startDate ||
      !formData.endDate ||
      formData.surcharge === "" ||
      formData.price === ""
    ) {
      setError("Complete all pricing rule fields.");
      return;
    }

    if (
      formData.endDate < formData.startDate
    ) {
      setError(
        "End date cannot be before start date.",
      );
      return;
    }

    const payload = {
      venueId: Number(formData.venueId),
      ruleName: formData.ruleName.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      surcharge: Number(formData.surcharge),
      price: Number(formData.price),
      approvalStatus:
        formData.approvalStatus,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingRuleId) {
        await updatePricingRule(
          editingRuleId,
          payload,
        );

        setMessage(
          "Pricing rule updated successfully.",
        );
      } else {
        await createPricingRule(payload);

        setMessage(
          "Pricing rule created successfully.",
        );
      }

      closeForm();
      await loadData();
    } catch (saveError) {
      setError(
        getErrorMessage(
          saveError,
          "Unable to save pricing rule.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(rule) {
    const confirmed = window.confirm(
      `Delete pricing rule "${rule.ruleName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deletePricingRule(
        rule.pricingRuleId,
      );

      setMessage(
        "Pricing rule deleted successfully.",
      );

      await loadData();
    } catch (deleteError) {
      setError(
        getErrorMessage(
          deleteError,
          "Unable to delete pricing rule.",
        ),
      );
    }
  }

  return (
    <div>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Reservation Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Pricing rules
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage venue pricing rules,
            seasonal prices, surcharges and
            approval statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Add Pricing Rule
        </button>
      </section>

      {message && (
        <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          {message}
        </section>
      )}

      {error && (
        <section className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </section>
      )}

      {showForm && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-primary-950">
                {editingRuleId
                  ? "Edit pricing rule"
                  : "Add pricing rule"}
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Enter the venue, pricing period
                and approval information.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-primary-900"
              aria-label="Close pricing rule form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-5 md:grid-cols-2"
          >
            <FormField label="Venue">
              <select
                name="venueId"
                value={formData.venueId}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
              >
                <option value="">
                  Select venue
                </option>

                {venues.map((venue) => (
                  <option
                    key={venue.venueId}
                    value={venue.venueId}
                  >
                    {venue.venueName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Rule Name">
              <input
                type="text"
                name="ruleName"
                value={formData.ruleName}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
                placeholder="Example: Holiday Rate"
              />
            </FormField>

            <FormField label="Start Date">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
              />
            </FormField>

            <FormField label="End Date">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
              />
            </FormField>

            <FormField label="Surcharge (LKR)">
              <input
                type="number"
                name="surcharge"
                value={formData.surcharge}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Final Price (LKR)">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Approval Status">
              <select
                name="approvalStatus"
                value={
                  formData.approvalStatus
                }
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </FormField>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingRuleId
                    ? "Save Changes"
                    : "Create Rule"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Tags}
          label="Pricing Rules"
          value={pricingRules.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Approved Rules"
          value={approvedCount}
        />

        <SummaryCard
          icon={TriangleAlert}
          label="Pending Approval"
          value={pendingCount}
        />

        <SummaryCard
          icon={Percent}
          label="Total Surcharges"
          value={formatCurrency(totalSurcharge)}
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
              placeholder="Search rule or venue"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500"
            />
          </div>

          <select
            value={venueFilter}
            onChange={(event) =>
              setVenueFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
          >
            <option value="">All Venues</option>

            {venues.map((venue) => (
              <option
                key={venue.venueId}
                value={venue.venueId}
              >
                {venue.venueName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">
              Pending
            </option>
            <option value="APPROVED">
              Approved
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Tags className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Reservation pricing rules
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Showing {filteredRules.length} of{" "}
                {pricingRules.length} pricing rules.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading pricing rules...
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Tags className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No pricing rules found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No pricing rules match the selected
              filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredRules.map((rule) => (
              <PricingRuleRow
                key={rule.pricingRuleId}
                rule={rule}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Pricing Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Approved rules support consistent
          venue pricing
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Configure"
            text="Create a pricing rule for a selected venue and period."
          />

          <FlowStep
            number="02"
            title="Review"
            text="Review the price, surcharge and effective dates."
          />

          <FlowStep
            number="03"
            title="Approve"
            text="Mark the rule approved before it is used for bookings."
          />

          <FlowStep
            number="04"
            title="Calculate"
            text="The backend applies approved rules during venue booking."
          />
        </div>
      </section>
    </div>
  );
}

function PricingRuleRow({
  rule,
  onEdit,
  onDelete,
}) {
  return (
    <article className="grid gap-5 px-6 py-5 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto] xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {rule.ruleName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          Rule #{rule.pricingRuleId}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Venue
        </p>

        <p className="mt-1 text-sm font-medium text-primary-950">
          {rule.venueName}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Pricing
        </p>

        <p className="mt-1 text-sm font-semibold text-primary-950">
          {formatCurrency(rule.price)}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          Surcharge:{" "}
          {formatCurrency(rule.surcharge)}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-primary-950">
          {formatDate(rule.startDate)}
          {" â€“ "}
          {formatDate(rule.endDate)}
        </p>

        <span
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
            rule.approvalStatus,
          )}`}
        >
          {formatLabel(rule.approvalStatus)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(rule)}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(rule)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-primary-950">
        {label}
      </span>

      {children}
    </label>
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) {
    return "â€”";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function getStatusClasses(status) {
  if (status === "APPROVED") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "REJECTED") {
    return "bg-red-100 text-red-800";
  }

  return "bg-amber-100 text-amber-800";
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}
