import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Clock3,
  ListChecks,
  MapPin,
  MessageSquareHeart,
  Store,
  Users,
  Wrench,
} from "lucide-react";

import {
  getEventById,
  getEventServiceTotalCost,
  getReviewsByEvent,
  getServicesByEvent,
  getTimelinesByEvent,
} from "../../api/eventApi";
import { getEventBookingById } from "../../api/reservationApi";

export default function CoordinatorEventDetailsPage() {
  const { eventId } = useParams();

  const [eventRecord, setEventRecord] = useState(null);
  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [serviceCost, setServiceCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEventDetails() {
      try {
        setLoading(true);
        setLoadError("");

        const loadedEvent = await getEventById(eventId);

        const [
          loadedBooking,
          loadedServices,
          loadedTimelines,
          loadedReviews,
          loadedServiceCost,
        ] = await Promise.all([
          getEventBookingById(
            loadedEvent.eventBookingId,
          ),
          getServicesByEvent(loadedEvent.eventId),
          getTimelinesByEvent(loadedEvent.eventId),
          getReviewsByEvent(loadedEvent.eventId),
          getEventServiceTotalCost(
            loadedEvent.eventId,
          ),
        ]);

        if (!active) {
          return;
        }

        setEventRecord(loadedEvent);
        setBooking(loadedBooking);
        setServices(loadedServices);
        setTimelines(loadedTimelines);
        setReviews(loadedReviews);
        setServiceCost(loadedServiceCost ?? 0);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error.response?.data?.message ??
            "Unable to load event details.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEventDetails();

    return () => {
      active = false;
    };
  }, [eventId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
        Loading event details…
      </div>
    );
  }

  if (loadError || !eventRecord) {
    return (
      <div>
        <Link
          to="/event-coordinator/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Event details could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/event-coordinator/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <section className="mt-7">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Event Coordination
          </p>

          <StatusBadge
            status={eventRecord.eventStatus}
          />
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          {eventRecord.eventName}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review the booking, services, vendors, timeline
          progress and customer feedback for this event.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Event Overview
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Event information
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={CalendarDays}
            label="Event Date"
            value={formatDate(eventRecord.eventDate)}
          />

          <InfoCard
            icon={Clock3}
            label="Event Time"
            value={`${formatTime(
              eventRecord.startTime,
            )} – ${formatTime(eventRecord.endTime)}`}
          />

          <InfoCard
            icon={Users}
            label="Expected Guests"
            value={String(
              eventRecord.numberOfGuests,
            )}
          />

          <InfoCard
            icon={MapPin}
            label="Venue"
            value={
              booking?.venueName ??
              "Not available"
            }
          />

          <InfoCard
            icon={Users}
            label="Customer"
            value={
              booking?.customerName ??
              "Not available"
            }
          />

          <InfoCard
            icon={Wrench}
            label="Event Type"
            value={formatLabel(
              eventRecord.eventType,
            )}
          />

          <InfoCard
            icon={Store}
            label="Coordinator"
            value={eventRecord.coordinatorName}
          />

          <InfoCard
            icon={Banknote}
            label="Event Budget"
            value={formatCurrency(
              eventRecord.budget,
            )}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="border-b border-stone-200 p-6">
            <div className="flex items-start gap-3">
              <Wrench className="mt-1 h-5 w-5 text-primary-700" />

              <div>
                <h2 className="font-semibold text-primary-950">
                  Event services
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Services and vendors assigned to this
                  event.
                </p>
              </div>
            </div>
          </div>

          {services.length === 0 ? (
            <EmptyPanel
              title="No services available"
              text="No service records are assigned to this event."
            />
          ) : (
            <div className="divide-y divide-stone-200">
              {services.map((service) => (
                <div
                  key={service.eventServiceId}
                  className="grid gap-4 p-6 sm:grid-cols-2"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {service.serviceName}
                    </p>

                    <p className="mt-1 text-sm text-stone-600">
                      {service.vendorName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {formatLabel(
                        service.vendorType,
                      )}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold text-primary-950">
                      {formatCurrency(service.cost)}
                    </p>

                    <p className="mt-1 text-sm text-stone-600">
                      {formatDate(
                        service.serviceDate,
                      )}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-primary-700">
                      {formatLabel(
                        service.serviceStatus,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-primary-950 p-6 text-white">
          <Banknote className="h-6 w-6 text-gold-400" />

          <p className="mt-5 text-sm text-stone-300">
            Total Service Cost
          </p>

          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(serviceCost)}
          </p>

          <p className="mt-5 text-sm text-stone-300">
            Event Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            {formatCurrency(eventRecord.budget)}
          </p>

          <p className="mt-5 text-sm leading-6 text-stone-300">
            These values are retrieved from the event and
            event-service records.
          </p>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Event timeline
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Coordination milestones and progress
                updates.
              </p>
            </div>
          </div>
        </div>

        {timelines.length === 0 ? (
          <EmptyPanel
            title="No timeline milestones"
            text="No timeline records are available for this event."
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {timelines.map((timeline) => (
              <div
                key={timeline.timelineId}
                className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_200px_140px]"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {timeline.milestoneName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {timeline.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Scheduled
                  </p>

                  <p className="mt-2 text-sm text-stone-700">
                    {formatDateTime(
                      timeline.scheduledDate,
                    )}
                  </p>
                </div>

                <div>
                  <StatusBadge
                    status={timeline.status}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <MessageSquareHeart className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Customer feedback
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Ratings, comments and sentiment results
                associated with this event.
              </p>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <EmptyPanel
            title="No feedback available"
            text="No customer reviews are associated with this event."
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_120px_140px]"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {review.customerName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {review.comment}
                  </p>

                  <p className="mt-2 text-xs text-stone-500">
                    {formatDateTime(
                      review.reviewDate,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Rating
                  </p>

                  <p className="mt-2 font-semibold text-primary-950">
                    {review.rating} / 5
                  </p>
                </div>

                <div>
                  <SentimentBadge
                    sentiment={review.sentiment}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-cream-50 p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div className="m-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-7 text-center">
      <p className="text-sm font-medium text-stone-700">
        {title}
      </p>

      <p className="mt-2 text-xs text-stone-500">
        {text}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() ?? "UNKNOWN";

  const styles = {
    PLANNED:
      "bg-blue-50 text-blue-700 ring-blue-200",
    CONFIRMED:
      "bg-amber-50 text-amber-700 ring-amber-200",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-200",
    IN_PROGRESS:
      "bg-blue-50 text-blue-700 ring-blue-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[normalizedStatus] ??
        "bg-stone-100 text-stone-700 ring-stone-200"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
  );
}

function SentimentBadge({ sentiment }) {
  const normalizedSentiment =
    sentiment?.toUpperCase() ?? "NEUTRAL";

  const styles = {
    POSITIVE:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    NEUTRAL:
      "bg-stone-100 text-stone-700 ring-stone-200",
    NEGATIVE:
      "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[normalizedSentiment] ??
        styles.NEUTRAL
      }`}
    >
      {formatLabel(normalizedSentiment)}
    </span>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not available";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value) {
  if (!value) {
    return "Not available";
  }

  return value.slice(0, 5);
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}