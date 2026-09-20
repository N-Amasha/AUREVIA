import { useState } from "react";
import {
  Info,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

export default function WasteRecordsPage() {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    itemReference: "",
    quantity: "",
    wasteDate: "",
    reason: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [previewReady, setPreviewReady] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setPreviewReady(false);
  }

  function handlePreview(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.itemReference.trim()) {
      newErrors.itemReference = "Inventory item reference is required.";
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Enter a quantity greater than 0.";
    }

    if (!formData.wasteDate) {
      newErrors.wasteDate = "Waste date is required.";
    }

    if (!formData.reason) {
      newErrors.reason = "Waste reason is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setPreviewReady(false);
      return;
    }

    setPreviewReady(true);
  }

  function closeForm() {
    setShowForm(false);
    setPreviewReady(false);
    setErrors({});
  }

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Inventory & Food Waste Management
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Food waste records
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Record and review wasted inventory items to support food waste
            monitoring and future analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setPreviewReady(false);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Record Waste
        </button>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Waste records are not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              The Record Waste form currently validates and previews
              frontend data only. It does not save a waste record or change
              inventory quantities.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Waste Records" />
        <SummaryCard label="Items Affected" />
        <SummaryCard label="Waste This Period" />
      </section>

      {/* Waste Form */}
      {showForm && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
                New Waste Record
              </p>

              <h2 className="mt-2 text-xl font-semibold text-primary-950">
                Record food waste
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                Enter the waste information below. Inventory item selection
                will come from backend inventory records later.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-primary-950"
              aria-label="Close waste form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handlePreview}
            className="mt-7 grid gap-6 md:grid-cols-2"
          >
            <Field
              label="Inventory Item Reference"
              error={errors.itemReference}
            >
              <input
                type="text"
                name="itemReference"
                value={formData.itemReference}
                onChange={handleChange}
                placeholder="Temporary item reference"
                className={inputClass(errors.itemReference)}
              />
            </Field>

            <Field
              label="Waste Quantity"
              error={errors.quantity}
            >
              <input
                type="number"
                name="quantity"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className={inputClass(errors.quantity)}
              />
            </Field>

            <Field
              label="Waste Date"
              error={errors.wasteDate}
            >
              <input
                type="date"
                name="wasteDate"
                value={formData.wasteDate}
                onChange={handleChange}
                className={inputClass(errors.wasteDate)}
              />
            </Field>

            <Field
              label="Waste Reason"
              error={errors.reason}
            >
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={inputClass(errors.reason)}
              >
                <option value="">Select a reason</option>
                <option value="Spoilage">Spoilage</option>
                <option value="Expired">Expired</option>
                <option value="Preparation Waste">
                  Preparation Waste
                </option>
                <option value="Damaged">Damaged</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Notes">
                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional additional information"
                  className={`${inputClass()} resize-none`}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
              >
                Preview Waste Record
              </button>
            </div>
          </form>

          {/* Preview */}
          {previewReady && (
            <div className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6">
              <h3 className="font-semibold text-primary-950">
                Waste record preview
              </h3>

              <p className="mt-1 text-sm text-primary-800">
                Validation passed. This record has not been saved.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <PreviewItem
                  label="Item Reference"
                  value={formData.itemReference}
                />

                <PreviewItem
                  label="Quantity"
                  value={formData.quantity}
                />

                <PreviewItem
                  label="Date"
                  value={formData.wasteDate}
                />

                <PreviewItem
                  label="Reason"
                  value={formData.reason}
                />
              </div>

              {formData.notes.trim() && (
                <div className="mt-5">
                  <PreviewItem
                    label="Notes"
                    value={formData.notes}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search waste records"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Waste Reasons</option>
          </select>

          <input
            type="date"
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          />
        </div>
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <Trash2 className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Waste history
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Recorded food waste will appear here after backend
                integration.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Record</span>
          <span>Item</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span>Reason</span>
          <span>Date</span>
          <span>Recorded By</span>
        </div>

        <div className="px-6 py-14 text-center">
          <Trash2 className="mx-auto h-7 w-7 text-stone-400" />

          <h3 className="mt-4 font-semibold text-primary-950">
            No waste records available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Stored food waste records will appear here once the backend is
            connected.
          </p>
        </div>
      </section>

      {/* Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Waste Monitoring
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Why Aurevia records waste separately
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <FlowStep
            number="01"
            title="Record"
            text="Capture the affected inventory item, quantity, date and reason."
          />

          <FlowStep
            number="02"
            title="Analyze"
            text="Stored waste records can later be summarized to identify waste patterns."
          />

          <FlowStep
            number="03"
            title="Improve"
            text="Waste information can support better inventory and purchasing decisions."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Trash2 className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-stone-700">
        {label}
      </label>

      <div className="mt-2">
        {children}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-primary-950">
        {value || "—"}
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

function inputClass(error = "") {
  return [
    "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition",
    error
      ? "border-red-300 focus:border-red-500"
      : "border-stone-300 focus:border-primary-500",
  ].join(" ");
}