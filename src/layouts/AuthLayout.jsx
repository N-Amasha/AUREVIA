import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-cream-50 lg:grid lg:grid-cols-2">
      {/* Brand Panel */}
      <section className="relative hidden overflow-hidden bg-primary-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-lg font-bold text-primary-950">
              A
            </div>

            <div>
              <p className="text-xl font-bold tracking-[0.15em] text-white">
                AUREVIA
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-400">
                Dining & Events
              </p>
            </div>
          </Link>
        </div>

        <div className="relative max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Sparkles className="h-4 w-4 text-gold-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Welcome to Aurevia
            </span>
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-tight text-white xl:text-5xl">
            Dining, events and
            <span className="block text-gold-400">
              thoughtful experiences.
            </span>
          </h1>

          <p className="mt-6 leading-7 text-stone-300">
            Access your Aurevia account to manage your dining and event
            experiences through one connected platform.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-stone-300">
            <ShieldCheck className="h-5 w-5 text-gold-400" />
            Secure account access
          </div>
        </div>

        <p className="relative text-xs text-stone-500">
          Restaurant & Event Management System
        </p>
      </section>

      {/* Auth Content */}
      <section className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Aurevia
          </Link>

          {/* Mobile Brand */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 font-bold text-white">
              A
            </div>

            <span className="font-bold tracking-[0.12em] text-primary-950">
              AUREVIA
            </span>
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}