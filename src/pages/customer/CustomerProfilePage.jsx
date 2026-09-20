import {
  CalendarDays,
  Edit3,
  Info,
  Mail,
  MapPin,
  User,
} from "lucide-react";

export default function CustomerProfilePage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          My Account
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Customer profile
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          View and manage the personal information associated with your
          Aurevia customer account.
        </p>
      </section>

      {/* Integration Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Account backend not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Customer profile information will be retrieved from the
              authenticated user account after Spring Security, JWT and
              database integration.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Profile Summary */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
            <User className="h-7 w-7 text-primary-700" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-primary-950">
            Customer account
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Profile details will appear after authentication and backend
            integration.
          </p>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Account Type
            </p>

            <p className="mt-2 text-sm font-semibold text-primary-900">
              Customer
            </p>
          </div>
        </section>

        {/* Details */}
        <section className="rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 p-6">
            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Information stored with your Aurevia account.
              </p>
            </div>

            <button
              type="button"
              disabled
              title="Available after backend integration"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-500 opacity-60"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <ProfileField
              icon={User}
              label="First Name"
            />

            <ProfileField
              icon={User}
              label="Last Name"
            />

            <ProfileField
              icon={Mail}
              label="Email Address"
            />

            <ProfileField
              icon={MapPin}
              label="Address"
            />

            <ProfileField
              icon={CalendarDays}
              label="Registration Date"
            />
          </div>
        </section>
      </div>

      {/* Account Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Account Integration
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One customer account connects Aurevia services
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Register"
            text="The customer creates an Aurevia account."
          />

          <FlowStep
            number="02"
            title="Authenticate"
            text="The backend verifies the account and establishes authenticated access."
          />

          <FlowStep
            number="03"
            title="Access Services"
            text="The customer uses reservations, events, menu and billing features."
          />

          <FlowStep
            number="04"
            title="Profile"
            text="Account information remains associated with the authenticated customer."
          />
        </div>
      </section>
    </div>
  );
}

function ProfileField({ icon: Icon, label }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-700" />

        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </p>
      </div>

      <div className="mt-3 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-400">
        —
      </div>
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