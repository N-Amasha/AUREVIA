import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Search,
} from "lucide-react";

import { getInvoicesByCustomer } from "../../api/billingApi";
import { getAuth } from "../../api/authStorage";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      const auth = getAuth();

      if (!auth?.userId) {
        setErrorMessage(
          "Your account information could not be found. Please sign in again.",
        );
        setLoading(false);
        return;
      }

      try {
        const response = await getInvoicesByCustomer(
          auth.userId,
        );

        setInvoices(response);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load your invoices.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const availableStatuses = useMemo(
    () =>
      [...new Set(invoices.map(
        (invoice) => invoice.invoiceStatus,
      ))].filter(Boolean),
    [invoices],
  );

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return invoices.filter((invoice) => {
      const reference = getInvoiceReference(invoice)
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        String(invoice.invoiceId)
          .includes(normalizedSearch) ||
        reference.includes(normalizedSearch) ||
        invoice.invoiceStatus
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        invoice.invoiceStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchText, statusFilter]);

  const awaitingPaymentCount = invoices.filter(
    (invoice) =>
      Number(invoice.outstandingAmount ?? 0) > 0,
  ).length;

  const paidCount = invoices.filter(
    (invoice) =>
      Number(invoice.outstandingAmount ?? 0) <= 0,
  ).length;

  return (
    <div>
      <Link
        to="/customer/billing"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Billing
      </Link>

      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          My invoices
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoices generated for your Aurevia reservations,
          event bookings and orders.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Unable to load invoices
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Invoices"
          value={invoices.length}
        />

        <SummaryCard
          label="Awaiting Payment"
          value={awaitingPaymentCount}
        />

        <SummaryCard
          label="Paid / Verified"
          value={paidCount}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search by invoice or reference"
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
            <option value="ALL">
              All Invoice Statuses
            </option>

            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Invoice records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {filteredInvoices.length} invoice
                {filteredInvoices.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-6 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Invoice</span>
          <span>Reference</span>
          <span>Date</span>
          <span>Outstanding</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-stone-600">
              Loading your invoices...
            </p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <EmptyState hasInvoices={invoices.length > 0} />
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredInvoices.map((invoice) => (
              <InvoiceRow
                key={invoice.invoiceId}
                invoice={invoice}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InvoiceRow({ invoice }) {
  return (
    <article className="grid gap-4 px-6 py-5 lg:grid-cols-6 lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Invoice
        </p>

        <p className="font-semibold text-primary-950">
          INV-{invoice.invoiceId}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Reference
        </p>

        <p className="text-sm text-stone-700">
          {getInvoiceReference(invoice)}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Date
        </p>

        <p className="text-sm text-stone-700">
          {formatDate(invoice.invoiceDate)}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Outstanding
        </p>

        <p className="text-sm font-semibold text-primary-950">
          {formatCurrency(invoice.outstandingAmount)}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Status
        </p>

        <span className={getStatusClasses(
          invoice.invoiceStatus,
        )}>
          {formatStatus(invoice.invoiceStatus)}
        </span>
      </div>

      <div>
        <Link
          to={`/customer/billing/invoices/${invoice.invoiceId}`}
          className="inline-flex rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ hasInvoices }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
        <FileText className="h-6 w-6 text-primary-700" />
      </div>

      <h3 className="mt-5 font-semibold text-primary-950">
        {hasInvoices
          ? "No matching invoices"
          : "No invoices available"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {hasInvoices
          ? "Try changing your search text or status filter."
          : "Invoices generated for your reservations, bookings and orders will appear here."}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <FileText className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function getInvoiceReference(invoice) {
  if (invoice.reservationId) {
    return `Table reservation RES-${invoice.reservationId}`;
  }

  if (invoice.eventBookingId) {
    return `Venue booking VEN-${invoice.eventBookingId}`;
  }

  if (invoice.orderId) {
    return `Order ORD-${invoice.orderId}`;
  }

  return "General invoice";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(amount ?? 0));
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

function formatStatus(status) {
  return status
    ? status.replaceAll("_", " ")
    : "UNKNOWN";
}

function getStatusClasses(status) {
  const normalizedStatus = status?.toUpperCase();

  if (
    normalizedStatus === "PAID" ||
    normalizedStatus === "COMPLETED"
  ) {
    return "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700";
  }

  if (
    normalizedStatus === "PARTIALLY_PAID" ||
    normalizedStatus === "PARTIAL"
  ) {
    return "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700";
  }

  if (
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "OVERDUE"
  ) {
    return "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700";
  }

  return "inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700";
}