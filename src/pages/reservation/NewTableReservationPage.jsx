import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Info,
  Search,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function NewTableReservationPage() {
  const [formData, setFormData] = useState({
    reservationDate: "",
    startTime: "",
    numberOfGuests: "",
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

    if (!formData.reservationDate) {
      newErrors.reservationDate = "Reservation date is required.";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Reservation time is required.";
    }

    if (!formData.numberOfGuests) {
      newErrors.numberOfGuests = "Number of guests is required.";
    } else if (Number(formData.numberOfGuests) < 1) {
      newErrors.numberOfGuests =
        "Number of guests must be at least 1.";
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
      {/* Back */}
      <Link
        to="/customer/reservations"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reservations
      </Link>

      {/* Header */}
      <section className="mt-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
          <UtensilsCrossed className="h-5 w-5 text-white" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Table Reservation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Find a table
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Choose your preferred date, time and number of guests to check
          suitable restaurant table options.
        </p>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Reservation Search */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Reservation details
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Enter your dining requirements before checking availability.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-6"
            noValidate
          >
            {/* Date */}
            <div>
              <label
                htmlFor="reservationDate"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Reservation Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="reservationDate"
                  name="reservationDate"
                  type="date"
                  value={formData.reservationDate}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                    errors.reservationDate
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />
              </div>

              {errors.reservationDate && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.reservationDate}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Preferred Time
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

            {/* Guests */}
            <div>
              <label
                htmlFor="numberOfGuests"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Number of Guests
              </label>

              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min="1"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  placeholder="Enter guest count"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                    errors.numberOfGuests
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />
              </div>

              {errors.numberOfGuests && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.numberOfGuests}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4" />
              Check Availability
            </Button>
          </form>
        </section>

        {/* Information */}
        <aside className="rounded-2xl bg-primary-950 p-6 text-white sm:p-7">
          <Info className="h-6 w-6 text-gold-400" />

          <h2 className="mt-5 text-lg font-semibold">
            How table booking works
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-6 text-stone-300">
            <div>
              <span className="font-semibold text-white">01.</span>{" "}
              Enter your preferred date, time and guest count.
            </div>

            <div>
              <span className="font-semibold text-white">02.</span>{" "}
              Aurevia checks suitable tables against reservation data.
            </div>

            <div>
              <span className="font-semibold text-white">03.</span>{" "}
              Select an available table and review applicable pricing.
            </div>

            <div>
              <span className="font-semibold text-white">04.</span>{" "}
              Review and confirm your reservation.
            </div>
          </div>
        </aside>
      </div>

      {/* Availability Result */}
      {searched && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="font-semibold text-primary-950">
            Availability check ready for backend integration
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary-800">
            Your reservation criteria are valid. Available restaurant
            tables will be displayed here when the reservation service
            and database are connected.
          </p>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">Date</span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.reservationDate}
              </span>
            </div>

            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">Time</span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.startTime}
              </span>
            </div>

            <div className="rounded-xl bg-white p-4">
              <span className="block text-xs text-stone-500">Guests</span>
              <span className="mt-1 block font-medium text-primary-950">
                {formData.numberOfGuests}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}