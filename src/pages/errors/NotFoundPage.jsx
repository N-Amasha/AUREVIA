import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50">
          <SearchX className="h-9 w-9 text-primary-700" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-gold-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary-950 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-stone-600">
          The page you're looking for doesn't exist, may have moved, or the
          address may have been entered incorrectly.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-900"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary-950">
            AUREVIA
          </p>

          <p className="mt-2 text-xs text-stone-500">
            Restaurant & Event Management
          </p>
        </div>
      </div>
    </main>
  );
}