import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  ReceiptText,
  Users,
} from "lucide-react";

import { getAuth } from "../../api/authStorage";
import {
  getEventBookingById,
} from "../../api/reservationApi";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to load the venue booking."
  );
}

function getStatusStyles(status) {
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

function formatCurrency(amount) {
  if (amount === null || amount === undefined) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function VenueBookingDetailsPage() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true);
        setErrorMessage("");

        const bookingData =
          await getEventBookingById(bookingId);

        const loggedInCustomerId = getAuth()?.userId;

        if (bookingData.customerId !== loggedInCustomerId) {
          setErrorMessage(
            "You are not allowed to view this venue booking.",
          );
          return;
        }

        setBooking(bookingData);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  return (
    <div>
      <Link
        to="/customer/reservations/history"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reservation history
      </Link>

      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Booking Details
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Event venue booking
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review your selected venue, event date, guest information,
          total amount and booking status.
        </p>
      </section>

      {loading && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-600">
            Loading venue-booking details...
          </p>
        </section>
      )}

      {!loading && errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Venue booking could not be displayed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      {!loading && booking && (
        <>
          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Booking Reference
                </p>

                <p className="mt-2 text-lg font-semibold text-primary-950">
                  VEN-{booking.eventBookingId}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                    booking.bookingStatus,
                  )}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-primary-950">
                Venue booking information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Information retrieved from the Aurevia event-booking
                service.
              </p>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <DetailField
                icon={Building2}
                label="Venue"
                value={booking.venueName}
              />

              <DetailField
                icon={MapPin}
                label="Venue Location"
                value={booking.venueLocation}
              />

              <DetailField
                icon={CalendarDays}
                label="Event Date"
                value={booking.bookingDate}
              />

              <DetailField
                icon={Users}
                label="Expected Guests"
                value={booking.guestCount}
              />

              <DetailField
                icon={ReceiptText}
                label="Total Amount"
                value={formatCurrency(booking.totalAmount)}
              />

              <DetailField
                icon={Users}
                label="Customer"
                value={booking.customerName}
              />
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Event Coordination
            </p>

            <h2 className="mt-2 text-lg font-semibold text-primary-950">
              Booking and event coordination
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              Event timelines, vendor services and coordination
              activities are available through the My Events section.
            </p>

            <Link
              to="/customer/events"
              className="mt-5 inline-flex rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              View My Events
            </Link>
          </section>

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Billing
            </p>

            <h2 className="mt-2 text-lg font-semibold text-primary-950">
              Payment and confirmation
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              Related invoice and payment information is handled through
              the Billing & Payments module.
            </p>

            <Link
              to="/customer/billing"
              className="mt-5 inline-flex rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              View Billing & Payments
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

function DetailField({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-700" />

        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </p>
      </div>

      <p className="mt-3 text-sm font-semibold text-primary-950">
        {value ?? "Not available"}
      </p>
    </div>
  );
}
