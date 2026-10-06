import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import {
  createVenue,
  deleteVenue,
  getAllEventBookings,
  getAllVenues,
  updateVenue,
} from "../../api/reservationApi";

const emptyForm = {
  venueName: "",
  availabilityStatus: "AVAILABLE",
  capacity: "",
  location: "",
  venueType: "",
  basePrice: "",
};

export default function VenueManagementPage() {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [formData, setFormData] =
    useState(emptyForm);
  const [editingVenueId, setEditingVenueId] =
    useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [venueData, bookingData] =
        await Promise.all([
          getAllVenues(),
          getAllEventBookings(),
        ]);

      setVenues(
        Array.isArray(venueData) ? venueData : [],
      );

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : [],
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to load venue records.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  const bookingCounts = useMemo(
    () =>
      bookings.reduce((counts, booking) => {
        counts[booking.venueId] =
          (counts[booking.venueId] || 0) + 1;

        return counts;
      }, {}),
    [bookings],
  );

  const totalCapacity = useMemo(
    () =>
      venues.reduce(
        (total, venue) =>
          total + Number(venue.capacity || 0),
        0,
      ),
    [venues],
  );

  const venueTypes = useMemo(
    () =>
      [
        ...new Set(
          venues
            .map((venue) => venue.venueType)
            .filter(Boolean),
        ),
      ].sort(),
    [venues],
  );

  const filteredVenues = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return venues.filter((venue) => {
      const matchesSearch =
        !normalizedSearch ||
        venue.venueName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        venue.location
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        venue.venueType
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesType =
        typeFilter === "ALL" ||
        venue.venueType === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        venue.availabilityStatus === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    venues,
    searchTerm,
    typeFilter,
    statusFilter,
  ]);

  function openCreateForm() {
    setEditingVenueId(null);
    setFormData(emptyForm);
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function openEditForm(venue) {
    setEditingVenueId(venue.venueId);
    setFormData({
      venueName: venue.venueName,
      availabilityStatus:
        venue.availabilityStatus,
      capacity: String(venue.capacity),
      location: venue.location,
      venueType: venue.venueType,
      basePrice: String(venue.basePrice),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingVenueId(null);
    setFormData(emptyForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const request = {
        venueName: formData.venueName,
        availabilityStatus:
          formData.availabilityStatus,
        capacity: Number(formData.capacity),
        location: formData.location,
        venueType: formData.venueType,
        basePrice: Number(formData.basePrice),
      };

      if (editingVenueId) {
        await updateVenue(
          editingVenueId,
          request,
        );

        setSuccessMessage(
          `${request.venueName} was updated successfully.`,
        );
      } else {
        await createVenue(request);

        setSuccessMessage(
          `${request.venueName} was created successfully.`,
        );
      }

      closeForm();
      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to save the venue.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(venue) {
    const confirmed = window.confirm(
      `Delete venue ${venue.venueName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteVenue(venue.venueId);

      setSuccessMessage(
        `${venue.venueName} was deleted successfully.`,
      );

      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to delete the venue.",
        ),
      );
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Reservation Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Venue management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage venue capacity, pricing and
            operational availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Venue
        </button>
      </section>

      {errorMessage && (
        <MessageBox
          error
          message={errorMessage}
        />
      )}

      {successMessage && (
        <MessageBox message={successMessage} />
      )}

      {/* Form */}
      {showForm && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                {editingVenueId
                  ? "Edit venue"
                  : "Add venue"}
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Enter the venue's operational details.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <FormField label="Venue Name">
              <input
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Viva Test Hall"
                className={inputClass}
              />
            </FormField>

            <FormField label="Venue Type">
              <input
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                required
                maxLength={50}
                placeholder="BANQUET"
                className={inputClass}
              />
            </FormField>

            <FormField label="Capacity">
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className={inputClass}
              />
            </FormField>

            <FormField label="Base Price">
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={inputClass}
              />
            </FormField>

            <FormField label="Location">
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                maxLength={150}
                className={inputClass}
              />
            </FormField>

            <FormField label="Status">
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="AVAILABLE">
                  Available
                </option>
                <option value="MAINTENANCE">
                  Maintenance
                </option>
              </select>
            </FormField>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingVenueId
                    ? "Save Changes"
                    : "Create Venue"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Building2}
          label="Event Venues"
          value={loading ? "…" : venues.length}
        />

        <SummaryCard
          icon={Users}
          label="Total Venue Capacity"
          value={loading ? "…" : totalCapacity}
        />

        <SummaryCard
          icon={CalendarCheck}
          label="Venue Bookings"
          value={loading ? "…" : bookings.length}
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search venue or location"
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className={inputClass}
          >
            <option value="ALL">All Venue Types</option>

            {venueTypes.map((type) => (
              <option key={type} value={type}>
                {formatLabel(type)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className={inputClass}
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">
              Available
            </option>
            <option value="MAINTENANCE">
              Maintenance
            </option>
          </select>
        </div>
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-primary-950">
            Event venues
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            {loading
              ? "Loading venues..."
              : `${filteredVenues.length} venues found.`}
          </p>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Venue</span>
          <span>Type</span>
          <span>Capacity</span>
          <span>Base Price</span>
          <span>Status</span>
          <span>Bookings</span>
          <span>Action</span>
        </div>

        {loading ? (
          <EmptyState text="Loading venue records..." />
        ) : filteredVenues.length === 0 ? (
          <EmptyState text="No venues match the selected filters." />
        ) : (
          filteredVenues.map((venue) => (
            <VenueRow
              key={venue.venueId}
              venue={venue}
              bookingCount={
                bookingCounts[venue.venueId] || 0
              }
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
}

function VenueRow({
  venue,
  bookingCount,
  onEdit,
  onDelete,
}) {
  const hasFeatures =
    Array.isArray(venue.features) &&
    venue.features.length > 0;

  const canDelete =
    bookingCount === 0 && !hasFeatures;

  return (
    <div className="grid gap-4 border-b border-stone-100 px-6 py-5 last:border-b-0 xl:grid-cols-7 xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {venue.venueName}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          {venue.location}
        </p>

        {hasFeatures && (
          <p className="mt-1 text-xs text-stone-500">
            {venue.features.join(", ")}
          </p>
        )}
      </div>

      <DataField
        label="Type"
        value={formatLabel(venue.venueType)}
      />

      <DataField
        label="Capacity"
        value={`${venue.capacity} guests`}
      />

      <DataField
        label="Base Price"
        value={formatCurrency(venue.basePrice)}
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-stone-500 xl:hidden">
          Status
        </p>

        <StatusBadge
          status={venue.availabilityStatus}
        />
      </div>

      <DataField
        label="Bookings"
        value={bookingCount}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(venue)}
          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(venue)}
          disabled={!canDelete}
          title={
            canDelete
              ? "Delete venue"
              : "Referenced venues cannot be deleted"
          }
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label>
      <span className="text-sm font-semibold text-primary-950">
        {label}
      </span>

      <div className="mt-2">{children}</div>
    </label>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase text-stone-500 xl:hidden">
        {label}
      </p>

      <p className="text-sm font-medium text-primary-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const available = status === "AVAILABLE";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        available
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {formatLabel(status)}
    </span>
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

      <p className="mt-4 text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function MessageBox({ error = false, message }) {
  return (
    <section
      className={`mt-8 rounded-2xl border p-5 ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {error && (
          <TriangleAlert className="mt-0.5 h-5 w-5" />
        )}

        <p className="text-sm font-medium">
          {message}
        </p>
      </div>
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="px-6 py-14 text-center">
      <Building2 className="mx-auto h-7 w-7 text-stone-400" />

      <p className="mt-4 text-sm text-stone-600">
        {text}
      </p>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatLabel(value) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallback
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";