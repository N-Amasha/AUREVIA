import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Pencil,
  Plus,
  Search,
  TableProperties,
  Trash2,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import {
  createRestaurantTable,
  deleteRestaurantTable,
  getAllRestaurantTables,
  getAllTableReservations,
  updateRestaurantTable,
} from "../../api/reservationApi";

const emptyForm = {
  tableNumber: "",
  capacity: "",
  location: "",
  tableStatus: "AVAILABLE",
};

export default function TableManagementPage() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] =
    useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [formData, setFormData] =
    useState(emptyForm);
  const [editingTableId, setEditingTableId] =
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

      const [tableData, reservationData] =
        await Promise.all([
          getAllRestaurantTables(),
          getAllTableReservations(),
        ]);

      setTables(
        Array.isArray(tableData) ? tableData : [],
      );

      setReservations(
        Array.isArray(reservationData)
          ? reservationData
          : [],
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to load restaurant tables.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  const reservationCounts = useMemo(() => {
    return reservations.reduce(
      (counts, reservation) => {
        counts[reservation.tableId] =
          (counts[reservation.tableId] || 0) + 1;

        return counts;
      },
      {},
    );
  }, [reservations]);

  const totalCapacity = useMemo(
    () =>
      tables.reduce(
        (total, table) =>
          total + Number(table.capacity || 0),
        0,
      ),
    [tables],
  );

  const filteredTables = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return tables.filter((table) => {
      const matchesSearch =
        !normalizedSearch ||
        table.tableNumber
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        table.location
          ?.toLowerCase()
          .includes(normalizedSearch);

      const capacity = Number(table.capacity || 0);

      const matchesCapacity =
        capacityFilter === "ALL" ||
        (capacityFilter === "SMALL" &&
          capacity <= 4) ||
        (capacityFilter === "MEDIUM" &&
          capacity >= 5 &&
          capacity <= 8) ||
        (capacityFilter === "LARGE" &&
          capacity >= 9);

      const matchesStatus =
        statusFilter === "ALL" ||
        table.tableStatus === statusFilter;

      return (
        matchesSearch &&
        matchesCapacity &&
        matchesStatus
      );
    });
  }, [
    tables,
    searchTerm,
    capacityFilter,
    statusFilter,
  ]);

  function openCreateForm() {
    setEditingTableId(null);
    setFormData(emptyForm);
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function openEditForm(table) {
    setEditingTableId(table.tableId);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: String(table.capacity),
      location: table.location,
      tableStatus: table.tableStatus,
    });
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTableId(null);
    setFormData(emptyForm);
  }

  function handleFormChange(event) {
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
        tableNumber: formData.tableNumber,
        capacity: Number(formData.capacity),
        location: formData.location,
        tableStatus: formData.tableStatus,
      };

      if (editingTableId) {
        await updateRestaurantTable(
          editingTableId,
          request,
        );

        setSuccessMessage(
          `${request.tableNumber.toUpperCase()} was updated successfully.`,
        );
      } else {
        await createRestaurantTable(request);

        setSuccessMessage(
          `${request.tableNumber.toUpperCase()} was created successfully.`,
        );
      }

      closeForm();
      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to save the restaurant table.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(table) {
    const confirmed = window.confirm(
      `Delete table ${table.tableNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteRestaurantTable(table.tableId);

      setSuccessMessage(
        `${table.tableNumber} was deleted successfully.`,
      );

      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to delete the restaurant table.",
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
            Table management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage restaurant tables and the capacity
            information used when processing reservations.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </section>

      {/* Messages */}
      {errorMessage && (
        <MessageBox
          type="error"
          message={errorMessage}
        />
      )}

      {successMessage && (
        <MessageBox
          type="success"
          message={successMessage}
        />
      )}

      {/* Form */}
      {showForm && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                {editingTableId
                  ? "Edit restaurant table"
                  : "Add restaurant table"}
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Enter the operational details for the
                restaurant table.
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
            <FormField label="Table Number">
              <input
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleFormChange}
                required
                maxLength={20}
                placeholder="T99"
                className={inputClass}
              />
            </FormField>

            <FormField label="Capacity">
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleFormChange}
                required
                min="1"
                placeholder="4"
                className={inputClass}
              />
            </FormField>

            <FormField label="Location">
              <input
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
                maxLength={100}
                placeholder="Main Dining Area"
                className={inputClass}
              />
            </FormField>

            <FormField label="Status">
              <select
                name="tableStatus"
                value={formData.tableStatus}
                onChange={handleFormChange}
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

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingTableId
                    ? "Save Changes"
                    : "Create Table"}
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
          icon={TableProperties}
          label="Restaurant Tables"
          value={loading ? "…" : tables.length}
        />

        <SummaryCard
          icon={Users}
          label="Total Seating Capacity"
          value={loading ? "…" : totalCapacity}
        />

        <SummaryCard
          icon={CalendarCheck}
          label="Reservation Usage"
          value={
            loading ? "…" : reservations.length
          }
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
              placeholder="Search table or location"
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={capacityFilter}
            onChange={(event) =>
              setCapacityFilter(event.target.value)
            }
            className={inputClass}
          >
            <option value="ALL">All Capacities</option>
            <option value="SMALL">
              Small: 1–4
            </option>
            <option value="MEDIUM">
              Medium: 5–8
            </option>
            <option value="LARGE">
              Large: 9+
            </option>
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
          <div className="flex items-start gap-3">
            <TableProperties className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Restaurant tables
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {loading
                  ? "Loading table records..."
                  : `${filteredTables.length} tables found.`}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Table</span>
          <span>Capacity</span>
          <span>Location</span>
          <span>Status</span>
          <span>Reservations</span>
          <span>Action</span>
        </div>

        {loading ? (
          <EmptyState text="Loading table records..." />
        ) : filteredTables.length === 0 ? (
          <EmptyState text="No tables match the selected filters." />
        ) : (
          filteredTables.map((table) => (
            <TableRow
              key={table.tableId}
              table={table}
              reservationCount={
                reservationCounts[table.tableId] || 0
              }
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>

      {/* Explanation */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Availability Logic
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Operational status and booking availability
          are different
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
          AVAILABLE means the table is operational.
          Availability for a customer also depends on the
          requested date, time, party size and existing
          reservations. MAINTENANCE removes the table from
          availability results.
        </p>
      </section>
    </div>
  );
}

function TableRow({
  table,
  reservationCount,
  onEdit,
  onDelete,
}) {
  const canDelete = reservationCount === 0;

  return (
    <div className="grid gap-4 border-b border-stone-100 px-6 py-5 last:border-b-0 lg:grid-cols-6 lg:items-center">
      <DataField
        label="Table"
        value={table.tableNumber}
      />

      <DataField
        label="Capacity"
        value={`${table.capacity} guests`}
      />

      <DataField
        label="Location"
        value={table.location}
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-stone-500 lg:hidden">
          Status
        </p>

        <StatusBadge status={table.tableStatus} />
      </div>

      <DataField
        label="Reservations"
        value={reservationCount}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(table)}
          className="inline-flex items-center gap-1 rounded-lg border border-primary-200 px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(table)}
          disabled={!canDelete}
          title={
            canDelete
              ? "Delete table"
              : "Tables with reservation history cannot be deleted"
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
      <p className="mb-1 text-xs font-semibold uppercase text-stone-500 lg:hidden">
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
      {available ? "Available" : "Maintenance"}
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

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function MessageBox({ type, message }) {
  const error = type === "error";

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
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
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
      <TableProperties className="mx-auto h-7 w-7 text-stone-400" />

      <p className="mt-4 text-sm text-stone-600">
        {text}
      </p>
    </div>
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