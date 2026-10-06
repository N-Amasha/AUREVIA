import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  MessageSquareHeart,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { getAllReviews } from "../../api/eventApi";

const SENTIMENTS = [
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
];

export default function FeedbackInsightsPage() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] =
    useState("ALL");
  const [sentimentFilter, setSentimentFilter] =
    useState("ALL");
  const [referenceFilter, setReferenceFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        setLoading(true);
        setErrorMessage("");

        const reviewData = await getAllReviews();

        if (active) {
          setReviews(
            Array.isArray(reviewData)
              ? reviewData
              : [],
          );
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.response?.data?.message
              || "Unable to load customer reviews.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  const analyzedReviews = useMemo(
    () =>
      reviews.filter((review) =>
        Boolean(review.sentiment),
      ),
    [reviews],
  );

  const pendingReviews = useMemo(
    () =>
      reviews.filter((review) =>
        !review.sentiment,
      ),
    [reviews],
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return "0.0";
    }

    const totalRating = reviews.reduce(
      (total, review) =>
        total + Number(review.rating || 0),
      0,
    );

    return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);

  const sentimentCounts = useMemo(
    () =>
      SENTIMENTS.reduce(
        (counts, sentiment) => ({
          ...counts,
          [sentiment]: analyzedReviews.filter(
            (review) =>
              review.sentiment?.toUpperCase()
              === sentiment,
          ).length,
        }),
        {},
      ),
    [analyzedReviews],
  );

  const filteredReviews = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const sentiment =
        review.sentiment?.toUpperCase()
        || "PENDING";

      const referenceType = review.eventId
        ? "EVENT"
        : "ORDER";

      const referenceText = review.eventId
        ? [
            `EVT-${review.eventId}`,
            review.eventName,
          ]
        : [
            `ORD-${review.orderId}`,
            "Customer Order",
          ];

      const searchableText = [
        review.reviewId,
        review.customerName,
        review.comment,
        sentiment,
        ...referenceText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch
        || searchableText.includes(normalizedSearch);

      const matchesRating =
        ratingFilter === "ALL"
        || Number(review.rating)
          === Number(ratingFilter);

      const matchesSentiment =
        sentimentFilter === "ALL"
        || sentiment === sentimentFilter;

      const matchesReference =
        referenceFilter === "ALL"
        || referenceType === referenceFilter;

      return (
        matchesSearch
        && matchesRating
        && matchesSentiment
        && matchesReference
      );
    });
  }, [
    reviews,
    searchTerm,
    ratingFilter,
    sentimentFilter,
    referenceFilter,
  ]);

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Feedback & sentiment
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review customer ratings, written feedback and
          automatically classified sentiment results.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Unable to load feedback
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MessageSquareHeart}
          label="Total Reviews"
          value={loading ? "..." : reviews.length}
        />

        <SummaryCard
          icon={Star}
          label="Average Rating"
          value={
            loading
              ? "..."
              : `${averageRating} / 5`
          }
        />

        <SummaryCard
          icon={Sparkles}
          label="Analyzed Reviews"
          value={
            loading
              ? "..."
              : analyzedReviews.length
          }
        />

        <SummaryCard
          icon={BarChart3}
          label="Pending Analysis"
          value={
            loading
              ? "..."
              : pendingReviews.length
          }
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px_190px_190px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search customer, event or feedback"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(event) =>
              setSentimentFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Sentiments
            </option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
            <option value="PENDING">
              Pending Analysis
            </option>
          </select>

          <select
            value={referenceFilter}
            onChange={(event) =>
              setReferenceFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">
              All Reference Types
            </option>
            <option value="EVENT">Events</option>
            <option value="ORDER">
              Customer Orders
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search by customer, event, reference or feedback
          comment and filter the live review records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Sentiment overview
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Distribution of analyzed customer feedback.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SentimentCard
            label="Positive"
            count={sentimentCounts.POSITIVE || 0}
            total={analyzedReviews.length}
            color="text-emerald-700"
          />

          <SentimentCard
            label="Neutral"
            count={sentimentCounts.NEUTRAL || 0}
            total={analyzedReviews.length}
            color="text-amber-700"
          />

          <SentimentCard
            label="Negative"
            count={sentimentCounts.NEGATIVE || 0}
            total={analyzedReviews.length}
            color="text-red-700"
          />
        </div>

        <p className="mt-5 text-xs leading-5 text-stone-500">
          Percentages use only reviews that currently have
          a stored sentiment classification.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Customer reviews
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            {loading
              ? "Loading customer reviews..."
              : `${filteredReviews.length} ${
                  filteredReviews.length === 1
                    ? "review"
                    : "reviews"
                } found.`}
          </p>
        </div>

        <div className="hidden grid-cols-[1.2fr_1fr_0.6fr_2fr_0.8fr_1fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Reference</span>
          <span>Customer</span>
          <span>Rating</span>
          <span>Feedback</span>
          <span>Sentiment</span>
          <span>Date</span>
        </div>

        {!loading && filteredReviews.length > 0 && (
          <div className="divide-y divide-stone-200">
            {filteredReviews.map((review) => (
              <ReviewRow
                key={review.reviewId}
                review={review}
              />
            ))}
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <MessageSquareHeart className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No matching reviews
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No customer reviews match the current search
              and filter selections.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Feedback Analysis
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From customer feedback to useful insight
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Submit"
            text="The customer submits a rating and written review."
          />

          <FlowStep
            number="02"
            title="Validate"
            text="The backend confirms ownership and requires a completed event or order."
          />

          <FlowStep
            number="03"
            title="Classify"
            text="The rating is classified as positive, neutral or negative."
          />

          <FlowStep
            number="04"
            title="Review"
            text="The coordinator reviews feedback and sentiment insights."
          />
        </div>
      </section>
    </div>
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

function SentimentCard({
  label,
  count,
  total,
  color,
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round((count / total) * 100);

  return (
    <div className="rounded-xl bg-cream-50 p-5">
      <p className="text-sm font-semibold text-primary-950">
        {label}
      </p>

      <p className={`mt-3 text-2xl font-bold ${color}`}>
        {count}
      </p>

      <p className="mt-1 text-xs text-stone-500">
        {percentage}% of analyzed reviews
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-primary-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ReviewRow({ review }) {
  const sentiment =
    review.sentiment?.toUpperCase()
    || "PENDING";

  const reference = review.eventId
    ? `EVT-${review.eventId}`
    : `ORD-${review.orderId}`;

  const referenceName = review.eventId
    ? review.eventName
    : "Customer Order";

  return (
    <article className="grid gap-4 px-6 py-5 lg:grid-cols-[1.2fr_1fr_0.6fr_2fr_0.8fr_1fr] lg:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {reference}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {referenceName}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Customer
        </p>

        <p className="mt-1 text-sm font-medium text-primary-950 lg:mt-0">
          {review.customerName}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Rating
        </p>

        <div className="mt-1 flex items-center gap-1 lg:mt-0">
          <Star className="h-4 w-4 fill-gold-400 text-gold-500" />

          <span className="text-sm font-semibold text-primary-950">
            {review.rating}/5
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Feedback
        </p>

        <p className="mt-1 text-sm leading-6 text-stone-600 lg:mt-0">
          {review.comment || "No written comment provided."}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Sentiment
        </p>

        <span
          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold lg:mt-0 ${sentimentBadgeClass(
            sentiment,
          )}`}
        >
          {sentimentDisplayName(sentiment)}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Date
        </p>

        <p className="mt-1 text-sm text-stone-600 lg:mt-0">
          {formatReviewDate(review.reviewDate)}
        </p>
      </div>
    </article>
  );
}

function sentimentBadgeClass(sentiment) {
  if (sentiment === "POSITIVE") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (sentiment === "NEGATIVE") {
    return "bg-red-100 text-red-800";
  }

  if (sentiment === "NEUTRAL") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-stone-100 text-stone-700";
}

function sentimentDisplayName(sentiment) {
  if (sentiment === "PENDING") {
    return "PENDING";
  }

  return sentiment;
}

function formatReviewDate(reviewDate) {
  if (!reviewDate) {
    return "Not available";
  }

  const parsedDate = new Date(reviewDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return reviewDate;
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
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