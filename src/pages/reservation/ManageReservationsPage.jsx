import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  TableProperties,
  TriangleAlert,
} from "lucide-react";
import {
  getAllEventBookings,
  getAllTableReservations,
} from "../../api/reservationApi";

export default function ManageReservationsPage() {
  const [tableReservations, setTableReservations] =
    useState([]);
  const [venueBookings, setVenueBookings] =
    useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [dateFilter, setDateFilter] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [reservationData, bookingData] =
        await Promise.all([
          getAllTableReservations(),
          getAllEventBookings(),
        ]);

      setTableReservations(
        Array.isArray(reservationData)
          ? reservationData
          : [],
      );

      setVenueBookings(
        Array.isArray(bookingData)
          ? bookingData
          : [],
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load reservation records.",
      );
    } finally {
      setLoading(false);
    }
  }

  const records = useMemo(() => {
    const tables = tableReservations.map(
      (reservation) => ({
        id: `TABLE-${reservation.reservationId}`,
        numericId: reservation.reservationId,
        reference: `RES-${reservation.reservationId}`,
        customerId: reservation.customerId,
        customerName: reservation.customerName,
        type: "TABLE_RESERVATION",
        date: reservation.reservationDate,
        time: `${formatTime(
          reservation.startTime,
        )} – ${formatTime(reservation.endTime)}`,
        status: reservation.reservationStatus,
        resourceName: `Table ${reservation.tableNumber}`,
        resourceLocation:
          reservation.tableLocation,
        guests: reservation.numberOfGuests,
        createdAt: reservation.createdAt,
        actionPath: "/restaurant-manager/tables",
      }),
    );

    const venues = venueBookings.map(
      (booking) => ({
        id: `VENUE-${booking.eventBookingId}`,
        numericId: booking.eventBookingId,
        reference: `VEN-${booking.eventBookingId}`,
        customerId: booking.customerId,
        customerName: booking.customerName,
        type: "VENUE_BOOKING",
        date: booking.bookingDate,
        time: "Full-day booking",
        status: booking.bookingStatus,
        resourceName: booking.venueName,
        resourceLocation: booking.venueLocation,
        guests: booking.guestCount,
        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt,
        actionPath: "/restaurant-manager/venues",
      }),
    );

    return [...tables, ...venues].sort(
      (first, second) => {
        const dateDifference =
          new Date(second.date) -
          new Date(first.date);

        if (dateDifference !== 0) {
          return dateDifference;
        }

        return (
          new Date(second.createdAt || 0) -
          new Date(first.createdAt || 0)
        );
      },
    );
  }, [tableReservations, venueBookings]);

  const statuses = useMemo(
    () =>
      [
        ...new Set(
          records
            .map((record) => record.status)
            .filter(Boolean),
        ),
      ].sort(),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.reference
          .toLowerCase()
          .includes(normalizedSearch) ||
        record.customerName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        record.resourceName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        record.resourceLocation
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesType =
        typeFilter === "ALL" ||
        record.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        record.status === statusFilter;

      const matchesDate =
        !dateFilter || record.date === dateFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    records,
    searchTerm,
    typeFilter,
    statusFilter,
    dateFilter,
  ]);

  const pendingCount = records.filter(
    (record) =>
      record.status?.toUpperCase() === "PENDING",
  ).length;

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Reservation Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Manage reservations
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review customer table reservations and event
            venue bookings from one management workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReservations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

            <div>
              <h2 className="font-semibold text-red-950">
                Unable to load reservation records
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarCheck}
          label="Reservations"
          value={loading ? "…" : records.length}
        />

        <SummaryCard
          icon={TableProperties}
          label="Table Reservations"
          value={
            loading
              ? "…"
              : tableReservations.length
          }
        />

        <SummaryCard
          icon={MapPin}
          label="Venue Bookings"
          value={
            loading ? "…" : venueBookings.length
          }
        />

        <SummaryCard
          icon={Clock}
          label="Pending Requests"
          value={loading ? "…" : pendingCount}
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_200px_200px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search reservation, customer or location"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="ALL">All Types</option>
            <option value="TABLE_RESERVATION">
              Table Reservation
            </option>
            <option value="VENUE_BOOKING">
              Venue Booking
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="ALL">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {(searchTerm ||
          typeFilter !== "ALL" ||
          statusFilter !== "ALL" ||
          dateFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("ALL");
              setStatusFilter("ALL");
              setDateFilter("");
            }}
            className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Reservation records
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                {loading
                  ? "Loading reservation records..."
                  : `${filteredRecords.length} records found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Reference</span>
          <span>Customer</span>
          <span>Type</span>
          <span>Date / Time</span>
          <span>Resource</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading reservation records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarCheck className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No matching reservation records
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No records match the selected filters.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <ReservationRow
              key={record.id}
              record={record}
            />
          ))
        )}
      </section>

      {/* Workflow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Reservation Status Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          A request follows controlled confirmation rules
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Request"
            text="The customer submits a table reservation or venue booking."
          />

          <FlowStep
            number="02"
            title="Validate"
            text="The backend checks capacity, availability and booking conflicts."
          />

          <FlowStep
            number="03"
            title="Payment"
            text="Where required, payment evidence is reviewed through the cashier workflow."
          />

          <FlowStep
            number="04"
            title="Coordinate"
            text="Confirmed venue bookings become available for event coordination."
          />
        </div>
      </section>
    </div>
  );
}

function ReservationRow({ record }) {
  return (
    <div className="grid gap-4 border-b border-stone-100 px-6 py-5 last:border-b-0 xl:grid-cols-7 xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {record.reference}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {record.guests} guests
        </p>
      </div>

      <DataField
        label="Customer"
        value={record.customerName}
      />

      <DataField
        label="Type"
        value={formatLabel(record.type)}
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Date / Time
        </p>

        <p className="text-sm font-medium text-primary-950">
          {formatDate(record.date)}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {record.time}
        </p>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Resource
        </p>

        <p className="text-sm font-medium text-primary-950">
          {record.resourceName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {record.resourceLocation || "—"}
        </p>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
          Status
        </p>

        <StatusBadge status={record.status} />
      </div>

      <div>
        <Link
          to={record.actionPath}
          className="inline-flex rounded-lg border border-primary-200 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
        >
          View Resource
        </Link>
      </div>
    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:hidden">
        {label}
      </p>

      <p className="text-sm font-medium text-primary-950">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() || "UNKNOWN";

  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",
    CONFIRMED:
      "border-blue-200 bg-blue-50 text-blue-700",
    COMPLETED:
      "border-green-200 bg-green-50 text-green-700",
    CANCELLED:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[normalizedStatus] ||
        "border-stone-200 bg-stone-50 text-stone-700"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
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

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2000-01-01T${value}`));
}

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}