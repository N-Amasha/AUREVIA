/* oxlint-disable react/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CircleAlert,
  MessageSquareText,
  Search,
  Star,
} from "lucide-react";
import {
  getEventsByStatus,
  getReviewsByCustomer,
} from "../../api/eventApi";
import { getCustomerEventBookings } from "../../api/reservationApi";
import { getAuth } from "../../api/authStorage";

export default function CustomerFeedbackPage() {
  const customerId = getAuth()?.userId;

  const [completedEvents, setCompletedEvents] =
    useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [ratingFilter, setRatingFilter] =
    useState("");
  const [sentimentFilter, setSentimentFilter] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedbackData() {
      if (!customerId) {
        setError(
          "Authenticated customer information is unavailable.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          bookingData,
          completedEventData,
          reviewData,
        ] = await Promise.all([
          getCustomerEventBookings(customerId),
          getEventsByStatus("COMPLETED"),
          getReviewsByCustomer(customerId),
        ]);

        const bookings = Array.isArray(bookingData)
          ? bookingData
          : [];

        const events = Array.isArray(
          completedEventData,
        )
          ? completedEventData
          : [];

        const customerReviews = Array.isArray(
          reviewData,
        )
          ? reviewData
          : [];

        const customerBookingIds = new Set(
          bookings.map(
            (booking) =>
              booking.eventBookingId,
          ),
        );

        const customerCompletedEvents =
          events.filter((event) =>
            customerBookingIds.has(
              event.eventBookingId,
            ),
          );

        setCompletedEvents(
          customerCompletedEvents,
        );
        setReviews(customerReviews);
      } catch (loadError) {
        setError(
          getErrorMessage(
            loadError,
            "Unable to load customer feedback.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadFeedbackData();
  }, [customerId]);

  const reviewedEventIds = useMemo(
    () =>
      new Set(
        reviews
          .filter(
            (review) =>
              review.eventId !== null,
          )
          .map((review) => review.eventId),
      ),
    [reviews],
  );

  const feedbackOpportunities =
    useMemo(
      () =>
        completedEvents.filter(
          (event) =>
            !reviewedEventIds.has(
              event.eventId,
            ),
        ),
      [completedEvents, reviewedEventIds],
    );

  const filteredReviews = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const targetName =
        review.eventName ||
        (review.orderId
          ? `Order #${review.orderId}`
          : "Review");

      const matchesSearch =
        !normalizedSearch ||
        targetName
          .toLowerCase()
          .includes(normalizedSearch) ||
        review.comment
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesRating =
        !ratingFilter ||
        String(review.rating) ===
          ratingFilter;

      const matchesSentiment =
        !sentimentFilter ||
        review.sentiment ===
          sentimentFilter;

      return (
        matchesSearch &&
        matchesRating &&
        matchesSentiment
      );
    });
  }, [
    reviews,
    searchTerm,
    ratingFilter,
    sentimentFilter,
  ]);

  const averageRating = reviews.length
    ? reviews.reduce(
        (total, review) =>
          total + Number(review.rating || 0),
        0,
      ) / reviews.length
    : 0;

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Customer Feedback
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          My feedback
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review completed-event feedback
          opportunities and feedback previously
          submitted through Aurevia.
        </p>
      </section>

      {error && (
        <section className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-semibold">
              Feedback could not be loaded
            </h2>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarCheck}
          label="Completed Events"
          value={
            loading
              ? "—"
              : completedEvents.length
          }
        />

        <SummaryCard
          icon={MessageSquareText}
          label="Feedback Submitted"
          value={
            loading ? "—" : reviews.length
          }
        />

        <SummaryCard
          icon={Star}
          label="Pending Feedback"
          value={
            loading
              ? "—"
              : feedbackOpportunities.length
          }
        />

        <SummaryCard
          icon={Star}
          label="Average Rating"
          value={
            loading
              ? "—"
              : reviews.length
                ? averageRating.toFixed(1)
                : "0.0"
          }
        />
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Feedback opportunities
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            Completed events that have not yet
            been reviewed.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-stone-600">
            Loading feedback opportunities...
          </div>
        ) : feedbackOpportunities.length ===
          0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquareText className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No pending event feedback
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              You have reviewed all eligible
              completed events, or no completed
              events are currently available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {feedbackOpportunities.map(
              (event) => (
                <article
                  key={event.eventId}
                  className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {event.eventName}
                    </p>

                    <p className="mt-1 text-sm text-stone-600">
                      {formatLabel(
                        event.eventType,
                      )}
                      {" · "}
                      {formatDate(
                        event.eventDate,
                      )}
                    </p>
                  </div>

                  <Link
                    to={`/customer/events/${event.eventId}/feedback`}
                    className="inline-flex items-center justify-center rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                  >
                    Provide Feedback
                  </Link>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="Search feedback"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(
                event.target.value,
              )
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
          >
            <option value="">
              All Ratings
            </option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(event) =>
              setSentimentFilter(
                event.target.value,
              )
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
          >
            <option value="">
              All Sentiments
            </option>
            <option value="POSITIVE">
              Positive
            </option>
            <option value="NEUTRAL">
              Neutral
            </option>
            <option value="NEGATIVE">
              Negative
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Submitted feedback
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Showing {filteredReviews.length} of{" "}
            {reviews.length} submitted reviews.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-stone-600">
            Loading submitted feedback...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquareText className="mx-auto h-7 w-7 text-stone-400" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No submitted feedback found
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No reviews match the selected
              filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredReviews.map((review) => (
              <ReviewRow
                key={review.reviewId}
                review={review}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Feedback Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Feedback remains connected to the
          relevant service
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Complete"
            text="The event or customer order reaches completion."
          />

          <FlowStep
            number="02"
            title="Review"
            text="The customer submits a rating and written comment."
          />

          <FlowStep
            number="03"
            title="Store"
            text="The review remains associated with the customer and target."
          />

          <FlowStep
            number="04"
            title="Analyze"
            text="The rating is converted into an explainable sentiment category."
          />
        </div>
      </section>
    </div>
  );
}

function ReviewRow({ review }) {
  const targetName =
    review.eventName ||
    (review.orderId
      ? `Customer Order #${review.orderId}`
      : "Customer Review");

  return (
    <article className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_140px_1.5fr_140px] lg:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {targetName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          Review #{review.reviewId}
          {" · "}
          {formatDateTime(
            review.reviewDate,
          )}
        </p>
      </div>

      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < review.rating
                  ? "fill-current"
                  : "text-stone-300"
              }`}
            />
          ),
        )}
      </div>

      <p className="text-sm leading-6 text-stone-700">
        {review.comment ||
          "No written comment provided."}
      </p>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getSentimentClasses(
          review.sentiment,
        )}`}
      >
        {formatLabel(
          review.sentiment || "PENDING",
        )}
      </span>
    </article>
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

function getSentimentClasses(sentiment) {
  if (sentiment === "POSITIVE") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (sentiment === "NEGATIVE") {
    return "bg-red-100 text-red-800";
  }

  return "bg-amber-100 text-amber-800";
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
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
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}