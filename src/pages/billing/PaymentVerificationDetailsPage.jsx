import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  getInvoiceById,
  getPaymentById,
  verifyPayment,
} from "../../api/billingApi";

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

function getBillingReference(invoice) {
  if (invoice?.reservationId) {
    return `RES-${invoice.reservationId}`;
  }

  if (invoice?.eventBookingId) {
    return `VEN-${invoice.eventBookingId}`;
  }

  if (invoice?.orderId) {
    return `ORD-${invoice.orderId}`;
  }

  return "Not available";
}

function getBillingType(invoice) {
  if (invoice?.reservationId) {
    return "Table Reservation";
  }

  if (invoice?.eventBookingId) {
    return "Venue Booking";
  }

  if (invoice?.orderId) {
    return "Customer Order";
  }

  return "Not available";
}

export default function PaymentVerificationDetailsPage() {
  const { paymentId } = useParams();
  const numericPaymentId = Number(paymentId);

  const [payment, setPayment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadDetails() {
      if (
        !Number.isInteger(numericPaymentId) ||
        numericPaymentId <= 0
      ) {
        setErrorMessage("A valid payment ID is required.");
        setLoading(false);
        return;
      }

      try {
        const paymentResponse =
          await getPaymentById(numericPaymentId);

        const invoiceResponse =
          await getInvoiceById(paymentResponse.invoiceId);

        setPayment(paymentResponse);
        setInvoice(invoiceResponse);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load the payment details.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [numericPaymentId]);

  async function handleVerification() {
    if (!decision) {
      setErrorMessage(
        "Please select Approve Payment or Reject Payment.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedPayment = await verifyPayment(
        numericPaymentId,
        {
          paymentStatus: decision,
        },
      );

      setPayment(updatedPayment);
      setDecision("");
      setSuccessMessage(
        `Payment PAY-${updatedPayment.paymentId} was ${updatedPayment.paymentStatus.toLowerCase()} successfully.`,
      );

      const updatedInvoice =
        await getInvoiceById(updatedPayment.invoiceId);

      setInvoice(updatedInvoice);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ??
          "Unable to verify the payment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-primary-700" />
      </div>
    );
  }

  if (!payment || !invoice) {
    return (
      <div>
        <Link
          to="/cashier/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Queue
        </Link>

        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage || "Payment details are unavailable."}
        </div>
      </div>
    );
  }

  const isPending =
    payment.paymentStatus?.toUpperCase() === "PENDING";

  return (
    <div>
      <Link
        to="/cashier/payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payment Queue
      </Link>

      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payment Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Verify payment PAY-{payment.paymentId}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review the submitted payment and related invoice before
          making a verification decision.
        </p>
      </section>

      {errorMessage && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <InformationCard
          icon={ShieldCheck}
          title="Payment information"
          description="Information submitted by the customer."
          items={[
            ["Payment ID", `PAY-${payment.paymentId}`],
            ["Customer", payment.customerName],
            [
              "Transaction Reference",
              payment.transactionReference,
            ],
            [
              "Payment Date",
              formatDateTime(payment.paymentDate),
            ],
            [
              "Payment Type",
              payment.paymentType?.replaceAll("_", " "),
            ],
            [
              "Payment Method",
              payment.paymentMethod?.replaceAll("_", " "),
            ],
            [
              "Payment Amount",
              formatCurrency(payment.amount),
            ],
            ["Current Status", payment.paymentStatus],
          ]}
        />

        <InformationCard
          icon={ReceiptText}
          title="Related invoice"
          description="Invoice information associated with this payment."
          items={[
            ["Invoice Number", `INV-${invoice.invoiceId}`],
            ["Reference", getBillingReference(invoice)],
            ["Reference Type", getBillingType(invoice)],
            [
              "Invoice Date",
              formatDateTime(invoice.invoiceDate),
            ],
            [
              "Total Amount",
              formatCurrency(invoice.totalAmount),
            ],
            [
              "Approved Amount",
              formatCurrency(invoice.approvedAmount),
            ],
            [
              "Outstanding",
              formatCurrency(invoice.outstandingAmount),
            ],
            ["Invoice Status", invoice.invoiceStatus],
          ]}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Submitted payment information
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              The current backend stores the transaction reference,
              payment method, payment date and amount. File attachment
              storage is not part of the current payment API.
            </p>
          </div>
        </div>
      </section>

      {isPending ? (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Cashier Decision
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Verification decision
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Select whether this pending payment should be approved
            or rejected.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setDecision("APPROVED");
                setErrorMessage("");
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                decision === "APPROVED"
                  ? "border-primary-700 bg-primary-50"
                  : "border-stone-200 hover:border-primary-300"
              }`}
            >
              <CheckCircle2 className="h-6 w-6 text-primary-700" />

              <p className="mt-4 font-semibold text-primary-950">
                Approve Payment
              </p>

              <p className="mt-2 text-sm text-stone-600">
                Add this amount to the invoice’s approved
                payments.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setDecision("REJECTED");
                setErrorMessage("");
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                decision === "REJECTED"
                  ? "border-red-300 bg-red-50"
                  : "border-stone-200 hover:border-red-200"
              }`}
            >
              <XCircle className="h-6 w-6 text-red-600" />

              <p className="mt-4 font-semibold text-primary-950">
                Reject Payment
              </p>

              <p className="mt-2 text-sm text-stone-600">
                Mark this payment submission as rejected.
              </p>
            </button>
          </div>

          <button
            type="button"
            onClick={handleVerification}
            disabled={submitting}
            className="mt-6 inline-flex items-center rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}

            {submitting
              ? "Processing..."
              : "Confirm Decision"}
          </button>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">
          <CheckCircle2 className="h-6 w-6 text-green-700" />

          <h2 className="mt-4 text-lg font-semibold text-green-950">
            Payment already reviewed
          </h2>

          <p className="mt-2 text-sm text-green-800">
            This payment has status {payment.paymentStatus} and was
            reviewed on {formatDateTime(payment.verifiedAt)}.
          </p>
        </section>
      )}
    </div>
  );
}

function InformationCard({
  icon: Icon,
  title,
  description,
  items,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-primary-700" />

        <div>
          <h2 className="text-lg font-semibold text-primary-950">
            {title}
          </h2>

          <p className="mt-1 text-sm text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <InformationItem
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}

function InformationItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-primary-950">
        {value || "—"}
      </p>
    </div>
  );
}