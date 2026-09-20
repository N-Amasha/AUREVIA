import { useState } from "react";
import {
  CalendarDays,
  Info,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

export default function StaffAllocationPage() {
  const [formData, setFormData] = useState({
    operationType: "",
    expectedGuests: "",
    servicePeriod: "",
  });

  const [errors, setErrors] = useState({});
  const [previewReady, setPreviewReady] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setPreviewReady(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.operationType) {
      newErrors.operationType = "Select an operation type.";
    }

    if (!formData.expectedGuests) {
      newErrors.expectedGuests = "Enter the expected guest count.";
    } else if (Number(formData.expectedGuests) < 1) {
      newErrors.expectedGuests =
        "Expected guest count must be at least 1.";
    }

    if (!formData.servicePeriod) {
      newErrors.servicePeriod = "Select a service period.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setPreviewReady(true);
    }
  }

  function clearForm() {
    setFormData({
      operationType: "",
      expectedGuests: "",
      servicePeriod: "",
    });

    setErrors({});
    setPreviewReady(false);
  }

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Staff Management & Allocation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Staff allocation recommendations
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Prepare staffing recommendations using operational demand while
          considering workforce availability and scheduling constraints.
        </p>
      </section>

      {/* Important Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Recommendation engine not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              The current page prepares the frontend workflow only. Future
              backend logic can use booking demand, event demand, shifts and
              employee availability to generate explainable staffing
              recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Sparkles}
          label="Recommendations"
        />

        <SummaryCard
          icon={Users}
          label="Available Staff"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Demand Periods"
        />
      </section>

      {/* Recommendation Form */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <WandSparkles className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Prepare allocation recommendation
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Enter basic operational demand information to prepare the
              recommendation workflow.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Operation Type */}
            <div>
              <label
                htmlFor="operationType"
                className="text-sm font-semibold text-primary-950"
              >
                Operation Type
              </label>

              <select
                id="operationType"
                name="operationType"
                value={formData.operationType}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
              >
                <option value="">
                  Select operation type
                </option>

                <option value="restaurant">
                  Restaurant Service
                </option>

                <option value="event">
                  Event
                </option>
              </select>

              {errors.operationType && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.operationType}
                </p>
              )}
            </div>

            {/* Guest Count */}
            <div>
              <label
                htmlFor="expectedGuests"
                className="text-sm font-semibold text-primary-950"
              >
                Expected Guests
              </label>

              <input
                id="expectedGuests"
                name="expectedGuests"
                type="number"
                min="1"
                value={formData.expectedGuests}
                onChange={handleChange}
                placeholder="Enter guest count"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
              />

              {errors.expectedGuests && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.expectedGuests}
                </p>
              )}
            </div>

            {/* Service Period */}
            <div>
              <label
                htmlFor="servicePeriod"
                className="text-sm font-semibold text-primary-950"
              >
                Service Period
              </label>

              <select
                id="servicePeriod"
                name="servicePeriod"
                value={formData.servicePeriod}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
              >
                <option value="">
                  Select service period
                </option>

                <option value="morning">
                  Morning
                </option>

                <option value="afternoon">
                  Afternoon
                </option>

                <option value="evening">
                  Evening
                </option>
              </select>

              {errors.servicePeriod && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.servicePeriod}
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              <Sparkles className="h-4 w-4" />
              Prepare Recommendation
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* Preview */}
      {previewReady && (
        <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 text-gold-600" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Recommendation request prepared
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-700">
                The input is valid, but no staffing recommendation has been
                generated because the backend recommendation logic and real
                workforce data are not connected yet.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <PreviewItem
              label="Operation"
              value={
                formData.operationType === "restaurant"
                  ? "Restaurant Service"
                  : "Event"
              }
            />

            <PreviewItem
              label="Expected Guests"
              value={formData.expectedGuests}
            />

            <PreviewItem
              label="Service Period"
              value={
                formData.servicePeriod.charAt(0).toUpperCase() +
                formData.servicePeriod.slice(1)
              }
            />
          </div>

          <div className="mt-6 rounded-xl bg-white p-5">
            <p className="text-sm font-semibold text-primary-950">
              Recommended staffing
            </p>

            <p className="mt-2 text-2xl font-bold text-primary-950">
              —
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              A recommendation will be generated only after operational
              demand and workforce availability are processed by the
              backend.
            </p>
          </div>
        </section>
      )}

      {/* Future Inputs */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-primary-950">
          Future recommendation inputs
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          The final recommendation should use connected Aurevia data rather
          than relying only on manually entered guest counts.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InputSource
            number="01"
            title="Reservations"
            text="Expected restaurant demand from confirmed bookings."
          />

          <InputSource
            number="02"
            title="Events"
            text="Expected demand created by scheduled events."
          />

          <InputSource
            number="03"
            title="Staff Availability"
            text="Available employees after considering shifts and approved leave."
          />

          <InputSource
            number="04"
            title="Staff Roles"
            text="Suitable staff roles required for different operational needs."
          />
        </div>
      </section>

      {/* Explainable Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Explainable Allocation Logic
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Demand supports a recommendation — not an automatic decision
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-5">
          <FlowStep
            number="01"
            title="Read Demand"
            text="Review restaurant reservations and scheduled event demand."
          />

          <FlowStep
            number="02"
            title="Estimate Need"
            text="Determine staffing requirements using defined business rules."
          />

          <FlowStep
            number="03"
            title="Check Availability"
            text="Consider shifts, assignments and approved leave."
          />

          <FlowStep
            number="04"
            title="Recommend"
            text="Present suitable staffing suggestions with an understandable reason."
          />

          <FlowStep
            number="05"
            title="Manager Decision"
            text="The authorized manager reviews the recommendation before scheduling staff."
          />
        </div>
      </section>

      {/* Safety / Decision Note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Recommendation vs automatic allocation
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Aurevia's allocation feature should support the manager's
          scheduling decision. A recommendation does not automatically
          create a shift or assign an employee. Final scheduling actions
          remain separate controlled operations.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function InputSource({ number, title, text }) {
  return (
    <div className="rounded-xl bg-stone-50 p-5">
      <p className="text-sm font-bold text-gold-600">
        {number}
      </p>

      <h3 className="mt-2 font-semibold text-primary-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-600">
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