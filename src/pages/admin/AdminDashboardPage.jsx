import { Link } from "react-router-dom";
import {
  BarChart3,
  Info,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const actions = [
    {
      title: "User Management",
      description:
        "Review system user accounts and account information.",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Roles & Access",
      description:
        "Review application roles used to separate Aurevia responsibilities.",
      icon: ShieldCheck,
      path: "/admin/roles",
    },
    {
      title: "Reports",
      description:
        "Access future operational and management reporting.",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Settings",
      description:
        "Review system configuration options available to administrators.",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          System Administration
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Administrator dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Manage Aurevia users, application roles, reporting and system
          configuration from the administrator workspace.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Administration backend not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              User records, authorization data, reports and configuration
              will be connected after the Spring Boot backend and security
              layer are implemented. The current workspace is frontend only.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} label="System Users" />
        <SummaryCard icon={ShieldCheck} label="Application Roles" />
        <SummaryCard icon={BarChart3} label="Available Reports" />
        <SummaryCard icon={Settings} label="System Settings" />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Administration
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage the Aurevia platform
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Security */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Administration & Security
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Frontend visibility is not authorization
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Authenticate"
            text="The future backend verifies the user's identity."
          />

          <FlowStep
            number="02"
            title="Identify Role"
            text="The authenticated account is associated with authorized application responsibilities."
          />

          <FlowStep
            number="03"
            title="Authorize"
            text="Spring Security will determine whether the user may access protected operations."
          />

          <FlowStep
            number="04"
            title="Perform Action"
            text="Only authorized requests should reach protected administrative functionality."
          />
        </div>
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