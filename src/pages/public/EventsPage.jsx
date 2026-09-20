import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Check,
  PartyPopper,
  Sparkles,
  Users,
  ClipboardCheck,
  MapPin,
  ChefHat,
  UsersRound,
  MessageSquareHeart,
  ArrowRight,
} from "lucide-react";

import { eventExperiences, eventTypes } from "../../data/eventData";

export default function EventsPage() {
  const [activeType, setActiveType] = useState("all");

  const filteredEvents = eventExperiences.filter(
    (event) => activeType === "all" || event.type === activeType
  );

  return (
    <>
      {/* Events Hero */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <PartyPopper className="h-4 w-4 text-gold-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Aurevia Events
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Memorable moments,
              <span className="block text-gold-400">
                thoughtfully coordinated.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Explore event experiences for weddings, corporate
              gatherings, celebrations and private occasions with
              coordinated venue and dining support.
            </p>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gold-400" />
                Event Planning
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gold-400" />
                Flexible Guest Capacity
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Coordinated Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Experiences */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              Event Experiences
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Find the right setting for your occasion
            </h2>

            <p className="mt-5 leading-7 text-stone-600">
              Explore the types of events Aurevia can support through
              venue arrangements, dining choices and event coordination.
            </p>
          </div>

          {/* Event Type Filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {eventTypes.map((type) => {
              const active = activeType === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActiveType(type.value)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-primary-800 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-primary-300 hover:text-primary-800"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Event Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Card Visual */}
                <div className="relative flex h-52 items-center justify-center bg-primary-100">
                  <PartyPopper className="h-12 w-12 text-primary-700" />

                  <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary-800 shadow-sm">
                    {event.typeLabel}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7">
                  <h3 className="text-2xl font-semibold text-primary-950">
                    {event.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gold-600">
                    <Users className="h-4 w-4" />
                    {event.capacity}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    {event.description}
                  </p>

                  <div className="mt-6 border-t border-stone-100 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Experience Includes
                    </p>

                    <div className="mt-4 space-y-3">
                      {event.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 text-sm text-stone-700"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50">
                            <Check className="h-3.5 w-3.5 text-primary-700" />
                          </div>

                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Demo Information */}
          <div className="mt-10 rounded-xl border border-gold-200 bg-gold-50 p-4 text-center">
            <p className="text-sm leading-6 text-stone-700">
              Event experiences shown here are frontend demonstration
              content. Venue availability and event records will be
              provided by the Aurevia backend after integration.
            </p>
          </div>
        </div>
      </section>
      {/* Event Coordination Process */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              Event Coordination
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              From your first request to the final celebration
            </h2>

            <p className="mt-5 leading-7 text-stone-600">
              Aurevia brings venue planning, dining arrangements and event
              coordination into one organized process.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Step 01 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  01
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Submit Event Request
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Provide the event type, preferred date, guest count and basic
                requirements for the occasion.
              </p>
            </div>

            {/* Step 02 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <MapPin className="h-5 w-5 text-white" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  02
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Check Venue Options
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Suitable venue options can be identified based on availability,
                event requirements and guest capacity.
              </p>
            </div>

            {/* Step 03 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  03
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Customize Dining
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Catering and menu choices can be planned according to the
                event and customer preferences.
              </p>
            </div>

            {/* Step 04 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <UsersRound className="h-5 w-5 text-white" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  04
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Coordinate Resources
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Event coordinators organize timeline requirements, staff
                requests and vendor-related arrangements.
              </p>
            </div>

            {/* Step 05 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                  <ClipboardCheck className="h-5 w-5 text-white" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  05
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Track Event Progress
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Event plans and timeline progress can be monitored and updated
                throughout the coordination process.
              </p>
            </div>

            {/* Step 06 */}
            <div className="rounded-2xl border border-stone-200 bg-cream-50 p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500">
                  <MessageSquareHeart className="h-5 w-5 text-primary-950" />
                </div>

                <span className="text-sm font-bold text-gold-500">
                  06
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary-950">
                Share Feedback
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                After the event, customers can provide feedback that can later
                support sentiment analysis and service improvements.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Events Final CTA */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary-950 px-6 py-14 text-center sm:px-12 sm:py-16">
            
            {/* Decorative Elements */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gold-500/10" />

            <div className="relative mx-auto max-w-3xl">
              <PartyPopper className="mx-auto h-10 w-10 text-gold-400" />

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                Plan With Aurevia
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Every memorable event starts with a plan.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-stone-300">
                Aurevia brings venue arrangements, dining choices and event
                coordination together to support a more organized event
                experience.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-primary-950 transition hover:bg-gold-600 hover:text-white"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Menu
                </Link>
              </div>

              <p className="mt-5 text-xs text-stone-400">
                Event planning features will be available through the customer
                account experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}