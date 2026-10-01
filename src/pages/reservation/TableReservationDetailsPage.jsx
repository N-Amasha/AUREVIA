import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { getAuth } from "../../api/authStorage";
import {
  getTableReservationById,
} from "../../api/reservationApi";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to load the table reservation."
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

export default function TableReservationDetailsPage() {
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReservation() {
      try {
        setLoading(true);
        setErrorMessage("");

        const reservationData =
          await getTableReservationById(reservationId);

        const loggedInCustomerId = getAuth()?.userId;

        if (
          reservationData.customerId !== loggedInCustomerId
        ) {
          setErrorMessage(
            "You are not allowed to view this reservation.",
          );
          return;
        }

        setReservation(reservationData);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadReservation();
  }, [reservationId]);

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
          Reservation Details
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Table reservation
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review your selected table, reservation schedule and
          confirmation status.
        </p>
      </section>

      {loading && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-600">
            Loading reservation details...
          </p>
        </section>
      )}

      {!loading && errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Reservation could not be displayed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      {!loading && reservation && (
        <>
          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Reservation Reference
                </p>

                <p className="mt-2 text-lg font-semibold text-primary-950">
                  RES-{reservation.reservationId}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                    reservation.reservationStatus,
                  )}`}
                >
                  {reservation.reservationStatus}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-primary-950">
                Reservation information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Information retrieved from the Aurevia reservation
                service.
              </p>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <DetailField
                icon={UtensilsCrossed}
                label="Table"
                value={`Table ${reservation.tableNumber}`}
              />

              <DetailField
                icon={MapPin}
                label="Table Location"
                value={reservation.tableLocation}
              />

              <DetailField
                icon={CalendarDays}
                label="Reservation Date"
                value={reservation.reservationDate}
              />

              <DetailField
                icon={Clock3}
                label="Reservation Time"
                value={`${reservation.startTime} - ${reservation.endTime}`}
              />

              <DetailField
                icon={Users}
                label="Number of Guests"
                value={reservation.numberOfGuests}
              />

              <DetailField
                icon={Users}
                label="Customer"
                value={reservation.customerName}
              />
            </div>
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
