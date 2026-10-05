import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  Search,
} from "lucide-react";

import {
  getEventsByStatus,
  getTimelinesByEvent,
  updateTimelineStatus,
} from "../../api/eventApi";

const EVENT_STATUSES = [
  "PLANNED",
  "CONFIRMED",
  "COMPLETED",
];

export default function EventTimelinesPage() {
  const [timelines, setTimelines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadTimelines() {
      try {
        setLoading(true);
        setLoadError("");

        const eventGroups = await Promise.all(
          EVENT_STATUSES.map((status) =>
            getEventsByStatus(status),
          ),
        );

        const uniqueEvents = Array.from(
          new Map(
            eventGroups
              .flat()
              .map((event) => [event.eventId, event]),
          ).values(),
        );

        const timelineGroups = await Promise.all(
          uniqueEvents.map((event) =>
            getTimelinesByEvent(event.eventId),
          ),
        );

        if (!active) {
          return;
        }

        const loadedTimelines = timelineGroups
          .flat()
          .sort(
            (firstTimeline, secondTimeline) =>
              new Date(firstTimeline.scheduledDate) -
              new Date(secondTimeline.scheduledDate),
          );

        setTimelines(loadedTimelines);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error.response?.data?.message ??
            "Unable to load timeline records.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTimelines();

    return () => {
      active = false;
    };
  }, []);

  const eventOptions = useMemo(
    () =>
      Array.from(
        new Map(
          timelines.map((timeline) => [
            timeline.eventId,
            timeline.eventName,
          ]),
        ).entries(),
      ),
    [timelines],
  );

  const summary = useMemo(
    () => ({
      total: timelines.length,
      pending: timelines.filter(
        (timeline) =>
          timeline.status?.toUpperCase() ===
          "PENDING",
      ).length,
      completed: timelines.filter(
        (timeline) =>
          timeline.status?.toUpperCase() ===
          "COMPLETED",
      ).length,
    }),
    [timelines],
  );

  const filteredTimelines = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return timelines.filter((timeline) => {
      const matchesSearch =
        !normalizedSearch ||
        timeline.milestoneName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        timeline.eventName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        timeline.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesEvent =
        eventFilter === "ALL" ||
        String(timeline.eventId) === eventFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        timeline.status?.toUpperCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesEvent &&
        matchesStatus
      );
    });
  }, [
    timelines,
    searchTerm,
    eventFilter,
    statusFilter,
  ]);

  async function handleStatusUpdate(
    timelineId,
    nextStatus,
  ) {
    try {
      setUpdatingId(timelineId);
      setLoadError("");
      setSuccessMessage("");

      const updatedTimeline =
        await updateTimelineStatus(
          timelineId,
          {
            status: nextStatus,
          },
        );

      setTimelines((currentTimelines) =>
        currentTimelines.map((timeline) =>
          timeline.timelineId === timelineId
            ? updatedTimeline
            : timeline,
        ),
      );

      setSuccessMessage(
        `Timeline activity updated to ${formatLabel(
          nextStatus,
        )}.`,
      );
    } catch (error) {
      setLoadError(
        error.response?.data?.message ??
          "Unable to update the timeline status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Event timelines
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Track coordination activities, milestones and
          progress updates across Aurevia events.
        </p>
      </section>

      {loadError && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            {loadError}
          </p>
        </section>
      )}

      {successMessage && (
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ListChecks}
          label="Timeline Activities"
          value={summary.total}
          loading={loading}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending"
          value={summary.pending}
          loading={loading}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={summary.completed}
          loading={loading}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search activity or event"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600"
            />
          </div>

          <select
            value={eventFilter}
            onChange={(event) =>
              setEventFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          >
            <option value="ALL">All Events</option>

            {eventOptions.map(
              ([eventId, eventName]) => (
                <option
                  key={eventId}
                  value={String(eventId)}
                >
                  {eventName}
                </option>
              ),
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">
              Completed
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs text-stone-500">
          {filteredTimelines.length} timeline{" "}
          {filteredTimelines.length === 1
            ? "activity"
            : "activities"}{" "}
          found.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Coordination timeline
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Live timeline records retrieved from the
                Event Coordination service.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Event</span>
          <span>Milestone</span>
          <span>Scheduled</span>
          <span>Last Updated</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-500">
            Loading timeline activities…
          </div>
        ) : filteredTimelines.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-primary-700" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No matching activities
            </h3>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredTimelines.map((timeline) => {
              const isCompleted =
                timeline.status?.toUpperCase() ===
                "COMPLETED";

              const nextStatus = isCompleted
                ? "PENDING"
                : "COMPLETED";

              return (
                <div
                  key={timeline.timelineId}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-6 lg:items-center"
                >
                  <div>
                    <p className="font-semibold text-primary-950">
                      {timeline.eventName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      EVT-{timeline.eventId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {timeline.milestoneName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {timeline.description}
                    </p>
                  </div>

                  <p className="text-sm text-stone-700">
                    {formatDateTime(
                      timeline.scheduledDate,
                    )}
                  </p>

                  <p className="text-sm text-stone-700">
                    {formatDateTime(
                      timeline.updatedDate,
                    )}
                  </p>

                  <div>
                    <StatusBadge
                      status={timeline.status}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={
                      updatingId === timeline.timelineId
                    }
                    onClick={() =>
                      handleStatusUpdate(
                        timeline.timelineId,
                        nextStatus,
                      )
                    }
                    className="rounded-xl border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === timeline.timelineId
                      ? "Updating…"
                      : isCompleted
                        ? "Mark Pending"
                        : "Mark Completed"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Timeline Purpose
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Track event coordination progress
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TimelinePurpose
            number="01"
            title="Create"
            text="Record a coordination milestone for an event."
          />

          <TimelinePurpose
            number="02"
            title="Track"
            text="Follow the current progress of the milestone."
          />

          <TimelinePurpose
            number="03"
            title="Update"
            text="Update its status as coordination work progresses."
          />

          <TimelinePurpose
            number="04"
            title="Complete"
            text="Mark the milestone complete after finishing the work."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toUpperCase() ?? "UNKNOWN";

  const styles = {
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-200",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[normalizedStatus] ??
        "bg-stone-100 text-stone-700 ring-stone-200"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
  );
}

function TimelinePurpose({
  number,
  title,
  text,
}) {
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

function formatLabel(value) {
  if (!value) {
    return "Not available";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}