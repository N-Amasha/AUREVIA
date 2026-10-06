import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Store,
  Tags,
  Wrench,
} from "lucide-react";
import {
  getAllVendors,
  getServicesByVendor,
} from "../../api/eventApi";

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState([]);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    setErrorMessage("");

    try {
      const vendorRecords = await getAllVendors();
      const safeVendors = Array.isArray(vendorRecords)
        ? vendorRecords
        : [];

      setVendors(safeVendors);

      const assignmentResults = await Promise.all(
        safeVendors.map(async (vendor) => {
          try {
            const services = await getServicesByVendor(
              vendor.vendorId,
            );

            return [
              vendor.vendorId,
              Array.isArray(services) ? services.length : 0,
            ];
          } catch {
            return [vendor.vendorId, 0];
          }
        }),
      );

      setAssignmentCounts(
        Object.fromEntries(assignmentResults),
      );
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load vendor records.",
      );
      setVendors([]);
      setAssignmentCounts({});
    } finally {
      setLoading(false);
    }
  }

  const vendorTypes = useMemo(
    () =>
      [...new Set(
        vendors
          .map((vendor) => vendor.vendorType)
          .filter(Boolean),
      )].sort(),
    [vendors],
  );

  const cities = useMemo(
    () =>
      [...new Set(
        vendors
          .map((vendor) => vendor.city)
          .filter(Boolean),
      )].sort(),
    [vendors],
  );

  const filteredVendors = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return vendors.filter((vendor) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          vendor.vendorName,
          vendor.vendorType,
          vendor.email,
          vendor.contactNumber,
          vendor.street,
          vendor.city,
          vendor.province,
          vendor.postalCode,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

      const matchesType =
        typeFilter === "ALL" ||
        vendor.vendorType === typeFilter;

      const matchesCity =
        cityFilter === "ALL" ||
        vendor.city === cityFilter;

      return matchesSearch && matchesType && matchesCity;
    });
  }, [vendors, searchTerm, typeFilter, cityFilter]);

  const totalAssignments = Object.values(
    assignmentCounts,
  ).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Event Coordination
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Vendor management
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review vendors that support Aurevia events, inspect their
          contact details and monitor their event-service assignments.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Store}
          label="Total Vendors"
          value={vendors.length}
        />

        <SummaryCard
          icon={Tags}
          label="Vendor Types"
          value={vendorTypes.length}
        />

        <SummaryCard
          icon={Wrench}
          label="Service Assignments"
          value={totalAssignments}
        />
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-red-900">
                Unable to load vendors
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={loadVendors}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search name, email, city or contact"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="ALL">
              All Vendor Types
            </option>

            {vendorTypes.map((vendorType) => (
              <option
                key={vendorType}
                value={vendorType}
              >
                {formatLabel(vendorType)}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(event) =>
              setCityFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="ALL">
              All Cities
            </option>

            {cities.map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Search by vendor name, type, email, telephone number or
          location.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Vendor directory
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              {loading
                ? "Loading vendor records..."
                : `${filteredVendors.length} ${
                    filteredVendors.length === 1
                      ? "vendor"
                      : "vendors"
                  } found.`}
            </p>
          </div>

          <button
            type="button"
            onClick={loadVendors}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="hidden grid-cols-[1.25fr_0.9fr_1.35fr_1fr_0.7fr] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Vendor</span>
          <span>Service Type</span>
          <span>Contact</span>
          <span>Location</span>
          <span>Assignments</span>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredVendors.length === 0 ? (
          <EmptyState
            hasFilters={
              Boolean(searchTerm.trim()) ||
              typeFilter !== "ALL" ||
              cityFilter !== "ALL"
            }
          />
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredVendors.map((vendor) => (
              <VendorRow
                key={vendor.vendorId}
                vendor={vendor}
                assignmentCount={
                  assignmentCounts[vendor.vendorId] ?? 0
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Vendor Coordination
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How vendors support an event
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Review"
            text="The coordinator reviews the event requirements."
          />

          <FlowStep
            number="02"
            title="Select Service"
            text="The required event service and schedule are identified."
          />

          <FlowStep
            number="03"
            title="Choose Vendor"
            text="A suitable vendor is selected using type, contact and location information."
          />

          <FlowStep
            number="04"
            title="Coordinate"
            text="The vendor is assigned through the event-service workflow."
          />
        </div>
      </section>
    </div>
  );
}

function VendorRow({ vendor, assignmentCount }) {
  const address = [
    vendor.street,
    vendor.city,
    vendor.province,
    vendor.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="grid gap-5 px-6 py-5 lg:grid-cols-[1.25fr_0.9fr_1.35fr_1fr_0.7fr] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
          VEN-{vendor.vendorId}
        </p>

        <h3 className="mt-1 font-semibold text-primary-950">
          {vendor.vendorName}
        </h3>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Service Type
        </p>

        <span className="mt-1 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 lg:mt-0">
          {formatLabel(vendor.vendorType)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-stone-600">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-primary-700" />

          <a
            href={`mailto:${vendor.email}`}
            className="break-all hover:text-primary-900"
          >
            {vendor.email}
          </a>
        </p>

        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-primary-700" />

          <a
            href={`tel:${vendor.contactNumber}`}
            className="hover:text-primary-900"
          >
            {vendor.contactNumber}
          </a>
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Location
        </p>

        <p className="mt-1 flex items-start gap-2 text-sm leading-6 text-stone-600 lg:mt-0">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary-700" />
          {address || "Location unavailable"}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
          Assignments
        </p>

        <p className="mt-1 text-2xl font-bold text-primary-950 lg:mt-0">
          {assignmentCount}
        </p>

        <p className="text-xs text-stone-500">
          {assignmentCount === 1
            ? "service"
            : "services"}
        </p>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="px-6 py-14 text-center">
      <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-700">
        Loading vendor records...
      </p>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
        <Building2 className="h-6 w-6 text-primary-700" />
      </div>

      <h3 className="mt-5 font-semibold text-primary-950">
        {hasFilters
          ? "No vendors match the selected filters"
          : "No vendor records available"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {hasFilters
          ? "Change the search text, vendor type or city to view other records."
          : "Vendor records will appear here when they are available in the database."}
      </p>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
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

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}