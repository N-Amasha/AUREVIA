import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  Filter,
  History,
  MapPin,
  Search,
  UtensilsCrossed,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { getAuth } from "../../api/authStorage";
import {
  getCustomerEventBookings,
  getCustomerTableReservations,
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
    "Unable to load reservation history."
  );
}

function statusStyles(status) {
  const normalizedStatus = status?.toUpperCase();

  if (
    normalizedStatus === "CONFIRMED" ||
    normalizedStatus === "COMPLETED"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "REJECTED"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function ReservationHistoryPage() {
  const [tableReservations, setTableReservations] = useState([]);
  const [venueBookings, setVenueBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReservationHistory() {
      const customerId = getAuth()?.userId;

      if (!customerId) {
        setErrorMessage(
          "Your customer account could not be identified.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const [tables, venues] = await Promise.all([
          getCustomerTableReservations(customerId),
          getCustomerEventBookings(customerId),
        ]);

        setTableReservations(tables);
        setVenueBookings(venues);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadReservationHistory();
  }, []);

  const combinedRecords = useMemo(() => {
    const tables = tableReservations.map((reservation) => ({
      id: reservation.reservationId,
      type: "TABLE",
      title: `Table ${reservation.tableNumber}`,
      location: reservation.tableLocation,
      date: reservation.reservationDate,
      status: reservation.reservationStatus,
      guests: reservation.numberOfGuests,
      time: `${reservation.startTime} - ${reservation.endTime}`,
      detailsPath:
        `/customer/reservations/table/${reservation.reservationId}`,
    }));

    const venues = venueBookings.map((booking) => ({
      id: booking.eventBookingId,
      type: "VENUE",
      title: booking.venueName,
      location: booking.venueLocation,
      date: booking.bookingDate,
      status: booking.bookingStatus,
      guests: booking.guestCount,
      time: null,
      amount: booking.totalAmount,
      detailsPath:
        `/customer/reservations/venue/${booking.eventBookingId}`,
    }));

    return [...tables, ...venues].sort((first, second) =>
      second.date.localeCompare(first.date),
    );
  }, [tableReservations, venueBookings]);

  const statusOptions = useMemo(
    () => [
      ...new Set(
        combinedRecords
          .map((record) => record.status)
          .filter(Boolean),
      ),
    ],
    [combinedRecords],
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return combinedRecords.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.title.toLowerCase().includes(normalizedSearch) ||
        record.location?.toLowerCase().includes(normalizedSearch);

      const matchesType =
        typeFilter === "ALL" || record.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        record.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [
    combinedRecords,
    searchText,
    typeFilter,
    statusFilter,
  ]);

  const today = getToday();

  const upcomingCount = combinedRecords.filter(
    (record) =>
      record.date >= today &&
      record.status?.toUpperCase() !== "CANCELLED",
  ).length;

  const previousCount = combinedRecords.filter(
    (record) => record.date < today,
  ).length;

  return (
    <div>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            My Reservations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Reservation history
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            View your restaurant table reservations and event venue
            bookings.
          </p>
        </div>

        <Link to="/customer/reservations">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            New Reservation
          </Button>
        </Link>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <CalendarCheck className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Upcoming
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">
            {upcomingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <UtensilsCrossed className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Table Reservations
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">
            {tableReservations.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <MapPin className="h-5 w-5 text-gold-600" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Venue Bookings
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">
            {venueBookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <History className="h-5 w-5 text-primary-700" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Previous
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-950">
            {previousCount}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search reservations"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600"
            >
              <option value="ALL">All Types</option>
              <option value="TABLE">Table Reservation</option>
              <option value="VENUE">Venue Booking</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
          >
            <option value="ALL">All Statuses</option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-primary-950">
          Reservation records
        </h2>

        {loading && (
          <p className="mt-6 text-sm text-stone-600">
            Loading reservation history...
          </p>
        )}

        {!loading &&
          !errorMessage &&
          filteredRecords.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-cream-50 px-6 py-12 text-center">
              <CalendarCheck className="mx-auto h-7 w-7 text-primary-700" />

              <h3 className="mt-5 font-semibold text-primary-950">
                No reservation records found
              </h3>

              <p className="mt-2 text-sm text-stone-600">
                Make a new table reservation or venue booking.
              </p>
            </div>
          )}

        {!loading && filteredRecords.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredRecords.map((record) => {
              const Icon =
                record.type === "TABLE"
                  ? UtensilsCrossed
                  : MapPin;

              return (
                <article
                  key={`${record.type}-${record.id}`}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                        <Icon className="h-5 w-5 text-primary-700" />
                      </div>

                      <div>
                        <p className="font-semibold text-primary-950">
                          {record.title}
                        </p>

                        <p className="mt-1 text-sm text-stone-600">
                          {record.date}
                          {record.time
                            ? ` | ${record.time}`
                            : ""}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          {record.location} | {record.guests} guests
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                          record.status,
                        )}`}
                      >
                        {record.status}
                      </span>

                      <Link
                        to={record.detailsPath}
                        className="text-sm font-semibold text-primary-800 hover:text-primary-950"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
