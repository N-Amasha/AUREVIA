import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Info,
  ListChecks,
  UserRoundCheck,
  UserRound,
} from "lucide-react";

export default function StaffDetailsPage() {
  const { staffId } = useParams();

  return (
    <div>
      {/* Back */}
      <Link
        to="/hr/staff"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Staff
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Staff Management & Allocation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Staff member details
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review employee information and related workforce activity for a
          selected staff member.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Staff record not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This page is ready to load staff member{" "}
              <span className="font-semibold">{staffId}</span> from the
              Aurevia backend. No real employee record is currently loaded.
            </p>
          </div>
        </div>
      </section>

      {/* Employee Information */}
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <InfoCard
          icon={UserRound}
          title="Employee information"
          description="Basic information associated with the selected staff member."
          items={[
            ["Staff ID", staffId || "—"],
            ["Name", "—"],
            ["Role", "—"],
            ["Status", "—"],
          ]}
        />

        <InfoCard
          icon={UserRoundCheck}
          title="Employment information"
          description="Work-related information will be displayed here."
          items={[
            ["Contact", "—"],
            ["Joined Date", "—"],
            ["Current Shift", "—"],
            ["Availability", "—"],
          ]}
        />
      </section>

      {/* Workforce Overview */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-primary-950">
          Workforce overview
        </h2>

        <p className="mt-1 text-sm leading-6 text-stone-600">
          Related workforce records will be summarized here after backend
          integration.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={CalendarDays}
            label="Scheduled Shifts"
          />

          <OverviewCard
            icon={ListChecks}
            label="Assignments"
          />

          <OverviewCard
            icon={ClipboardCheck}
            label="Attendance"
          />

          <OverviewCard
            icon={UserRoundCheck}
            label="Leave Requests"
          />
        </div>
      </section>

      {/* Recent Assignments */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Recent assignments
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Restaurant and event assignments related to this employee
                will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-5 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
          <span>Assignment</span>
          <span>Type</span>
          <span>Date</span>
          <span>Status</span>
          <span>Reference</span>
        </div>

        <EmptySection
          icon={ListChecks}
          title="No assignment records available"
          text="Staff assignments will appear here after workforce records are connected to the backend."
        />
      </section>

      {/* Attendance */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Recent attendance
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Attendance information associated with this staff member
                will appear here.
              </p>
            </div>
          </div>
        </div>

        <EmptySection
          icon={ClipboardCheck}
          title="No attendance records available"
          text="Attendance history will appear here after backend integration."
        />
      </section>

      {/* Relationship explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Staff Record Relationships
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One employee connects to multiple workforce activities
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Employee"
            text="The employee record identifies the staff member."
          />

          <FlowStep
            number="02"
            title="Shift"
            text="Shift records describe when the employee is scheduled to work."
          />

          <FlowStep
            number="03"
            title="Assignment"
            text="Assignments describe operational tasks associated with the employee."
          />

          <FlowStep
            number="04"
            title="Attendance & Leave"
            text="Attendance and leave records support workforce availability management."
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description, items }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {label}
            </p>

            <p className="mt-2 break-words font-medium text-primary-950">
              {value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, label }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-3 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-primary-950">
        —
      </p>
    </div>
  );
}

function EmptySection({ icon: Icon, title, text }) {
  return (
    <div className="px-6 py-12 text-center">
      <Icon className="mx-auto h-7 w-7 text-stone-400" />

      <h3 className="mt-4 font-semibold text-primary-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {text}
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