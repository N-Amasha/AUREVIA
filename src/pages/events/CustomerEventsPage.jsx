import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  MapPin,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { getAuth } from "../../api/authStorage";
import {
  cancelEventBooking,
  getCustomerEventBookings,
  updateEventBooking,
} from "../../api/reservationApi";
import Button from "../../components/ui/Button";

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
  }).format(Number(amount ?? 0));
}

function formatStatus(status) {
  return status?.replaceAll("_", " ") ?? "UNKNOWN";
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to complete the event-booking request."
  );
}

export default function CustomerEventsPage() {
  const customerId = getAuth()?.userId;

  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    bookingDate: "",
    guestCount: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] =
    useState(null);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    async function loadBookings() {
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

        const records =
          await getCustomerEventBookings(customerId);

        setBookings(records);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [customerId]);

  const filteredBookings = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.venueName?.toLowerCase().includes(query) ||
        booking.venueLocation
          ?.toLowerCase()
          .includes(query) ||
        `ven-${booking.eventBookingId}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        booking.bookingStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchText, statusFilter]);

  const pendingCount = bookings.filter(
    (booking) => booking.bookingStatus === "PENDING",
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.bookingStatus === "CONFIRMED",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.bookingStatus === "CANCELLED",
  ).length;

  function beginEdit(booking) {
    setEditingId(booking.eventBookingId);
    setEditData({
      bookingDate: booking.bookingDate,
      guestCount: String(booking.guestCount),
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  function stopEditing() {
    setEditingId(null);
    setEditData({
      bookingDate: "",
      guestCount: "",
    });
  }

  async function handleUpdate(booking) {
    if (!editData.bookingDate) {
      setErrorMessage("Event date is required.");
      return;
    }

    if (editData.bookingDate < getToday()) {
      setErrorMessage(
        "Event date cannot be in the past.",
      );
      return;
    }

    if (Number(editData.guestCount) < 1) {
      setErrorMessage(
        "Guest count must be greater than zero.",
      );
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedBooking = await updateEventBooking(
        booking.eventBookingId,
        {
          venueId: booking.venueId,
          bookingDate: editData.bookingDate,
          guestCount: Number(editData.guestCount),
        },
      );

      setBookings((current) =>
        current.map((record) =>
          record.eventBookingId ===
          updatedBooking.eventBookingId
            ? updatedBooking
            : record,
        ),
      );

      stopEditing();
      setSuccessMessage(
        `VEN-${updatedBooking.eventBookingId} was updated successfully.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(booking) {
    const confirmed = window.confirm(
      `Cancel event booking VEN-${booking.eventBookingId}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(booking.eventBookingId);
      setErrorMessage("");
      setSuccessMessage("");

      const cancelledBooking =
        await cancelEventBooking(
          booking.eventBookingId,
        );

      setBookings((current) =>
        current.map((record) =>
          record.eventBookingId ===
          cancelledBooking.eventBookingId
            ? cancelledBooking
            : record,
        ),
      );

      if (editingId === booking.eventBookingId) {
        stopEditing();
      }

      setSuccessMessage(
        `VEN-${cancelledBooking.eventBookingId} was cancelled successfully.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Event Coordination
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            My events
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Create venue bookings, review their progress,
            update pending bookings and cancel them when
            necessary.
          </p>
        </div>

        <Link to="/customer/reservations/venue/new">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            Plan New Event
          </Button>
        </Link>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Pending"
          value={pendingCount}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Confirmed"
          value={confirmedCount}
        />

        <SummaryCard
          icon={Trash2}
          label="Cancelled"
          value={cancelledCount}
        />
      </section>

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search venue or booking reference"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Event booking records
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            {filteredBookings.length} booking
            {filteredBookings.length === 1 ? "" : "s"} found.
          </p>
        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-stone-600">
            Loading event bookings...
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No event bookings found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              Create a venue booking to begin planning an
              event.
            </p>
          </div>
        )}

        {!loading &&
          filteredBookings.map((booking) => {
            const isEditing =
              editingId === booking.eventBookingId;
            const isPending =
              booking.bookingStatus === "PENDING";

            return (
              <article
                key={booking.eventBookingId}
                className="border-b border-stone-200 p-6 last:border-b-0"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-primary-950">
                        VEN-{booking.eventBookingId}
                      </h3>

                      <StatusBadge
                        status={booking.bookingStatus}
                      />
                    </div>

                    <p className="mt-3 font-medium text-stone-800">
                      {booking.venueName}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                      <MapPin className="h-4 w-4" />
                      {booking.venueLocation}
                    </p>

                    {!isEditing && (
                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <Detail
                          label="Event Date"
                          value={booking.bookingDate}
                        />

                        <Detail
                          label="Guests"
                          value={booking.guestCount}
                        />

                        <Detail
                          label="Total"
                          value={formatCurrency(
                            booking.totalAmount,
                          )}
                        />
                      </div>
                    )}

                    {isEditing && (
                      <div className="mt-5 grid gap-4 rounded-xl bg-cream-50 p-5 sm:grid-cols-2">
                        <label className="text-sm font-medium text-stone-700">
                          Event Date
                          <input
                            type="date"
                            min={getToday()}
                            value={editData.bookingDate}
                            onChange={(event) =>
                              setEditData((current) => ({
                                ...current,
                                bookingDate:
                                  event.target.value,
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
                          />
                        </label>

                        <label className="text-sm font-medium text-stone-700">
                          Guest Count
                          <input
                            type="number"
                            min="1"
                            value={editData.guestCount}
                            onChange={(event) =>
                              setEditData((current) => ({
                                ...current,
                                guestCount:
                                  event.target.value,
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                    <Link
                      to={`/customer/reservations/venue/${booking.eventBookingId}`}
                      className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-primary-400 hover:text-primary-900"
                    >
                      View
                    </Link>

                    {isPending && !isEditing && (
                      <button
                        type="button"
                        onClick={() => beginEdit(booking)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    )}

                    {isPending && !isEditing && (
                      <button
                        type="button"
                        disabled={
                          cancellingId ===
                          booking.eventBookingId
                        }
                        onClick={() =>
                          handleCancel(booking)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        {cancellingId ===
                        booking.eventBookingId
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}

                    {isEditing && (
                      <>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            handleUpdate(booking)
                          }
                          className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={stopEditing}
                          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700"
                        >
                          <X className="h-4 w-4" />
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
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

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-primary-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}