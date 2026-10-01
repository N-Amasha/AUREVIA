import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  ReceiptText,
  Upload,
} from "lucide-react";

import {
  getInvoiceById,
  getPaymentsByInvoice,
} from "../../api/billingApi";
import { getAuth } from "../../api/authStorage";

export default function CustomerInvoiceDetailsPage() {
  const { invoiceId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadInvoiceDetails() {
      const parsedInvoiceId = Number(invoiceId);
      const auth = getAuth();

      if (!Number.isInteger(parsedInvoiceId) || parsedInvoiceId <= 0) {
        setErrorMessage("The invoice reference is invalid.");
        setLoading(false);
        return;
      }

      if (!auth?.userId) {
        setErrorMessage(
          "Your account information could not be found. Please sign in again.",
        );
        setLoading(false);
        return;
      }

      try {
        const [invoiceResponse, paymentResponse] =
          await Promise.all([
            getInvoiceById(parsedInvoiceId),
            getPaymentsByInvoice(parsedInvoiceId),
          ]);

        if (invoiceResponse.customerId !== auth.userId) {
          setErrorMessage(
            "You do not have permission to view this invoice.",
          );
          setLoading(false);
          return;
        }

        setInvoice(invoiceResponse);
        setPayments(paymentResponse);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load the invoice details.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvoiceDetails();
  }, [invoiceId]);

  if (loading) {
    return (
      <PageMessage message="Loading invoice details..." />
    );
  }

  if (errorMessage || !invoice) {
    return (
      <PageMessage
        message={errorMessage || "Invoice not found."}
        error
      />
    );
  }

  const latestPayment = [...payments].sort(
    (first, second) =>
      new Date(second.paymentDate) -
      new Date(first.paymentDate),
  )[0];

  const hasOutstandingAmount =
    Number(invoice.outstandingAmount ?? 0) > 0;

  return (
    <div>
      <Link
        to="/customer/billing/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>

      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Invoice INV-{invoice.invoiceId}
          </h1>

          <span className={getStatusClasses(
            invoice.invoiceStatus,
          )}>
            {formatStatus(invoice.invoiceStatus)}
          </span>
        </div>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoice totals, outstanding balance and related
          payment verification records.
        </p>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Invoice information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Billing information retrieved from the Aurevia
                invoice service.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <DetailItem
              label="Invoice Number"
              value={`INV-${invoice.invoiceId}`}
            />

            <DetailItem
              label="Invoice Date"
              value={formatDateTime(invoice.invoiceDate)}
            />

            <DetailItem
              label="Customer"
              value={invoice.customerName}
            />

            <DetailItem
              label="Invoice Status"
              value={formatStatus(invoice.invoiceStatus)}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
          <CreditCard className="h-6 w-6 text-gold-400" />

          <p className="mt-5 text-sm font-medium text-stone-300">
            Total Amount
          </p>

          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(invoice.totalAmount)}
          </p>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm text-stone-300">
              Outstanding Balance
            </p>

            <p className="mt-1 text-xl font-bold text-gold-300">
              {formatCurrency(invoice.outstandingAmount)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Billing reference
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              The reservation, venue booking or order associated
              with this invoice.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="Reference"
            value={getInvoiceReference(invoice)}
          />

          <DetailItem
            label="Reference Type"
            value={getReferenceType(invoice)}
          />

          <DetailItem
            label="Subtotal"
            value={formatCurrency(invoice.subtotal)}
          />

          <DetailItem
            label="Discount"
            value={formatCurrency(invoice.discount)}
          />

          <DetailItem
            label="Tax Amount"
            value={formatCurrency(invoice.taxAmount)}
          />

          <DetailItem
            label="Approved Payments"
            value={formatCurrency(invoice.approvedAmount)}
          />

          <DetailItem
            label="Total Amount"
            value={formatCurrency(invoice.totalAmount)}
          />

          <DetailItem
            label="Outstanding"
            value={formatCurrency(invoice.outstandingAmount)}
          />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Payment status
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Payment submissions and cashier verification information
              for this invoice.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <DetailItem
            label="Payment Records"
            value={String(payments.length)}
          />

          <DetailItem
            label="Latest Status"
            value={
              latestPayment
                ? formatStatus(latestPayment.paymentStatus)
                : "No payment submitted"
            }
          />

          <DetailItem
            label="Verified Date"
            value={
              latestPayment?.verifiedAt
                ? formatDateTime(latestPayment.verifiedAt)
                : "Not verified"
            }
          />
        </div>

        {payments.length > 0 && (
          <div className="mt-7 overflow-hidden rounded-xl border border-stone-200">
            <div className="hidden grid-cols-5 gap-4 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid">
              <span>Payment</span>
              <span>Reference</span>
              <span>Amount</span>
              <span>Method</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-stone-200">
              {payments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="grid gap-3 px-5 py-4 text-sm md:grid-cols-5 md:items-center"
                >
                  <span className="font-semibold text-primary-950">
                    PAY-{payment.paymentId}
                  </span>

                  <span className="text-stone-700">
                    {payment.transactionReference}
                  </span>

                  <span className="font-medium text-stone-700">
                    {formatCurrency(payment.amount)}
                  </span>

                  <span className="text-stone-700">
                    {formatStatus(payment.paymentMethod)}
                  </span>

                  <span className={getStatusClasses(
                    payment.paymentStatus,
                  )}>
                    {formatStatus(payment.paymentStatus)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        className={`mt-8 rounded-2xl border p-6 sm:p-8 ${
          hasOutstandingAmount
            ? "border-gold-200 bg-gold-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {hasOutstandingAmount ? (
                <Upload className="h-5 w-5 text-gold-600" />
              ) : (
                <CreditCard className="h-5 w-5 text-emerald-700" />
              )}

              <h2 className="font-semibold text-primary-950">
                {hasOutstandingAmount
                  ? "Submit a payment"
                  : "Invoice fully paid"}
              </h2>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              {hasOutstandingAmount
                ? "Submit your bank transaction information for cashier verification."
                : "This invoice has no outstanding balance."}
            </p>
          </div>

          {hasOutstandingAmount && (
            <Link
              to={`/customer/billing/payment-slip?invoice=${invoice.invoiceId}`}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              <Upload className="mr-2 h-4 w-4" />
              Submit Payment
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function PageMessage({ message, error = false }) {
  return (
    <div>
      <Link
        to="/customer/billing/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>

      <div
        className={`mt-8 rounded-2xl border p-8 text-center ${
          error
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-stone-200 bg-white text-stone-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-primary-950">
        {value ?? "Not available"}
      </p>
    </div>
  );
}

function getInvoiceReference(invoice) {
  if (invoice.reservationId) {
    return `RES-${invoice.reservationId}`;
  }

  if (invoice.eventBookingId) {
    return `VEN-${invoice.eventBookingId}`;
  }

  if (invoice.orderId) {
    return `ORD-${invoice.orderId}`;
  }

  return "General invoice";
}

function getReferenceType(invoice) {
  if (invoice.reservationId) {
    return "Table Reservation";
  }

  if (invoice.eventBookingId) {
    return "Venue Booking";
  }

  if (invoice.orderId) {
    return "Customer Order";
  }

  return "General Billing";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(amount ?? 0));
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    normalizedStatus === "APPROVED" ||
    normalizedStatus === "COMPLETED"
  ) {
    return "inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700";
  }

  if (
    normalizedStatus === "PENDING" ||
    normalizedStatus === "PARTIALLY_PAID" ||
    normalizedStatus === "PARTIAL"
  ) {
    return "inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700";
  }

  if (
    normalizedStatus === "REJECTED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "OVERDUE"
  ) {
    return "inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700";
  }

  return "inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700";
}