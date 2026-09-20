import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Utensils,
  Sparkles,
  CalendarCheck,
  ChefHat,
  PartyPopper,
  ReceiptText,
  Leaf,
} from "lucide-react";

import Button from "../../components/ui/Button";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream-50">
        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-gold-100/50 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-20">
          
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-gold-600" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Dining & Events
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-primary-950 sm:text-6xl lg:text-7xl">
              Exceptional dining.
              <span className="mt-2 block text-primary-700">
                Unforgettable celebrations.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              Discover memorable dining experiences, thoughtfully
              designed menus and elegant event spaces — all brought
              together through Aurevia.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/dining">
                <Button size="lg">
                  <Utensils className="mr-2 h-5 w-5" />
                  Explore Dining
                </Button>
              </Link>

              <Link to="/events">
                <Button variant="outline" size="lg">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Explore Events
                </Button>
              </Link>
            </div>

            {/* Small information row */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-stone-200 pt-7">
              <div>
                <p className="text-2xl font-bold text-primary-900">
                  Dining
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                  Table Experiences
                </p>
              </div>

              <div className="h-12 w-px bg-stone-200" />

              <div>
                <p className="text-2xl font-bold text-primary-900">
                  Events
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                  Venue Experiences
                </p>
              </div>

              <div className="hidden h-12 w-px bg-stone-200 sm:block" />

              <div>
                <p className="text-2xl font-bold text-primary-900">
                  Aurevia
                </p>

                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                  One Experience
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="relative">
            <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] bg-primary-900 p-8 shadow-2xl sm:p-10">
              
              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full border border-gold-400/30" />

              <div className="relative flex h-full min-h-[420px] flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                    The Aurevia Experience
                  </p>

                  <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight text-white">
                    One destination for dining and meaningful
                    celebrations.
                  </h2>

                  <p className="mt-5 max-w-md leading-7 text-stone-300">
                    From intimate table reservations to carefully
                    coordinated events, Aurevia connects every part of
                    the experience.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <Utensils className="h-6 w-6 text-gold-400" />

                    <h3 className="mt-4 font-semibold text-white">
                      Dining
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      Explore menus and discover dining experiences.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <CalendarDays className="h-6 w-6 text-gold-400" />

                    <h3 className="mt-4 font-semibold text-white">
                      Events
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      Discover spaces for memorable occasions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating detail */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xl md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Discover
              </p>

              <div className="mt-2 flex items-center gap-3">
                <p className="font-semibold text-primary-900">
                  Your Aurevia Experience
                </p>

                <ArrowRight className="h-4 w-4 text-primary-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining & Events Experience */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              Discover Aurevia
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Designed for every occasion
            </h2>

            <p className="mt-5 leading-7 text-stone-600">
              Whether you are planning a quiet dining experience or a memorable
              celebration, Aurevia brings the essential details together.
            </p>
          </div>

          {/* Experience Cards */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Dining Card */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-primary-950 p-8 sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500">
                  <Utensils className="h-6 w-6 text-primary-950" />
                </div>

                <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                  Restaurant Dining
                </p>

                <h3 className="mt-3 text-3xl font-semibold text-white">
                  Find your perfect table
                </h3>

                <p className="mt-4 max-w-lg leading-7 text-stone-300">
                  Explore dining options, browse the menu and discover an
                  experience that matches your occasion and preferences.
                </p>

                <Link
                  to="/dining"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition hover:gap-3"
                >
                  Explore Dining
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Events Card */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-stone-200 bg-cream-100 p-8 sm:p-10">
              <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-gold-100" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>

                <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                  Events & Celebrations
                </p>

                <h3 className="mt-3 text-3xl font-semibold text-primary-950">
                  Create memorable moments
                </h3>

                <p className="mt-4 max-w-lg leading-7 text-stone-600">
                  Discover event spaces and explore the services available for
                  celebrations, gatherings and special occasions.
                </p>

                <Link
                  to="/events"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:gap-3"
                >
                  Explore Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Aurevia */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            
            {/* Section Introduction */}
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
                Why Aurevia
              </p>

              <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                Your experience, connected from start to finish.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-stone-600">
                Aurevia brings dining, events and customer services together
                so that each stage of your experience can be managed in one
                connected place.
              </p>

              <Link
                to="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:gap-3"
              >
                Learn more about Aurevia
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Features */}
            <div className="grid gap-5 sm:grid-cols-2">
              
              {/* Reservation */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <CalendarCheck className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-primary-950">
                  Easy Reservations
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Explore table and venue options and manage your reservation
                  journey from one place.
                </p>
              </div>

              {/* Menu */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50">
                  <ChefHat className="h-5 w-5 text-gold-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-primary-950">
                  Personalized Dining
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Browse menus while considering dietary preferences,
                  allergens and personalized food recommendations.
                </p>
              </div>

              {/* Event Coordination */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50">
                  <PartyPopper className="h-5 w-5 text-gold-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-primary-950">
                  Coordinated Events
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Keep important event details, venue arrangements and
                  coordination progress organized.
                </p>
              </div>

              {/* Billing */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <ReceiptText className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-primary-950">
                  Clear Payment Tracking
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  View invoices, submit bank payment slips and follow payment
                  verification status clearly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Menu */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
                From Our Menu
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                A taste of Aurevia
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-stone-600">
                Discover a selection of dishes and explore menu choices
                designed for different tastes and dietary preferences.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary-800 transition hover:gap-3"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Menu Preview Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Item 1 */}
            <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-48 items-center justify-center bg-primary-950">
                <ChefHat className="h-12 w-12 text-gold-400" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      Main Course
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-primary-950">
                      Signature Dining
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Explore carefully prepared main dishes from the Aurevia
                  menu.
                </p>
              </div>
            </article>

            {/* Item 2 */}
            <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-48 items-center justify-center bg-primary-100">
                <Leaf className="h-12 w-12 text-primary-700" />
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Dietary Choices
                </p>

                <h3 className="mt-2 text-xl font-semibold text-primary-950">
                  Made for Your Preferences
                </h3>

                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Discover menu options while considering dietary preferences
                  and allergen information.
                </p>
              </div>
            </article>

            {/* Item 3 */}
            <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-48 items-center justify-center bg-gold-100">
                <Sparkles className="h-12 w-12 text-gold-600" />
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Recommendations
                </p>

                <h3 className="mt-2 text-xl font-semibold text-primary-950">
                  Discover Something New
                </h3>

                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Receive food recommendations based on available preference
                  information and dining choices.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="bg-primary-950 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-primary-900 px-6 py-14 text-center sm:px-12 sm:py-16">
            
            {/* Decorative Elements */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-gold-500/10" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500">
                <Sparkles className="h-6 w-6 text-primary-950" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                Your Aurevia Experience
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Discover dining and celebrations designed around you.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-stone-300">
                Explore our dining experiences, discover menu options or find
                the right setting for your next memorable occasion.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link to="/dining">
                  <Button variant="secondary" size="lg">
                    <Utensils className="mr-2 h-5 w-5" />
                    Explore Dining
                  </Button>
                </Link>

                <Link to="/events">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:border-white hover:bg-white/10"
                  >
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Explore Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}