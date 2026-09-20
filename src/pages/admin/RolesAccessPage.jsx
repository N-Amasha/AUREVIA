import {
  Info,
  KeyRound,
  LockKeyhole,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function RolesAccessPage() {
  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          System Administration
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Roles & access
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review the application roles used to separate responsibilities
          across the Aurevia platform.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Authorization is not active yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              These frontend workspaces represent Aurevia responsibilities,
              but access is not currently protected. Spring Security and
              backend authorization will enforce role-based access later.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ShieldCheck}
          label="Application Roles"
        />

        <SummaryCard
          icon={Users}
          label="Role Assignments"
        />

        <SummaryCard
          icon={LockKeyhole}
          label="Protected Operations"
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              disabled
              placeholder="Search roles"
              className="w-full cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-500 outline-none"
            />
          </div>

          <select
            disabled
            className="cursor-not-allowed rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
          >
            <option>All Access Areas</option>
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Role records and permission filtering will become available after
          backend security integration.
        </p>
      </section>

      {/* Roles */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Application roles
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                The final role and permission configuration will be loaded
                from the backend security model.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Role</span>
          <span>Users</span>
          <span>Access Area</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <KeyRound className="h-6 w-6 text-primary-700" />
          </div>

          <h3 className="mt-5 font-semibold text-primary-950">
            Role configuration not loaded
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Application roles and their protected permissions will appear
            here after the security backend is implemented.
          </p>
        </div>
      </section>

      {/* Current Workspaces */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-primary-950">
          Current frontend workspaces
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          Aurevia currently separates several responsibilities into
          dedicated frontend workspaces. This separation prepares the UI for
          future backend authorization.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Workspace
            title="Customer"
            path="/customer"
          />

          <Workspace
            title="Event Coordinator"
            path="/event-coordinator"
          />

          <Workspace
            title="Cashier"
            path="/cashier"
          />

          <Workspace
            title="Inventory Manager"
            path="/inventory"
          />

          <Workspace
            title="HR Manager"
            path="/hr"
          />

          <Workspace
            title="Administrator"
            path="/admin"
          />
        </div>

        <p className="mt-5 text-xs leading-5 text-stone-500">
          These routes are currently frontend navigation structures, not
          security boundaries.
        </p>
      </section>

      {/* Security Flow */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Role-Based Access Control
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How protected access will work
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Login"
            text="The user submits credentials to the authentication service."
          />

          <FlowStep
            number="02"
            title="Authenticate"
            text="The backend verifies the user's identity."
          />

          <FlowStep
            number="03"
            title="Authorize"
            text="The backend checks whether the user's role permits the requested operation."
          />

          <FlowStep
            number="04"
            title="Access"
            text="The protected operation proceeds only when authorization succeeds."
          />
        </div>
      </section>

      {/* Important distinction */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
        <h2 className="font-semibold text-primary-950">
          Role visibility is not security
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
          Hiding an administrator button or route in React does not secure
          the underlying operation. Protected actions must be authorized by
          the backend because frontend code can be inspected or bypassed.
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

function Workspace({ title, path }) {
  return (
    <div className="rounded-xl bg-stone-50 p-5">
      <ShieldCheck className="h-5 w-5 text-primary-700" />

      <p className="mt-3 font-semibold text-primary-950">
        {title}
      </p>

      <p className="mt-1 text-sm text-stone-500">
        {path}
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