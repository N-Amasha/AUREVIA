import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardCheck,
  Info,
  ListChecks,
  Sparkles,
  UserRoundCheck,
  Users,
} from "lucide-react";

export default function HRDashboardPage() {
  const actions = [
    {
      title: "Staff",
      description:
        "Manage employee information and review staff records.",
      icon: Users,
      path: "/hr/staff",
    },
    {
      title: "Shifts",
      description:
        "Manage staff shift information and scheduling.",
      icon: CalendarDays,
      path: "/hr/shifts",
    },
    {
      title: "Staff Assignments",
      description:
        "Review staff assignments associated with restaurant and event operations.",
      icon: ListChecks,
      path: "/hr/assignments",
    },
    {
      title: "Attendance",
      description:
        "Review employee attendance information.",
      icon: ClipboardCheck,
      path: "/hr/attendance",
    },
    {
      title: "Leave Requests",
      description:
        "Review staff leave requests and their current status.",
      icon: UserRoundCheck,
      path: "/hr/leave",
    },
    {
      title: "Staff Allocation",
      description:
        "Review explainable staffing suggestions based on operational demand.",
      icon: Sparkles,
      path: "/hr/allocation",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          HR Manager Workspace
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Staff management dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Manage staff operations, scheduling, attendance and workforce
          allocation from one workspace.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Staff data not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Employee, shift, attendance, leave and assignment records will
              be retrieved from the Aurevia backend after database
              integration. No real staff records are currently displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Staff Members"
        />

        <SummaryCard
          icon={CalendarDays}
          label="Scheduled Shifts"
        />

        <SummaryCard
          icon={UserRoundCheck}
          label="Leave Requests"
        />

        <SummaryCard
          icon={Sparkles}
          label="Allocation Suggestions"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Staff Operations
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage workforce activities
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      {/* Workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Workforce Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From staff records to workforce allocation
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <FlowStep
            number="01"
            title="Manage Staff"
            text="Maintain employee information and staff roles."
          />

          <FlowStep
            number="02"
            title="Schedule"
            text="Organize shifts and operational staff assignments."
          />

          <FlowStep
            number="03"
            title="Monitor"
            text="Track attendance and review staff leave requests."
          />

          <FlowStep
            number="04"
            title="Allocate"
            text="Use operational demand to support future staffing recommendations."
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