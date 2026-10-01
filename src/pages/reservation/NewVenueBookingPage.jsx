import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Info,
  MapPin,
  Search,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { getAuth } from "../../api/authStorage";
import {
  createEventBooking,
  getAvailableVenues,
} from "../../api/reservationApi";

const venueTypes = [
  "BALLROOM",
  "OUTDOOR",
  "CONFERENCE",
  "TERRACE",
  "BANQUET",
];

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to complete the venue-booking request."
  );
}

export default function NewVenueBookingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingDate: "",
    guestCount: "",
    venueType: "",
  });

  const [errors, setErrors] = useState({});
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] =
    useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    setVenues([]);
    setSelectedVenueId("");
    setSearched(false);
    setErrorMessage("");
  }

  function validateSearch() {
    const validationErrors = {};

    if (!formData.bookingDate) {
      validationErrors.bookingDate =
        "Event date is required.";
    } else if (formData.bookingDate < getToday()) {
      validationErrors.bookingDate =
        "Event date cannot be in the past.";
    }

    if (!formData.guestCount) {
      validationErrors.guestCount =
        "Guest count is required.";
    } else if (Number(formData.guestCount) < 1) {
      validationErrors.guestCount =
        "Guest count must be at least 1.";
    }

    if (!formData.venueType) {
      validationErrors.venueType =
        "Please select a venue type.";
    }

    return validationErrors;
  }

  async function handleSearch(event) {
    event.preventDefault();

    const validationErrors = validateSearch();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSearching(true);
      setErrorMessage("");
      setSelectedVenueId("");

      const availableVenues = await getAvailableVenues({
        minimumCapacity: Number(formData.guestCount),
      });

      const matchingVenues = availableVenues.filter(
        (venue) =>
          venue.venueType.toUpperCase() ===
          formData.venueType,
      );

      setVenues(matchingVenues);
      setSearched(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSearching(false);
    }
  }

  async function handleBooking() {
    if (!selectedVenueId) {
      setErrorMessage(
        "Please select a venue before confirming the booking.",
      );
      return;
    }

    const customerId = getAuth()?.userId;

    if (!customerId) {
      setErrorMessage(
        "Your customer account could not be identified.",
      );
      return;
    }

    try {
      setBooking(true);
      setErrorMessage("");

      const createdBooking = await createEventBooking({
        customerId,
        venueId: Number(selectedVenueId),
        bookingDate: formData.bookingDate,
        guestCount: Number(formData.guestCount),
      });

      navigate(
        `/customer/reservations/venue/${createdBooking.eventBookingId}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setBooking(false);
    }
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
          Search available venues by event date, guest capacity and venue
          type.
        </p>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Event requirements
          </h2>

          <form
            onSubmit={handleSearch}
            className="mt-7 space-y-6"
            noValidate
          >
            <FormField
              label="Event Date"
              error={errors.bookingDate}
            >
              <input
                id="bookingDate"
                name="bookingDate"
                type="date"
                min={getToday()}
                value={formData.bookingDate}
                onChange={handleChange}
                className={inputStyles(errors.bookingDate)}
              />
            </FormField>

            <FormField
              label="Number of Guests"
              error={errors.guestCount}
            >
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={handleChange}
                placeholder="Enter guest count"
                className={inputStyles(errors.guestCount)}
              />
            </FormField>

            <FormField
              label="Venue Type"
              error={errors.venueType}
            >
              <select
                id="venueType"
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                className={inputStyles(errors.venueType)}
              >
                <option value="">Select venue type</option>

                {venueTypes.map((venueType) => (
                  <option
                    key={venueType}
                    value={venueType}
                  >
                    {venueType.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </FormField>

            <Button
              type="submit"
              disabled={searching}
            >
              <Search className="h-4 w-4" />
              {searching
                ? "Searching..."
                : "Check Venue Options"}
            </Button>
          </form>
        </section>

        <aside className="rounded-2xl bg-primary-950 p-6 text-white sm:p-7">
          <Info className="h-6 w-6 text-gold-400" />

          <h2 className="mt-5 text-lg font-semibold">
            How venue booking works
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-6 text-stone-300">
            <p>1. Enter the event requirements.</p>
            <p>2. Select a matching available venue.</p>
            <p>3. Aurevia checks date conflicts and pricing.</p>
            <p>4. The booking is created with PENDING status.</p>
          </div>
        </aside>
      </div>

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {searched && venues.length === 0 && (
        <section className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <Building2 className="mx-auto h-7 w-7 text-stone-400" />

          <h2 className="mt-4 font-semibold text-primary-950">
            No matching venues found
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Try another venue type or reduce the guest count.
          </p>
        </section>
      )}

      {venues.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Available venue options
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {venues.map((venue) => {
              const selected =
                Number(selectedVenueId) === venue.venueId;

              return (
                <button
                  key={venue.venueId}
                  type="button"
                  onClick={() =>
                    setSelectedVenueId(
                      String(venue.venueId),
                    )
                  }
                  className={`rounded-2xl border p-6 text-left transition ${
                    selected
                      ? "border-primary-700 bg-primary-50"
                      : "border-stone-200 bg-white hover:border-primary-300"
                  }`}
                >
                  <p className="text-lg font-semibold text-primary-950">
                    {venue.venueName}
                  </p>

                  <p className="mt-2 text-sm text-stone-600">
                    {venue.location}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-700">
                    <span>Capacity: {venue.capacity}</span>
                    <span>
                      {formatCurrency(venue.basePrice)}
                    </span>
                  </div>

                  {venue.features?.length > 0 && (
                    <p className="mt-4 text-xs text-stone-500">
                      {venue.features.join(" | ")}
                    </p>
                  )}

                  <p className="mt-4 text-sm font-semibold text-primary-800">
                    {selected
                      ? "Selected"
                      : "Select this venue"}
                  </p>
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleBooking}
            disabled={!selectedVenueId || booking}
            className="mt-6"
          >
            <CalendarDays className="h-4 w-4" />
            {booking
              ? "Creating Booking..."
              : "Confirm Venue Booking"}
          </Button>
        </section>
      )}
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-stone-700"
      >
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputStyles(error) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-stone-300 focus:border-primary-600"
  }`;
}
