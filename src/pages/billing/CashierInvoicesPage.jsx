import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  LoaderCircle,
  ReceiptText,
  Search,
} from "lucide-react";

import { getInvoicesByStatus } from "../../api/billingApi";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(Number(value ?? 0));
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getReference(invoice) {
  if (invoice.reservationId) {
    return {
      value: `RES-${invoice.reservationId}`,
      type: "TABLE_RESERVATION",
    };
  }

  if (invoice.eventBookingId) {
    return {
      value: `VEN-${invoice.eventBookingId}`,
      type: "VENUE_BOOKING",
    };
  }

  if (invoice.orderId) {
    return {
      value: `ORD-${invoice.orderId}`,
      type: "CUSTOMER_ORDER",
    };
  }

  return {
    value: "Not available",
    type: "OTHER",
  };
}

export default function CashierInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      try {
        const [issued, partiallyPaid, paid] =
          await Promise.all([
            getInvoicesByStatus("ISSUED"),
            getInvoicesByStatus("PARTIALLY_PAID"),
            getInvoicesByStatus("PAID"),
          ]);

        const combinedInvoices = [
          ...issued,
          ...partiallyPaid,
          ...paid,
        ].sort(
          (first, second) =>
            new Date(second.invoiceDate ?? 0) -
            new Date(first.invoiceDate ?? 0),
        );

        setInvoices(combinedInvoices);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load invoice records.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const paidCount = invoices.filter(
    (invoice) => invoice.invoiceStatus === "PAID",
  ).length;

  const awaitingPaymentCount = invoices.filter(
    (invoice) => invoice.invoiceStatus !== "PAID",
  ).length;

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const reference = getReference(invoice);

      const matchesSearch =
        !normalizedSearch ||
        [
          `INV-${invoice.invoiceId}`,
          invoice.customerName,
          reference.value,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedSearch),
          );

      const matchesStatus =
        statusFilter === "ALL" ||
        invoice.invoiceStatus === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        reference.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [invoices, searchTerm, statusFilter, typeFilter]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-primary-700" />
      </div>
    );
  }

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payment Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Invoice management
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoices generated for customer reservations,
          venue bookings, and orders.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search invoice, reference or customer"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
          >
            <option value="ALL">All Invoice Statuses</option>
            <option value="ISSUED">Issued</option>
            <option value="PARTIALLY_PAID">
              Partially Paid
            </option>
            <option value="PAID">Paid</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
          >
            <option value="ALL">All Reference Types</option>
            <option value="TABLE_RESERVATION">
              Table Reservation
            </option>
            <option value="VENUE_BOOKING">
              Venue Booking
            </option>
            <option value="CUSTOMER_ORDER">
              Customer Order
            </option>
          </select>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-1 h-5 w-5 text-primary-700" />

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

        <div className="hidden grid-cols-8 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Invoice</span>
          <span>Customer</span>
          <span>Reference</span>
          <span>Type</span>
          <span>Date</span>
          <span>Total</span>
          <span>Outstanding</span>
          <span>Status</span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <FileText className="mx-auto h-8 w-8 text-primary-700" />

            <h3 className="mt-5 font-semibold text-primary-950">
              No invoice records available
            </h3>

            <p className="mt-2 text-sm text-stone-600">
              No invoices match the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredInvoices.map((invoice) => {
              const reference = getReference(invoice);

              return (
                <article
                  key={invoice.invoiceId}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-8 lg:items-center"
                >
                  <DataItem
                    label="Invoice"
                    value={`INV-${invoice.invoiceId}`}
                    strong
                  />

                  <DataItem
                    label="Customer"
                    value={invoice.customerName}
                  />

                  <DataItem
                    label="Reference"
                    value={reference.value}
                  />

                  <DataItem
                    label="Type"
                    value={reference.type.replaceAll("_", " ")}
                  />

                  <DataItem
                    label="Date"
                    value={formatDateTime(invoice.invoiceDate)}
                  />

                  <DataItem
                    label="Total"
                    value={formatCurrency(invoice.totalAmount)}
                    strong
                  />

                  <DataItem
                    label="Outstanding"
                    value={formatCurrency(
                      invoice.outstandingAmount,
                    )}
                    strong
                  />

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        invoice.invoiceStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : invoice.invoiceStatus ===
                              "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {invoice.invoiceStatus.replaceAll("_", " ")}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Cashier Responsibility
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Invoice and payment are separate records
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <FlowStep
            number="01"
            title="Invoice"
            text="The invoice records the amount the customer must pay."
          />

          <FlowStep
            number="02"
            title="Payment"
            text="The customer submits payment information against the invoice."
          />

          <FlowStep
            number="03"
            title="Verification"
            text="The cashier approves or rejects the pending payment."
          />
        </div>
      </section>
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

function DataItem({ label, value, strong = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-stone-400 lg:hidden">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm text-stone-700 lg:mt-0 ${
          strong ? "font-semibold text-primary-950" : ""
        }`}
      >
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

      <h3 className="mt-2 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
}