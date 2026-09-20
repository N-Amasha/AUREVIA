import {
  BarChart3,
  Info,
  MessageSquareHeart,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

export default function FeedbackInsightsPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Feedback & sentiment
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review customer ratings, written feedback and sentiment insights
          from completed events.
        </p>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Sentiment analysis not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Customer reviews and sentiment results will be retrieved from
              the backend after review storage and sentiment analysis are
              implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MessageSquareHeart}
          label="Total Reviews"
        />

        <SummaryCard
          icon={Star}
          label="Average Rating"
        />

        <SummaryCard
          icon={Sparkles}
          label="Analyzed Reviews"
        />

        <SummaryCard
          icon={BarChart3}
          label="Pending Analysis"
        />
      </section>

      {/* Search */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search feedback"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Ratings</option>
          </select>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Sentiments</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search and filtering will become available after customer review
          records are connected.
        </p>
      </section>

      {/* Sentiment Breakdown */}
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
          <SentimentCard label="Positive" />
          <SentimentCard label="Neutral" />
          <SentimentCard label="Negative" />
        </div>

        <p className="mt-5 text-xs leading-5 text-stone-500">
          No sentiment percentages are displayed until actual analyzed
          review data is available.
        </p>
      </section>

      {/* Review Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Customer reviews
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Ratings, comments and sentiment results will appear here.
          </p>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Event</span>
          <span>Customer</span>
          <span>Rating</span>
          <span>Feedback</span>
          <span>Sentiment</span>
          <span>Date</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <MessageSquareHeart className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No customer reviews available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Feedback from completed events will appear here after review
            records are connected to the backend.
          </p>
        </div>
      </section>

      {/* Analysis explanation */}
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
            text="Customer submits a rating and written review."
          />

          <FlowStep
            number="02"
            title="Store"
            text="The review is associated with the completed event."
          />

          <FlowStep
            number="03"
            title="Analyze"
            text="The written feedback is processed by the sentiment component."
          />

          <FlowStep
            number="04"
            title="Review"
            text="Management reviews feedback and sentiment insights."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}

function SentimentCard({ label }) {
  return (
    <div className="rounded-xl bg-cream-50 p-5">
      <p className="text-sm font-semibold text-primary-950">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-stone-400">
        —
      </p>

      <p className="mt-1 text-xs text-stone-500">
        No analyzed data
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