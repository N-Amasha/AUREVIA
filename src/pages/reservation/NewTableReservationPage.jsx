import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Info,
  Search,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { getAuth } from "../../api/authStorage";
import {
  createTableReservation,
  getAvailableRestaurantTables,
} from "../../api/reservationApi";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to complete the table-reservation request."
  );
}

export default function NewTableReservationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reservationDate: "",
    startTime: "",
    endTime: "",
    numberOfGuests: "",
  });

  const [errors, setErrors] = useState({});
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [reserving, setReserving] = useState(false);
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

    setAvailableTables([]);
    setSelectedTableId("");
    setSearched(false);
    setErrorMessage("");
  }

  function validateForm() {
    const validationErrors = {};

    if (!formData.reservationDate) {
      validationErrors.reservationDate =
        "Reservation date is required.";
    } else if (formData.reservationDate < getToday()) {
      validationErrors.reservationDate =
        "Reservation date cannot be in the past.";
    }

    if (!formData.startTime) {
      validationErrors.startTime =
        "Start time is required.";
    }

    if (!formData.endTime) {
      validationErrors.endTime =
        "End time is required.";
    } else if (
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      validationErrors.endTime =
        "End time must be later than start time.";
    }

    if (!formData.numberOfGuests) {
      validationErrors.numberOfGuests =
        "Number of guests is required.";
    } else if (Number(formData.numberOfGuests) < 1) {
      validationErrors.numberOfGuests =
        "Number of guests must be at least 1.";
    }

    return validationErrors;
  }

  async function handleSearch(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSearching(true);
      setErrorMessage("");
      setSelectedTableId("");

      const tables = await getAvailableRestaurantTables({
        reservationDate: formData.reservationDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        numberOfGuests: Number(
          formData.numberOfGuests,
        ),
      });

      setAvailableTables(tables);
      setSearched(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSearching(false);
    }
  }

  async function handleReservation() {
    if (!selectedTableId) {
      setErrorMessage(
        "Please select a table before confirming the reservation.",
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
      setReserving(true);
      setErrorMessage("");

      const createdReservation =
        await createTableReservation({
          customerId,
          tableId: Number(selectedTableId),
          reservationDate: formData.reservationDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          numberOfGuests: Number(
            formData.numberOfGuests,
          ),
        });

      navigate(
        `/customer/reservations/table/${createdReservation.reservationId}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setReserving(false);
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
          Search for tables that match your schedule and guest count.
        </p>
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Reservation details
          </h2>

          <form
            onSubmit={handleSearch}
            className="mt-7 space-y-6"
            noValidate
          >
            <FormField
              label="Reservation Date"
              error={errors.reservationDate}
            >
              <input
                name="reservationDate"
                type="date"
                min={getToday()}
                value={formData.reservationDate}
                onChange={handleChange}
                className={inputStyles(
                  errors.reservationDate,
                )}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Start Time"
                error={errors.startTime}
              >
                <input
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={inputStyles(errors.startTime)}
                />
              </FormField>

              <FormField
                label="End Time"
                error={errors.endTime}
              >
                <input
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={inputStyles(errors.endTime)}
                />
              </FormField>
            </div>

            <FormField
              label="Number of Guests"
              error={errors.numberOfGuests}
            >
              <input
                name="numberOfGuests"
                type="number"
                min="1"
                value={formData.numberOfGuests}
                onChange={handleChange}
                placeholder="Enter guest count"
                className={inputStyles(
                  errors.numberOfGuests,
                )}
              />
            </FormField>

            <Button
              type="submit"
              disabled={searching}
            >
              <Search className="h-4 w-4" />
              {searching
                ? "Searching..."
                : "Check Availability"}
            </Button>
          </form>
        </section>

        <aside className="rounded-2xl bg-primary-950 p-6 text-white sm:p-7">
          <Info className="h-6 w-6 text-gold-400" />

          <h2 className="mt-5 text-lg font-semibold">
            How table booking works
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-6 text-stone-300">
            <p>1. Enter your date, times and guest count.</p>
            <p>2. Aurevia removes unavailable and overlapping tables.</p>
            <p>3. Select a table with enough capacity.</p>
            <p>4. Confirm the reservation with PENDING status.</p>
          </div>
        </aside>
      </div>

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {searched && availableTables.length === 0 && (
        <section className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <UtensilsCrossed className="mx-auto h-7 w-7 text-stone-400" />

          <h2 className="mt-4 font-semibold text-primary-950">
            No available tables found
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Try another date, time range or guest count.
          </p>
        </section>
      )}

      {availableTables.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-primary-950">
            Available table options
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {availableTables.map((table) => {
              const selected =
                Number(selectedTableId) === table.tableId;

              return (
                <button
                  key={table.tableId}
                  type="button"
                  onClick={() =>
                    setSelectedTableId(
                      String(table.tableId),
                    )
                  }
                  className={`rounded-2xl border p-6 text-left transition ${
                    selected
                      ? "border-primary-700 bg-primary-50"
                      : "border-stone-200 bg-white hover:border-primary-300"
                  }`}
                >
                  <p className="text-lg font-semibold text-primary-950">
                    Table {table.tableNumber}
                  </p>

                  <p className="mt-2 text-sm text-stone-600">
                    {table.location}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-stone-700">
                    <Users className="h-4 w-4" />
                    Capacity: {table.capacity}
                  </div>

                  <p className="mt-4 text-sm font-semibold text-primary-800">
                    {selected
                      ? "Selected"
                      : "Select this table"}
                  </p>
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleReservation}
            disabled={!selectedTableId || reserving}
            className="mt-6"
          >
            <CalendarDays className="h-4 w-4" />
            {reserving
              ? "Creating Reservation..."
              : "Confirm Table Reservation"}
          </Button>
        </section>
      )}
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
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
