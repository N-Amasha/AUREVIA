import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  Search,
  Utensils,
  Sparkles,
} from "lucide-react";

import Button from "../../components/ui/Button";
import InputField from "../../components/forms/InputField";
import SelectField from "../../components/forms/SelectField";
import { Link } from "react-router-dom";

export default function DiningPage() {
  const [searchData, setSearchData] = useState({
    date: "",
    time: "",
    guests: "",
  });

  const [searched, setSearched] = useState(false);

  const guestOptions = [
    { value: "1", label: "1 Guest" },
    { value: "2", label: "2 Guests" },
    { value: "3", label: "3 Guests" },
    { value: "4", label: "4 Guests" },
    { value: "5", label: "5 Guests" },
    { value: "6", label: "6 Guests" },
    { value: "7", label: "7 Guests" },
    { value: "8", label: "8 Guests" },
    { value: "9+", label: "9+ Guests" },
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setSearchData((current) => ({
      ...current,
      [name]: value,
    }));

    setSearched(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSearched(true);
  }

  return (
    <>
      {/* Dining Hero */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 sm:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Utensils className="h-4 w-4 text-gold-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Aurevia Dining
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Find the perfect setting
              <span className="block text-gold-400">
                for your next meal.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Explore dining options and begin planning your Aurevia
              table experience based on your preferred date, time and
              party size.
            </p>
          </div>
        </div>
      </section>

      {/* Availability Search */}
      <section className="relative z-10 bg-cream-50 pb-20 pt-1">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl sm:mt-12 sm:p-8">
            <div className="flex flex-col gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Plan Your Visit
                </p>

                <h2 className="mt-2 text-2xl font-bold text-primary-950">
                  Check dining options
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Sparkles className="h-4 w-4 text-gold-500" />
                Frontend preview
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
            >
              {/* Date */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary-700" />
                  <span className="text-xs font-medium text-stone-500">
                    Reservation Date
                  </span>
                </div>

                <InputField
                  label="Date"
                  name="date"
                  type="date"
                  value={searchData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary-700" />
                  <span className="text-xs font-medium text-stone-500">
                    Preferred Time
                  </span>
                </div>

                <InputField
                  label="Time"
                  name="time"
                  type="time"
                  value={searchData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Guests */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary-700" />
                  <span className="text-xs font-medium text-stone-500">
                    Party Size
                  </span>
                </div>

                <SelectField
                  label="Guests"
                  name="guests"
                  value={searchData.guests}
                  onChange={handleChange}
                  options={guestOptions}
                  placeholder="Select guests"
                  required
                />
              </div>

              {/* Search */}
              <Button type="submit" size="lg" className="w-full lg:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Check Options
              </Button>
            </form>

            {/* Demo Message */}
            {searched && (
              <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-4">
                <p className="text-sm font-semibold text-primary-900">
                  Dining search preview
                </p>

                <p className="mt-1 text-sm leading-6 text-primary-700">
                  You selected {searchData.guests} guest(s) for{" "}
                  {searchData.date} at {searchData.time}. Available tables
                  will be displayed here when the reservation service is
                  connected to the backend.
                </p>
              </div>
            )}
          </div>
        </div>
        
      </section>
      {/* Dining Options */}
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              Dining Spaces
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Choose your dining experience
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Explore the types of dining spaces Aurevia can offer for
              different occasions and group sizes.
            </p>
          </div>

          <p className="text-sm text-stone-500">
            Availability is confirmed during reservation.
          </p>
        </div>

        {/* Dining Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Standard Dining */}
          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-52 items-center justify-center bg-primary-950">
              <Utensils className="h-12 w-12 text-gold-400" />
            </div>

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Classic Dining
              </p>

              <h3 className="mt-2 text-xl font-semibold text-primary-950">
                Main Dining Area
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                A comfortable setting for everyday dining, family meals and
                casual celebrations.
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 text-sm text-stone-500">
                <Users className="h-4 w-4 text-primary-700" />
                Suitable for small and medium groups
              </div>
            </div>
          </article>

          {/* Intimate Dining */}
          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-52 items-center justify-center bg-primary-100">
              <Sparkles className="h-12 w-12 text-primary-700" />
            </div>

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Intimate Dining
              </p>

              <h3 className="mt-2 text-xl font-semibold text-primary-950">
                Quiet Table Setting
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                A more relaxed dining atmosphere for smaller gatherings and
                special moments.
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 text-sm text-stone-500">
                <Users className="h-4 w-4 text-primary-700" />
                Designed for smaller parties
              </div>
            </div>
          </article>

          {/* Group Dining */}
          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-cream-50 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-52 items-center justify-center bg-gold-100">
              <Users className="h-12 w-12 text-gold-600" />
            </div>

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Group Dining
              </p>

              <h3 className="mt-2 text-xl font-semibold text-primary-950">
                Group Table Setting
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Flexible dining arrangements for larger families, friends
                and group occasions.
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 text-sm text-stone-500">
                <Users className="h-4 w-4 text-primary-700" />
                Suitable for larger groups
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
    {/* How Reservations Work */}
    <section className="bg-cream-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
            Simple & Clear
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            How dining reservations work
          </h2>

          <p className="mt-5 leading-7 text-stone-600">
            Aurevia guides customers through a clear reservation process
            from checking dining options to receiving confirmation.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-sm font-bold text-white">
              01
            </div>

            <h3 className="mt-6 text-xl font-semibold text-primary-950">
              Choose your details
            </h3>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Select your preferred date, time and number of guests for the
              dining experience.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-primary-950">
              02
            </div>

            <h3 className="mt-6 text-xl font-semibold text-primary-950">
              Check suitable options
            </h3>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Available dining options can be presented based on your
              reservation requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-sm font-bold text-white">
              03
            </div>

            <h3 className="mt-6 text-xl font-semibold text-primary-950">
              Review & confirm
            </h3>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Review the reservation details before completing the
              reservation process and receiving its status.
            </p>
          </div>
        </div>
      </div>
    </section>
    {/* Dining Final CTA */}
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary-950 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gold-500/10" />

          <div className="relative mx-auto max-w-3xl">
            <Utensils className="mx-auto h-9 w-9 text-gold-400" />

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Aurevia Dining
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore the menu before your visit.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-stone-300">
              Discover Aurevia menu options, dietary information and the
              dining choices available for different preferences.
            </p>

            <div className="mt-8">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 font-medium text-primary-950 transition hover:bg-gold-600 hover:text-white"
              >
                Explore Our Menu
                <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}