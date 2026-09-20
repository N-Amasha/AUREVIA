import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Info,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function NewVenueBookingPage() {
  const [formData, setFormData] = useState({
    bookingDate: "",
    startTime: "",
    guestCount: "",
    venueType: "",
  });

  const [errors, setErrors] = useState({});
  const [searched, setSearched] = useState(false);

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

    setSearched(false);
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Event date is required.";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required.";
    }

    if (!formData.guestCount) {
      newErrors.guestCount = "Guest count is required.";
    } else if (Number(formData.guestCount) < 1) {
      newErrors.guestCount = "Guest count must be at least 1.";
    }

    if (!formData.venueType) {
      newErrors.venueType = "Please select a venue type.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSearched(true);
  }

  return (
    <div>
      <Link
        to="/customer/reservations"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reservations
      </Link>

      {/* Header */}
      <section className="mt-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500">
          <MapPin className="h-5 w-5 text-primary-950" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Venue Booking
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Find a venue
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Enter your event requirements to search for suitable Aurevia
          venue options.
        </p>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Search Form */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Event requirements
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Provide the basic details needed to identify suitable venues.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-6"
            noValidate
          >
            {/* Event Date */}
            <div>
              <label
                htmlFor="bookingDate"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Event Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                    errors.bookingDate
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />
              </div>

              {errors.bookingDate && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.bookingDate}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Preferred Start Time
              </label>

              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                    errors.startTime
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />
              </div>

              {errors.startTime && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.startTime}
                </p>
              )}
            </div>

            {/* Guest Count */}
            <div>
              <label
                htmlFor="guestCount"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Number of Guests
              </label>

              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min="1"
                  value={formData.guestCount}
                  onChange={handleChange}
                  placeholder="Enter guest count"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                    errors.guestCount
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />
              </div>

              {errors.guestCount && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.guestCount}
                </p>
              )}
            </div>

            {/* Venue Type */}
            <div>
              <label
                htmlFor="venueType"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Venue Type
              </label>

              <select
                id="venueType"
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                  errors.venueType
                    ? "border-red-400 focus:border-red-500"
                    : "border-stone-300 focus:border-primary-600"
                }`}
              >
                <option value="">Select venue type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="celebration">Celebration</option>
                <option value="private">Private Event</option>
              </select>

              {errors.venueType && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.venueType}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4" />
              Check Venue Options
            </Button>
          </form>
        </section>

        {/* Information Panel */}
        <aside className="rounded-2xl bg-primary-950 p-6 text-white sm:p-7">
          <Info className="h-6 w-6 text-gold-400" />

          <h2 className="mt-5 text-lg font-semibold">
            How venue booking works
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-6 text-stone-300">
            <div>
              <span className="font-semibold text-white">01.</span>{" "}
              Enter your event requirements.
            </div>

            <div>
              <span className="font-semibold text-white">02.</span>{" "}
              Aurevia checks suitable venue options and capacity.
            </div>

            <div>
              <span className="font-semibold text-white">03.</span>{" "}
              Review the selected venue and applicable pricing.
            </div>

            <div>
              <span className="font-semibold text-white">04.</span>{" "}
              Continue with the event booking process.
            </div>
          </div>
        </aside>
      </div>

      {/* Search Preview */}
      {searched && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="font-semibold text-primary-950">
            Venue search ready for backend integration
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary-800">
            Your event requirements are valid. Matching venue records,
            capacity, availability and pricing will be retrieved from the
            backend when the venue booking service is connected.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">
                Event Date
              </span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.bookingDate}
              </span>
            </div>

            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">
                Start Time
              </span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.startTime}
              </span>
            </div>

            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">
                Guests
              </span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.guestCount}
              </span>
            </div>

            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">
                Venue Type
              </span>
              <span className="mt-1 block font-medium capitalize text-primary-950">
                {formData.venueType}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}