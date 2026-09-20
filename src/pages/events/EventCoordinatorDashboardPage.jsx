import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  ListChecks,
  Store,
  Users,
} from "lucide-react";

export default function EventCoordinatorDashboardPage() {
  const actions = [
    {
      title: "Manage Events",
      description:
        "Review event records and manage coordination activities.",
      icon: CalendarDays,
      path: "/event-coordinator/events",
    },
    {
      title: "Event Timelines",
      description:
        "Track milestones, coordination tasks and event progress.",
      icon: ListChecks,
      path: "/event-coordinator/timelines",
    },
    {
      title: "Vendors",
      description:
        "Review vendors used to support event services.",
      icon: Store,
      path: "/event-coordinator/vendors",
    },
    {
      title: "Customer Feedback",
      description:
        "Review feedback and sentiment information from completed events.",
      icon: Users,
      path: "/event-coordinator/feedback",
    },
  ];

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Coordinator dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Manage Aurevia events, coordination timelines, vendors and
          customer feedback from one workspace.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Management dashboard preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Dashboard statistics and event records will be loaded from
              the backend after Event Coordination services are
              implemented.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Upcoming Events"
        />

        <SummaryCard
          icon={Clock3}
          label="In Coordination"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed Events"
        />

        <SummaryCard
          icon={Store}
          label="Active Vendors"
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Workspace
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Event management tools
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                  Open workspace →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Coordination Workflow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From confirmed booking to completed event
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <WorkflowStep
            number="01"
            title="Review Event"
            text="Review event and booking information."
          />

          <WorkflowStep
            number="02"
            title="Coordinate"
            text="Organize services, vendors and event requirements."
          />

          <WorkflowStep
            number="03"
            title="Update Timeline"
            text="Record progress and important coordination updates."
          />

          <WorkflowStep
            number="04"
            title="Complete"
            text="Complete the event and enable the feedback stage."
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

function WorkflowStep({ number, title, text }) {
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