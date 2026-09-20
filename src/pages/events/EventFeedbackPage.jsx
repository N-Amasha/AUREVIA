import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  MessageSquareHeart,
  Send,
  Sparkles,
  Star,
} from "lucide-react";

import Button from "../../components/ui/Button";
import TextAreaField from "../../components/forms/TextAreaField";

export default function EventFeedbackPage() {
  const { eventId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [previewReady, setPreviewReady] = useState(false);

  function handlePreview(event) {
    event.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      setPreviewReady(false);
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your feedback.");
      setPreviewReady(false);
      return;
    }

    setError("");
    setPreviewReady(true);
  }

  function handleReset() {
    setRating(0);
    setComment("");
    setError("");
    setPreviewReady(false);
  }

  return (
    <div>
      {/* Back */}
      <Link
        to={`/customer/events/${eventId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Event
      </Link>

      {/* Header */}
      <section className="mt-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
          <MessageSquareHeart className="h-5 w-5 text-white" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Customer Feedback
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Share your event experience
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Rate your event experience and provide feedback that can help
          improve future Aurevia services.
        </p>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Frontend feedback preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This form currently uses local frontend state. Feedback will
              be stored and analyzed only after the review and sentiment
              services are connected to the backend.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Feedback Form */}
        <form
          onSubmit={handlePreview}
          className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              Event {eventId || "—"}
            </p>

            <h2 className="mt-2 text-xl font-semibold text-primary-950">
              Your feedback
            </h2>
          </div>

          {/* Rating */}
          <div className="mt-7">
            <label className="text-sm font-semibold text-stone-700">
              Overall rating
            </label>

            <p className="mt-1 text-xs text-stone-500">
              Select a rating from 1 to 5.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setRating(value);
                    setPreviewReady(false);
                    setError("");
                  }}
                  aria-label={`${value} star rating`}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    rating >= value
                      ? "border-gold-400 bg-gold-50 text-gold-600"
                      : "border-stone-300 bg-white text-stone-400 hover:border-gold-300"
                  }`}
                >
                  <Star
                    className="h-5 w-5"
                    fill={rating >= value ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="mt-3 text-sm font-medium text-primary-800">
                Selected rating: {rating}/5
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mt-7">
            <TextAreaField
              label="Feedback"
              name="feedback"
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setPreviewReady(false);
                setError("");
              }}
              placeholder="Tell us about your event experience..."
              rows={6}
            />
          </div>

          {/* Validation */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button type="submit">
              <Sparkles className="h-4 w-4" />
              Preview Feedback
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Clear
            </Button>
          </div>
        </form>

        {/* Sentiment Panel */}
        <aside className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
            <Sparkles className="h-5 w-5 text-primary-700" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-primary-950">
            Sentiment analysis
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Aurevia is designed to analyze customer feedback so managers
            can better understand customer experiences.
          </p>

          {!previewReady ? (
            <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-5">
              <p className="text-sm font-medium text-stone-700">
                No feedback preview yet
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-500">
                Enter a rating and feedback to validate the frontend form.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-5">
              <p className="text-sm font-semibold text-primary-950">
                Feedback ready
              </p>

              <p className="mt-2 text-sm text-primary-800">
                Rating: {rating}/5
              </p>

              <p className="mt-3 text-sm leading-6 text-primary-800">
                "{comment}"
              </p>

              <div className="mt-4 border-t border-primary-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                  Sentiment
                </p>

                <p className="mt-1 text-sm font-semibold text-stone-500">
                  Not analyzed
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 rounded-xl bg-stone-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />

            <p className="text-xs leading-5 text-stone-500">
              No AI or sentiment model is currently running. The final
              sentiment result will come from the backend analysis service.
            </p>
          </div>
        </aside>
      </div>

      {/* Future Submission */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <div className="flex items-start gap-4">
          <Send className="mt-1 h-5 w-5 shrink-0 text-gold-400" />

          <div>
            <h2 className="font-semibold">
              Final feedback submission
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
              When the backend is implemented, feedback submission will
              create a review associated with the completed event. The
              review can then be processed by the sentiment analysis
              component.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}