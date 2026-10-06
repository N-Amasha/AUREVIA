import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Clock3,
  ListChecks,
  MapPin,
  MessageSquareHeart,
  Pencil,
  Plus,
  Store,
  Trash2,
  Users,
  Wrench,
  X,
} from "lucide-react";

import {
  createEventService,
  deleteEventService,
  getAllVendors,
  getEventById,
  getEventServiceTotalCost,
  getReviewsByEvent,
  getServicesByEvent,
  getTimelinesByEvent,
  updateEventService,
} from "../../api/eventApi";
import { getEventBookingById } from "../../api/reservationApi";

const EMPTY_SERVICE_FORM = {
  vendorId: "",
  serviceName: "",
  serviceDate: "",
  startTime: "",
  endTime: "",
  cost: "",
  serviceStatus: "PLANNED",
};

export default function CoordinatorEventDetailsPage() {
  const { eventId } = useParams();

  const [eventRecord, setEventRecord] = useState(null);
  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [serviceCost, setServiceCost] = useState(0);

  const [serviceForm, setServiceForm] = useState(
    EMPTY_SERVICE_FORM,
  );
  const [editingServiceId, setEditingServiceId] =
    useState(null);
  const [formVisible, setFormVisible] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] =
    useState("");
  const [actionError, setActionError] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadEventDetails() {
      try {
        setLoading(true);
        setLoadError("");

        const loadedEvent = await getEventById(eventId);

        const [
          loadedBooking,
          loadedServices,
          loadedTimelines,
          loadedReviews,
          loadedServiceCost,
          loadedVendors,
        ] = await Promise.all([
          getEventBookingById(
            loadedEvent.eventBookingId,
          ),
          getServicesByEvent(loadedEvent.eventId),
          getTimelinesByEvent(loadedEvent.eventId),
          getReviewsByEvent(loadedEvent.eventId),
          getEventServiceTotalCost(
            loadedEvent.eventId,
          ),
          getAllVendors(),
        ]);

        if (!active) {
          return;
        }

        setEventRecord(loadedEvent);
        setBooking(loadedBooking);
        setServices(
          Array.isArray(loadedServices)
            ? loadedServices
            : [],
        );
        setTimelines(
          Array.isArray(loadedTimelines)
            ? loadedTimelines
            : [],
        );
        setReviews(
          Array.isArray(loadedReviews)
            ? loadedReviews
            : [],
        );
        setVendors(
          Array.isArray(loadedVendors)
            ? loadedVendors
            : [],
        );
        setServiceCost(loadedServiceCost ?? 0);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          getErrorMessage(
            error,
            "Unable to load event details.",
          ),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEventDetails();

    return () => {
      active = false;
    };
  }, [eventId]);

  async function refreshServices() {
    const [loadedServices, loadedServiceCost] =
      await Promise.all([
        getServicesByEvent(eventRecord.eventId),
        getEventServiceTotalCost(
          eventRecord.eventId,
        ),
      ]);

    setServices(
      Array.isArray(loadedServices)
        ? loadedServices
        : [],
    );
    setServiceCost(loadedServiceCost ?? 0);
  }

  function openCreateForm() {
    setEditingServiceId(null);
    setServiceForm({
      ...EMPTY_SERVICE_FORM,
      serviceDate: eventRecord.eventDate,
    });
    setActionError("");
    setSuccessMessage("");
    setFormVisible(true);
  }

  function openEditForm(service) {
    setEditingServiceId(service.eventServiceId);
    setServiceForm({
      vendorId: String(service.vendorId),
      serviceName: service.serviceName ?? "",
      serviceDate:
        service.serviceDate
        ?? eventRecord.eventDate,
      startTime: normalizeTimeForInput(
        service.startTime,
      ),
      endTime: normalizeTimeForInput(
        service.endTime,
      ),
      cost: String(service.cost ?? ""),
      serviceStatus:
        service.serviceStatus ?? "PLANNED",
    });
    setActionError("");
    setSuccessMessage("");
    setFormVisible(true);
  }

  function closeServiceForm() {
    if (submitting) {
      return;
    }

    setFormVisible(false);
    setEditingServiceId(null);
    setServiceForm(EMPTY_SERVICE_FORM);
    setActionError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setServiceForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleServiceSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const payload = {
        vendorId: Number(serviceForm.vendorId),
        serviceName:
          serviceForm.serviceName.trim(),
        serviceDate: serviceForm.serviceDate,
        startTime: serviceForm.startTime,
        endTime: serviceForm.endTime,
        cost: Number(serviceForm.cost),
      };

      if (editingServiceId) {
        await updateEventService(
          editingServiceId,
          {
            ...payload,
            serviceStatus:
              serviceForm.serviceStatus,
          },
        );

        setSuccessMessage(
          "Event service updated successfully.",
        );
      } else {
        await createEventService({
          eventId: eventRecord.eventId,
          ...payload,
        });

        setSuccessMessage(
          "Event service created successfully.",
        );
      }

      await refreshServices();

      setFormVisible(false);
      setEditingServiceId(null);
      setServiceForm(EMPTY_SERVICE_FORM);
    } catch (error) {
      setActionError(
        getErrorMessage(
          error,
          editingServiceId
            ? "Unable to update the event service."
            : "Unable to create the event service.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteService(service) {
    const confirmed = window.confirm(
      `Delete "${service.serviceName}" from this event?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(service.eventServiceId);
    setActionError("");
    setSuccessMessage("");

    try {
      await deleteEventService(
        service.eventServiceId,
      );

      await refreshServices();

      setSuccessMessage(
        "Event service deleted successfully.",
      );

      if (
        editingServiceId
        === service.eventServiceId
      ) {
        closeServiceForm();
      }
    } catch (error) {
      setActionError(
        getErrorMessage(
          error,
          "Unable to delete the event service.",
        ),
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
        Loading event details...
      </div>
    );
  }

  if (loadError || !eventRecord) {
    return (
      <div>
        <Link
          to="/event-coordinator/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Event details could not be loaded
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  const eventCompleted =
    eventRecord.eventStatus?.toUpperCase()
    === "COMPLETED";

  return (
    <div>
      <Link
        to="/event-coordinator/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <section className="mt-7">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Event Coordination
          </p>

          <StatusBadge
            status={eventRecord.eventStatus}
          />
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          {eventRecord.eventName}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review the booking, manage event services,
          coordinate vendors and monitor event progress.
        </p>
      </section>

      {successMessage && (
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
          {successMessage}
        </section>
      )}

      {actionError && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Action could not be completed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {actionError}
          </p>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Event Overview
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Event information
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={CalendarDays}
            label="Event Date"
            value={formatDate(
              eventRecord.eventDate,
            )}
          />

          <InfoCard
            icon={Clock3}
            label="Event Time"
            value={`${formatTime(
              eventRecord.startTime,
            )} – ${formatTime(
              eventRecord.endTime,
            )}`}
          />

          <InfoCard
            icon={Users}
            label="Expected Guests"
            value={String(
              eventRecord.numberOfGuests,
            )}
          />

          <InfoCard
            icon={MapPin}
            label="Venue"
            value={
              booking?.venueName
              ?? "Not available"
            }
          />

          <InfoCard
            icon={Users}
            label="Customer"
            value={
              booking?.customerName
              ?? "Not available"
            }
          />

          <InfoCard
            icon={Wrench}
            label="Event Type"
            value={formatLabel(
              eventRecord.eventType,
            )}
          />

          <InfoCard
            icon={Store}
            label="Coordinator"
            value={eventRecord.coordinatorName}
          />

          <InfoCard
            icon={Banknote}
            label="Event Budget"
            value={formatCurrency(
              eventRecord.budget,
            )}
          />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Wrench className="mt-1 h-5 w-5 text-primary-700" />

              <div>
                <h2 className="font-semibold text-primary-950">
                  Event services
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Create and manage vendor-service
                  assignments for this event.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              disabled={eventCompleted}
              title={
                eventCompleted
                  ? "Completed events cannot receive new services."
                  : "Add an event service"
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>

          {formVisible && (
            <ServiceForm
              form={serviceForm}
              vendors={vendors}
              editing={Boolean(editingServiceId)}
              submitting={submitting}
              onChange={handleFormChange}
              onSubmit={handleServiceSubmit}
              onCancel={closeServiceForm}
            />
          )}

          {services.length === 0 ? (
            <EmptyPanel
              title="No services available"
              text="Use Add Service to assign a vendor and service to this event."
            />
          ) : (
            <div className="divide-y divide-stone-200">
              {services.map((service) => {
                const completed =
                  service.serviceStatus
                    ?.toUpperCase()
                  === "COMPLETED";

                return (
                  <div
                    key={service.eventServiceId}
                    className="p-6"
                  >
                    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_180px]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-primary-950">
                            {service.serviceName}
                          </p>

                          <StatusBadge
                            status={
                              service.serviceStatus
                            }
                          />
                        </div>

                        <p className="mt-2 text-sm font-medium text-stone-700">
                          {service.vendorName}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {formatLabel(
                            service.vendorType,
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-600">
                          <span>
                            {formatDate(
                              service.serviceDate,
                            )}
                          </span>

                          <span>
                            {formatTime(
                              service.startTime,
                            )}
                            {" – "}
                            {formatTime(
                              service.endTime,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-semibold text-primary-950">
                          {formatCurrency(
                            service.cost,
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(service)
                            }
                            disabled={completed}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-primary-300 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteService(
                                service,
                              )
                            }
                            disabled={
                              completed
                              || deletingId
                                === service.eventServiceId
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />

                            {deletingId
                              === service.eventServiceId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>

                        {completed && (
                          <p className="mt-2 text-xs text-stone-500">
                            Completed services are locked.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-primary-950 p-6 text-white">
          <Banknote className="h-6 w-6 text-gold-400" />

          <p className="mt-5 text-sm text-stone-300">
            Total Service Cost
          </p>

          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(serviceCost)}
          </p>

          <p className="mt-5 text-sm text-stone-300">
            Event Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            {formatCurrency(eventRecord.budget)}
          </p>

          <p className="mt-5 text-sm text-stone-300">
            Remaining Budget
          </p>

          <p className="mt-2 text-xl font-semibold text-gold-400">
            {formatCurrency(
              Number(eventRecord.budget)
              - Number(serviceCost),
            )}
          </p>

          <p className="mt-5 text-sm leading-6 text-stone-300">
            The backend prevents the combined service
            cost from exceeding the event budget.
          </p>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Event timeline
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Coordination milestones and progress
                updates.
              </p>
            </div>
          </div>
        </div>

        {timelines.length === 0 ? (
          <EmptyPanel
            title="No timeline milestones"
            text="No timeline records are available for this event."
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {timelines.map((timeline) => (
              <div
                key={timeline.timelineId}
                className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_200px_140px]"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {timeline.milestoneName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {timeline.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Scheduled
                  </p>

                  <p className="mt-2 text-sm text-stone-700">
                    {formatDateTime(
                      timeline.scheduledDate,
                    )}
                  </p>
                </div>

                <div>
                  <StatusBadge
                    status={timeline.status}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <MessageSquareHeart className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Customer feedback
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Ratings, comments and sentiment results
                associated with this event.
              </p>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <EmptyPanel
            title="No feedback available"
            text="No customer reviews are associated with this event."
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_120px_140px]"
              >
                <div>
                  <p className="font-semibold text-primary-950">
                    {review.customerName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {review.comment
                      || "No written comment provided."}
                  </p>

                  <p className="mt-2 text-xs text-stone-500">
                    {formatDateTime(
                      review.reviewDate,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Rating
                  </p>

                  <p className="mt-2 font-semibold text-primary-950">
                    {review.rating} / 5
                  </p>
                </div>

                <div>
                  <SentimentBadge
                    sentiment={review.sentiment}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ServiceForm({
  form,
  vendors,
  editing,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-b border-stone-200 bg-cream-50 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-primary-950">
            {editing
              ? "Edit event service"
              : "Add event service"}
          </h3>

          <p className="mt-1 text-sm text-stone-600">
            Assign a vendor and define the service
            schedule and cost.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg p-2 text-stone-500 transition hover:bg-white hover:text-primary-900"
          aria-label="Close service form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <FormField label="Vendor">
          <select
            name="vendorId"
            value={form.vendorId}
            onChange={onChange}
            required
            className={inputClassName}
          >
            <option value="">
              Select a vendor
            </option>

            {vendors.map((vendor) => (
              <option
                key={vendor.vendorId}
                value={vendor.vendorId}
              >
                {vendor.vendorName} —{" "}
                {formatLabel(vendor.vendorType)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Service Name">
          <input
            type="text"
            name="serviceName"
            value={form.serviceName}
            onChange={onChange}
            required
            maxLength={150}
            placeholder="Example: Floral decoration"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Service Date">
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={onChange}
            required
            className={inputClassName}
          />
        </FormField>

        <FormField label="Cost (LKR)">
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={onChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Start Time">
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={onChange}
            required
            className={inputClassName}
          />
        </FormField>

        <FormField label="End Time">
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={onChange}
            required
            className={inputClassName}
          />
        </FormField>

        {editing && (
          <FormField label="Service Status">
            <select
              name="serviceStatus"
              value={form.serviceStatus}
              onChange={onChange}
              required
              className={inputClassName}
            >
              <option value="PLANNED">
                Planned
              </option>
              <option value="CONFIRMED">
                Confirmed
              </option>
              <option value="COMPLETED">
                Completed
              </option>
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </FormField>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {submitting
            ? "Saving..."
            : editing
              ? "Update Service"
              : "Create Service"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-primary-300 hover:text-primary-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

function FormField({ label, children }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      {children}
    </label>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-cream-50 p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div className="m-6 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-7 text-center">
      <p className="text-sm font-medium text-stone-700">
        {title}
      </p>

      <p className="mt-2 text-xs text-stone-500">
        {text}
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
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-200",
    IN_PROGRESS:
      "bg-blue-50 text-blue-700 ring-blue-200",
    CANCELLED:
      "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[normalizedStatus]
        ?? "bg-stone-100 text-stone-700 ring-stone-200"
      }`}
    >
      {formatLabel(normalizedStatus)}
    </span>
  );
}

function SentimentBadge({ sentiment }) {
  const normalizedSentiment =
    sentiment?.toUpperCase() ?? "PENDING";

  const styles = {
    POSITIVE:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    NEUTRAL:
      "bg-stone-100 text-stone-700 ring-stone-200",
    NEGATIVE:
      "bg-red-50 text-red-700 ring-red-200",
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[normalizedSentiment]
        ?? styles.PENDING
      }`}
    >
      {formatLabel(normalizedSentiment)}
    </span>
  );
}

function normalizeTimeForInput(value) {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
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
        word.charAt(0).toUpperCase()
        + word.slice(1),
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

function formatTime(value) {
  if (!value) {
    return "Not available";
  }

  return value.slice(0, 5);
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function getErrorMessage(error, fallbackMessage) {
  const validationErrors =
    error.response?.data?.validationErrors;

  if (
    validationErrors
    && typeof validationErrors === "object"
  ) {
    const firstValidationMessage =
      Object.values(validationErrors)[0];

    if (firstValidationMessage) {
      return firstValidationMessage;
    }
  }

  return (
    error.response?.data?.message
    || fallbackMessage
  );
}