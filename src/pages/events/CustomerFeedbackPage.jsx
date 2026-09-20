import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Info,
  MessageSquareText,
  Star,
} from "lucide-react";

export default function CustomerFeedbackPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Customer Feedback
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          My feedback
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review feedback opportunities for completed events and access
          feedback previously submitted through Aurevia.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Feedback records not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Eligible events and submitted reviews will be retrieved from
              the backend after customer authentication and database
              integration.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CalendarCheck}
          label="Completed Events"
        />

        <SummaryCard
          icon={MessageSquareText}
          label="Feedback Submitted"
        />

        <SummaryCard
          icon={Star}
          label="Pending Feedback"
        />
      </section>

      {/* Feedback Opportunities */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Feedback opportunities
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            Completed events that are eligible for customer feedback will
            appear here.
          </p>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <MessageSquareText className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            No feedback opportunities available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Once completed event records are available, eligible events will
            appear here with an option to provide feedback.
          </p>

          <Link
            to="/customer/events"
            className="mt-6 inline-flex rounded-xl border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            View My Events
          </Link>
        </div>
      </section>

      {/* Feedback Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Feedback Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Feedback remains connected to the relevant event
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Event Completed"
            text="The customer's coordinated event reaches completion."
          />

          <FlowStep
            number="02"
            title="Provide Feedback"
            text="The customer submits a rating and review for the relevant event."
          />

          <FlowStep
            number="03"
            title="Store Review"
            text="The review remains associated with the customer and event."
          />

          <FlowStep
            number="04"
            title="Analyze"
            text="Feedback can later support sentiment analysis and management insights."
          />
        </div>
      </section>

      {/* Sentiment note */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Sentiment analysis is a separate processing step
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          The customer provides the original rating and review. Sentiment
          analysis should process that review later; the frontend should not
          invent or manually assign a sentiment result.
        </p>
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