import {
  CalendarCheck,
  ChefHat,
  PartyPopper,
  ReceiptText,
  PackageSearch,
  UsersRound,
  Sparkles,
  Layers3,
  ShieldCheck,
} from "lucide-react";

const coreFunctions = [
  {
    icon: CalendarCheck,
    title: "Reservations",
    description:
      "Manage restaurant table and event venue reservations through an organized booking experience.",
  },
  {
    icon: ChefHat,
    title: "Menu & Recommendations",
    description:
      "Support menu browsing, customization, dietary preferences and personalized food recommendations.",
  },
  {
    icon: PartyPopper,
    title: "Event Coordination",
    description:
      "Coordinate event timelines, venue requirements, vendors and related event activities.",
  },
  {
    icon: ReceiptText,
    title: "Billing & Payments",
    description:
      "Manage invoices and customer bank payment slips through a clear verification process.",
  },
  {
    icon: PackageSearch,
    title: "Inventory & Waste",
    description:
      "Track ingredients, stock levels, low-stock conditions and food waste information.",
  },
  {
    icon: UsersRound,
    title: "Staff Management",
    description:
      "Manage staff, shifts and assignments while supporting demand-based staff allocation.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* About Hero */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-gold-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                About Aurevia
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              One connected experience
              <span className="block text-gold-400">
                for dining and events.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Aurevia is a restaurant and event management system designed
              to connect customer experiences with the operational
              activities required to manage dining and events.
            </p>
          </div>
        </div>
      </section>

      {/* What is Aurevia */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              The Platform
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              More than a reservation system
            </h2>

            <p className="mt-6 leading-7 text-stone-600">
              Restaurant and event operations involve more than accepting
              bookings. Reservations affect payments, menu planning,
              inventory, event coordination and staff requirements.
            </p>

            <p className="mt-4 leading-7 text-stone-600">
              Aurevia brings these activities into a connected system so
              customers and authorized staff can interact with the
              information relevant to their responsibilities.
            </p>
          </div>

          <div className="rounded-[2rem] bg-primary-950 p-8 text-white sm:p-10">
            <Layers3 className="h-10 w-10 text-gold-400" />

            <h3 className="mt-6 text-2xl font-semibold">
              Connected by design
            </h3>

            <p className="mt-4 leading-7 text-stone-300">
              Aurevia is structured around six major functional areas
              that exchange information as part of restaurant and event
              operations.
            </p>

            <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />

              <p className="text-sm leading-6 text-stone-300">
                Role-based access will ensure that customers and staff
                members access functions appropriate to their roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Functions */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
              Core Functions
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Six areas working as one system
            </h2>

            <p className="mt-5 leading-7 text-stone-600">
              Each functional area handles a different part of the
              restaurant and event management process while remaining
              connected to the wider Aurevia workflow.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreFunctions.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-stone-200 bg-cream-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-primary-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connected Workflow */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 sm:p-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
                Connected Workflow
              </p>

              <h2 className="mt-4 text-3xl font-bold text-primary-950">
                Information moves across the system
              </h2>

              <p className="mt-5 leading-7 text-stone-600">
                Aurevia is designed so that actions in one area can
                support related operational processes instead of keeping
                each function completely isolated.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-primary-50 p-5 text-sm leading-6 text-primary-950">
                Reservation → Invoice → Payment Slip → Verification →
                Reservation Confirmation
              </div>

              <div className="rounded-xl bg-primary-50 p-5 text-sm leading-6 text-primary-950">
                Menu → Confirmed Order → Ingredient Usage → Inventory
              </div>

              <div className="rounded-xl bg-primary-50 p-5 text-sm leading-6 text-primary-950">
                Reservations + Events → Demand → Staff Allocation
              </div>

              <div className="rounded-xl bg-primary-50 p-5 text-sm leading-6 text-primary-950">
                Completed Event → Feedback → Sentiment Analysis
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}