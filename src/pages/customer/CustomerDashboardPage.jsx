/* oxlint-disable react/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarDays,
  CreditCard,
  FileText,
  MapPin,
  MessageSquareHeart,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";

import { getAuth } from "../../api/authStorage";
import {
  getCustomerEventBookings,
  getCustomerTableReservations,
} from "../../api/reservationApi";
import {
  getInvoicesByCustomer,
  getPaymentsByCustomer,
} from "../../api/billingApi";
import { getReviewsByCustomer } from "../../api/eventApi";

const quickActions = [
  {
    title: "Reservations",
    description:
      "Review your table reservations and venue booking requests.",
    icon: CalendarCheck,
    path: "/customer/reservations",
  },
  {
    title: "Browse Menu",
    description:
      "Explore available menu items and catering selections.",
    icon: UtensilsCrossed,
    path: "/customer/menu",
  },
  {
    title: "Events",
    description:
      "Review your event bookings and coordinated event information.",
    icon: MapPin,
    path: "/customer/events",
  },
  {
    title: "Billing",
    description:
      "Review invoices, outstanding balances and payment history.",
    icon: CreditCard,
    path: "/customer/billing",
  },
];

export default function CustomerDashboardPage() {
  const auth = getAuth();
  const customerId = auth?.userId;

  const [tableReservations, setTableReservations] = useState([]);
  const [venueBookings, setVenueBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!customerId) {
      setErrorMessage(
        "The logged-in customer account could not be identified.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const [
        reservationData,
        bookingData,
        invoiceData,
        paymentData,
        reviewData,
      ] = await Promise.all([
        getCustomerTableReservations(customerId),
        getCustomerEventBookings(customerId),
        getInvoicesByCustomer(customerId),
        getPaymentsByCustomer(customerId),
        getReviewsByCustomer(customerId),
      ]);

      setTableReservations(
        Array.isArray(reservationData) ? reservationData : [],
      );

      setVenueBookings(
        Array.isArray(bookingData) ? bookingData : [],
      );

      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Dashboard information could not be loaded. Please try again.",
      );
    } finally {
      setLoading(false);
    }
   }, [customerId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const allBookings = useMemo(() => {
    const normalizedReservations = tableReservations.map(
      (reservation) => ({
        id: `table-${reservation.reservationId}`,
        reference: `TR-${reservation.reservationId}`,
        type: "Table Reservation",
        title: `Table ${reservation.tableNumber}`,
        location:
          reservation.tableLocation || "Restaurant",
        date: reservation.reservationDate,
        time: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.reservationStatus,
        path: `/customer/reservations/tables/${reservation.reservationId}`,
      }),
    );

    const normalizedVenueBookings = venueBookings.map(
      (booking) => ({
        id: `venue-${booking.eventBookingId}`,
        reference: `VB-${booking.eventBookingId}`,
        type: "Venue Booking",
        title: booking.venueName,
        location: booking.venueLocation,
        date: booking.bookingDate,
        time: null,
        endTime: null,
        status: booking.bookingStatus,
        path: `/customer/reservations/venues/${booking.eventBookingId}`,
      }),
    );

    return [
      ...normalizedReservations,
      ...normalizedVenueBookings,
    ];
  }, [tableReservations, venueBookings]);

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allBookings
      .filter((booking) => {
        if (!booking.date) {
          return false;
        }

        const bookingDate = createLocalDate(booking.date);
        const status = booking.status?.toUpperCase();

        return (
          bookingDate >= today &&
          status !== "CANCELLED"
        );
      })
      .sort((first, second) => {
        const dateDifference =
          createLocalDate(first.date) -
          createLocalDate(second.date);

        if (dateDifference !== 0) {
          return dateDifference;
        }

        return (first.time || "").localeCompare(
          second.time || "",
        );
      })
      .slice(0, 5);
  }, [allBookings]);

  const recentPayments = useMemo(
    () =>
      [...payments]
        .sort(
          (first, second) =>
            new Date(second.paymentDate) -
            new Date(first.paymentDate),
        )
        .slice(0, 5),
    [payments],
  );

  const outstandingBalance = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) =>
          total + Number(invoice.outstandingAmount || 0),
        0,
      ),
    [invoices],
  );

  const pendingBookings = allBookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === "PENDING",
  ).length;

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Customer Workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Welcome back
            {auth?.firstName ? `, ${auth.firstName}` : ""}
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Review your reservations, venue bookings, billing
            activity and feedback from one workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition hover:border-primary-300 hover:bg-primary-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">
            Dashboard could not be loaded
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 text-sm font-semibold text-red-800 hover:text-red-950"
          >
            Try again
          </button>
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={allBookings.length}
          detail={`${pendingBookings} pending`}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Upcoming Bookings"
          value={upcomingBookings.length}
          detail="Table and venue bookings"
        />

        <SummaryCard
          icon={FileText}
          label="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          detail={`${invoices.length} invoice${
            invoices.length === 1 ? "" : "s"
          }`}
        />

        <SummaryCard
          icon={MessageSquareHeart}
          label="Feedback Submitted"
          value={reviews.length}
          detail={`${payments.length} payment record${
            payments.length === 1 ? "" : "s"
          }`}
        />
      </section>

      {/* Quick Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Customer Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage your Aurevia services
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Upcoming Bookings */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Upcoming reservations
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Your nearest table and venue bookings.
              </p>
            </div>
          </div>

          <Link
            to="/customer/reservations"
            className="text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            View all reservations →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming reservations"
            description="You currently have no upcoming table reservations or venue bookings."
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-[120px_minmax(0,1fr)_160px_130px_auto] md:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Reference
                  </p>

                  <p className="mt-1 font-semibold text-primary-950">
                    {booking.reference}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-primary-950">
                    {booking.title}
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    {booking.type}
                    {booking.location
                      ? ` • ${booking.location}`
                      : ""}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-primary-950">
                    {formatDate(booking.date)}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {booking.time
                      ? formatTimeRange(
                          booking.time,
                          booking.endTime,
                        )
                      : "Full-day venue booking"}
                  </p>
                </div>

                <StatusBadge status={booking.status} />

                <Link
                  to={booking.path}
                  className="text-sm font-semibold text-primary-700 hover:text-primary-900"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Billing Overview */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-1 h-5 w-5 text-primary-700" />

              <div>
                <h2 className="text-lg font-semibold text-primary-950">
                  Recent payment activity
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Your latest submitted and verified payments.
                </p>
              </div>
            </div>

            <Link
              to="/customer/billing/history"
              className="text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              View history →
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payment activity"
              description="Your submitted payment records will appear here."
            />
          ) : (
            <div className="divide-y divide-stone-200">
              {recentPayments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="grid gap-4 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_140px_130px] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {payment.transactionReference}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      Invoice #{payment.invoiceId} •{" "}
                      {formatDateTime(payment.paymentDate)}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {formatLabel(payment.paymentMethod)} •{" "}
                      {formatLabel(payment.paymentType)}
                    </p>
                  </div>

                  <p className="font-semibold text-primary-950">
                    {formatCurrency(payment.amount)}
                  </p>

                  <StatusBadge status={payment.paymentStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
            Billing Summary
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Your current account position
          </h2>

          <div className="mt-7 space-y-4">
            <BillingRow
              label="Invoices"
              value={invoices.length}
            />

            <BillingRow
              label="Payments"
              value={payments.length}
            />

            <BillingRow
              label="Approved Payments"
              value={
                payments.filter(
                  (payment) =>
                    payment.paymentStatus?.toUpperCase() ===
                    "APPROVED",
                ).length
              }
            />

            <div className="border-t border-white/10 pt-4">
              <BillingRow
                label="Outstanding Balance"
                value={formatCurrency(outstandingBalance)}
                highlight
              />
            </div>
          </div>

          <Link
            to="/customer/billing/invoices"
            className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition hover:bg-primary-50"
          >
            Review invoices
          </Link>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 break-words text-2xl font-bold text-primary-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-stone-500">
        {detail}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() || "UNKNOWN";

  const statusClasses = {
    APPROVED:
      "bg-emerald-100 text-emerald-800",
    CONFIRMED:
      "bg-emerald-100 text-emerald-800",
    COMPLETED:
      "bg-blue-100 text-blue-800",
    PENDING:
      "bg-amber-100 text-amber-800",
    PLANNED:
      "bg-sky-100 text-sky-800",
    REJECTED:
      "bg-red-100 text-red-800",
    CANCELLED:
      "bg-stone-200 text-stone-700",
    PAID:
      "bg-emerald-100 text-emerald-800",
    PARTIALLY_PAID:
      "bg-amber-100 text-amber-800",
    UNPAID:
      "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        statusClasses[normalizedStatus] ||
        "bg-stone-100 text-stone-700"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
  );
}

function BillingRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-stone-300">
        {label}
      </span>

      <span
        className={
          highlight
            ? "text-lg font-bold text-gold-400"
            : "font-semibold text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
        <Icon className="h-5 w-5 text-primary-700" />
      </div>

      <h3 className="mt-4 font-semibold text-primary-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {description}
      </p>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="text-center">
        <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary-700" />

        <p className="mt-4 text-sm font-medium text-stone-600">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}

function createLocalDate(dateValue) {
  if (!dateValue) {
    return new Date(0);
  }

  const [year, month, day] = dateValue
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(createLocalDate(dateValue));
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function formatTimeRange(startTime, endTime) {
  const formattedStart = formatTime(startTime);

  if (!endTime) {
    return formattedStart;
  }

  return `${formattedStart} – ${formatTime(endTime)}`;
}

function formatTime(timeValue) {
  if (!timeValue) {
    return "—";
  }

  const [hours, minutes] = timeValue
    .split(":")
    .map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return value
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}