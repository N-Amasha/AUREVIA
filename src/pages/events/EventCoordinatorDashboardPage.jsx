import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListChecks,
  MapPin,
  Store,
  Users,
} from "lucide-react";

import { getEventBookingsByStatus } from "../../api/reservationApi";
import {
  createEventFromBooking,
  getAllVendors,
  getEventsByStatus,
} from "../../api/eventApi";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(amount ?? 0));
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ??
    "Unable to complete the event coordination request."
  );
}

const emptyForm = {
  eventName: "",
  eventType: "",
  startTime: "",
  endTime: "",
  budget: "",
};

const inputStyles =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600";

export default function EventCoordinatorDashboardPage() {
  const [pendingBookings, setPendingBookings] =
    useState([]);
  const [plannedEvents, setPlannedEvents] =
    useState([]);
  const [confirmedEvents, setConfirmedEvents] =
    useState([]);
  const [completedEvents, setCompletedEvents] =
    useState([]);
  const [vendors, setVendors] = useState([]);
  const [planningId, setPlanningId] = useState(null);
  const [formData, setFormData] =
    useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [
          pendingBookingRecords,
          plannedEventRecords,
          confirmedEventRecords,
          completedEventRecords,
          vendorRecords,
        ] = await Promise.all([
          getEventBookingsByStatus("PENDING"),
          getEventsByStatus("PLANNED"),
          getEventsByStatus("CONFIRMED"),
          getEventsByStatus("COMPLETED"),
          getAllVendors(),
        ]);

        setPendingBookings(pendingBookingRecords);
        setPlannedEvents(plannedEventRecords);
        setConfirmedEvents(confirmedEventRecords);
        setCompletedEvents(completedEventRecords);
        setVendors(vendorRecords);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function openPlanningForm(booking) {
    setPlanningId(booking.eventBookingId);
    setFormData({
      eventName: `${booking.customerName} Event`,
      eventType: "",
      startTime: "",
      endTime: "",
      budget: "",
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  function closePlanningForm() {
    setPlanningId(null);
    setFormData(emptyForm);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage("");
  }

  async function handleCreateEvent(event, booking) {
    event.preventDefault();

    if (
      !formData.eventName.trim() ||
      !formData.eventType ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.budget
    ) {
      setErrorMessage(
        "Complete all event-planning fields.",
      );
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setErrorMessage(
        "Event end time must be later than start time.",
      );
      return;
    }

    if (Number(formData.budget) < 0) {
      setErrorMessage("Budget cannot be negative.");
      return;
    }

    try {
      setCreating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const createdEvent =
        await createEventFromBooking({
          eventBookingId: booking.eventBookingId,
          eventName: formData.eventName.trim(),
          eventType: formData.eventType,
          startTime: formData.startTime,
          endTime: formData.endTime,
          budget: Number(formData.budget),
        });

      setPendingBookings((current) =>
        current.filter(
          (record) =>
            record.eventBookingId !==
            booking.eventBookingId,
        ),
      );

      setPlannedEvents((current) => [
        ...current,
        createdEvent,
      ]);

      closePlanningForm();

      setSuccessMessage(
        `Event EVT-${createdEvent.eventId} was created from VEN-${booking.eventBookingId}.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setCreating(false);
    }
  }

  const actions = [
    {
      title: "Manage Events",
      description:
        "Review coordinated events and open their management records.",
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
        "Review ratings and sentiment information from completed events.",
      icon: Users,
      path: "/event-coordinator/feedback",
    },
  ];

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Coordinator dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review new customer venue bookings, create
          coordination records and manage event progress.
        </p>
      </section>

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={Clock3}
          label="New Requests"
          value={pendingBookings.length}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Planned Events"
          value={plannedEvents.length}
        />

        <SummaryCard
          icon={Clock3}
          label="Confirmed Events"
          value={confirmedEvents.length}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed Events"
          value={completedEvents.length}
        />

        <SummaryCard
          icon={Store}
          label="Available Vendors"
          value={vendors.length}
        />
      </section>

      <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Customer Requests
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            New event venue bookings
          </h2>

          <p className="mt-2 text-sm text-stone-600">
            Pending customer bookings awaiting event
            coordination.
          </p>
        </div>

        {loading && (
          <div className="px-6 py-12 text-center text-sm text-stone-600">
            Loading customer event requests...
          </div>
        )}

        {!loading && pendingBookings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-green-600" />

            <h3 className="mt-4 font-semibold text-primary-950">
              No pending event requests
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              New customer venue bookings will appear here
              automatically.
            </p>
          </div>
        )}

        {!loading &&
          pendingBookings.map((booking) => (
            <article
              key={booking.eventBookingId}
              className="border-b border-stone-200 p-6 last:border-b-0"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-primary-950">
                      VEN-{booking.eventBookingId}
                    </h3>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      PENDING
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-semibold text-stone-800">
                    {booking.venueName}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                    <MapPin className="h-4 w-4" />
                    {booking.venueLocation}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail
                      label="Customer"
                      value={booking.customerName}
                    />

                    <Detail
                      label="Event Date"
                      value={booking.bookingDate}
                    />

                    <Detail
                      label="Guests"
                      value={booking.guestCount}
                    />

                    <Detail
                      label="Booking Total"
                      value={formatCurrency(
                        booking.totalAmount,
                      )}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openPlanningForm(booking)
                  }
                  className="rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                >
                  Accept and Plan Event
                </button>
              </div>

              {planningId ===
                booking.eventBookingId && (
                <form
                  onSubmit={(event) =>
                    handleCreateEvent(
                      event,
                      booking,
                    )
                  }
                  className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-6"
                >
                  <h4 className="font-semibold text-primary-950">
                    Create coordination record
                  </h4>

                  <p className="mt-1 text-sm text-primary-800">
                    Event date {booking.bookingDate} and{" "}
                    {booking.guestCount} guests will be
                    copied from VEN-
                    {booking.eventBookingId}.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <FormField label="Event Name">
                      <input
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleFormChange}
                        className={inputStyles}
                      />
                    </FormField>

                    <FormField label="Event Type">
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleFormChange}
                        className={inputStyles}
                      >
                        <option value="">
                          Select event type
                        </option>
                        <option value="WEDDING">
                          Wedding
                        </option>
                        <option value="BIRTHDAY">
                          Birthday
                        </option>
                        <option value="CORPORATE">
                          Corporate
                        </option>
                        <option value="PRIVATE_DINNER">
                          Private Dinner
                        </option>
                        <option value="FAMILY_EVENT">
                          Family Event
                        </option>
                      </select>
                    </FormField>

                    <FormField label="Start Time">
                      <input
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleFormChange}
                        className={inputStyles}
                      />
                    </FormField>

                    <FormField label="End Time">
                      <input
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleFormChange}
                        className={inputStyles}
                      />
                    </FormField>

                    <FormField label="Budget (LKR)">
                      <input
                        name="budget"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.budget}
                        onChange={handleFormChange}
                        className={inputStyles}
                      />
                    </FormField>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={creating}
                      className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {creating
                        ? "Creating Event..."
                        : "Create Event"}
                    </button>

                    <button
                      type="button"
                      disabled={creating}
                      onClick={closePlanningForm}
                      className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </article>
          ))}
      </section>

      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Workspace
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Event management tools
        </h2>

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
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-primary-950">
        {value}
      </p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="text-sm font-medium text-stone-700">
      {label}

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}