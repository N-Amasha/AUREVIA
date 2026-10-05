import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
} from "lucide-react";

import { getEventsByStatus } from "../../api/eventApi";

const EVENT_STATUSES = [
  "PLANNED",
  "CONFIRMED",
  "COMPLETED",
];

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setLoadError("");

        const eventGroups = await Promise.all(
          EVENT_STATUSES.map((status) =>
            getEventsByStatus(status),
          ),
        );

        if (!active) {
          return;
        }

        const uniqueEvents = Array.from(
          new Map(
            eventGroups
              .flat()
              .map((event) => [event.eventId, event]),
          ).values(),
        ).sort(
          (firstEvent, secondEvent) =>
            new Date(firstEvent.eventDate) -
            new Date(secondEvent.eventDate),
        );

        setEvents(uniqueEvents);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error.response?.data?.message ??
            "Unable to load event records.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(
    () => ({
      planned: events.filter(
        (event) =>
          event.eventStatus?.toUpperCase() ===
          "PLANNED",
      ).length,
      confirmed: events.filter(
        (event) =>
          event.eventStatus?.toUpperCase() ===
          "CONFIRMED",
      ).length,
      completed: events.filter(
        (event) =>
          event.eventStatus?.toUpperCase() ===
          "COMPLETED",
      ).length,
    }),
    [events],
  );

  const filteredEvents = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !normalizedSearch ||
        event.eventName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        event.eventType
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        event.coordinatorName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        String(event.eventId).includes(
          normalizedSearch,
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        event.eventStatus?.toUpperCase() ===
          statusFilter;

      const matchesDate =
        !dateFilter ||
        event.eventDate === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    events,
    searchTerm,
    statusFilter,
    dateFilter,
  ]);

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Manage events
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review event records, monitor coordination status
          and open individual events for further management.
        </p>
      </section>

      {loadError && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800">
            Event records could not be loaded
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {loadError}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CalendarDays}
          label="Planned Events"
          value={summary.planned}
          loading={loading}
        />

        <SummaryCard
          icon={Clock3}
          label="Confirmed Events"
          value={summary.confirmed}
          loading={loading}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed Events"
          value={summary.completed}
          loading={loading}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search event, type or coordinator"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="CONFIRMED">
              Confirmed
            </option>
            <option value="COMPLETED">
              Completed
            </option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
          />
        </div>

        <p className="mt-3 text-xs text-stone-500">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1
            ? "event"
            : "events"}{" "}
          found.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Event records
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            Events available for coordination and progress
            monitoring.
          </p>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Event</span>
          <span>Type</span>
          <span>Date</span>
          <span>Coordinator</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-stone-500">
            Loading event records…
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <CalendarDays className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No matching events
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No event records match the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredEvents.map((event) => (
              <div
                key={event.eventId}
                className="grid gap-4 px-6 py-5 lg:grid-cols-6 lg:items-center"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {event.eventName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    EVT-{event.eventId}
                  </p>
                </div>

                <p className="text-sm text-stone-700">
                  {formatLabel(event.eventType)}
                </p>

                <p className="text-sm text-stone-700">
                  {formatDate(event.eventDate)}
                </p>

                <p className="text-sm text-stone-700">
                  {event.coordinatorName}
                </p>

                <div>
                  <StatusBadge
                    status={event.eventStatus}
                  />
                </div>

                <Link
                  to={`/event-coordinator/events/${event.eventId}`}
                  className="text-sm font-semibold text-primary-700 hover:text-primary-950"
                >
                  View event →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-primary-950">
          Event management flow
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FlowItem
            number="01"
            text="Open event record"
          />
          <FlowItem
            number="02"
            text="Review requirements"
          />
          <FlowItem
            number="03"
            text="Coordinate services and timeline"
          />
          <FlowItem
            number="04"
            text="Track event completion"
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
    PLANNED:
      "bg-blue-50 text-blue-700 ring-blue-200",
    CONFIRMED:
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

function FlowItem({ number, text }) {
  return (
    <div className="rounded-xl bg-cream-50 p-4">
      <p className="text-xs font-bold text-gold-600">
        {number}
      </p>

      <p className="mt-2 text-sm font-medium text-primary-950">
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

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}