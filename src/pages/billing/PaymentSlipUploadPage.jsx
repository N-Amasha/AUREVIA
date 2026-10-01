import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";

import {
  createPayment,
  getInvoiceById,
} from "../../api/billingApi";
import { getAuth } from "../../api/authStorage";

function currentLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(Number(value ?? 0));
}

export default function PaymentSlipUploadPage() {
  const [searchParams] = useSearchParams();
  const invoiceParameter = searchParams.get("invoice");
  const invoiceId = Number(invoiceParameter);

  const [invoice, setInvoice] = useState(null);
  const [createdPayment, setCreatedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    transactionReference: "",
    paymentType: "ADVANCE_PAYMENT",
    paymentDate: currentLocalDateTime(),
    amount: "",
    paymentMethod: "BANK_TRANSFER",
  });

  useEffect(() => {
    async function loadInvoice() {
      if (
        !invoiceParameter ||
        !Number.isInteger(invoiceId) ||
        invoiceId <= 0
      ) {
        setPageError(
          "A valid invoice reference is required.",
        );
        setLoading(false);
        return;
      }

      try {
        const response = await getInvoiceById(invoiceId);
        const auth = getAuth();

        if (response.customerId !== auth?.userId) {
          setPageError(
            "You are not authorized to submit a payment for this invoice.",
          );
          return;
        }

        setInvoice(response);
        setFormData((current) => ({
          ...current,
          amount: String(response.outstandingAmount ?? ""),
        }));
      } catch (error) {
        setPageError(
          error.response?.data?.message ??
            "Unable to load the selected invoice.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [invoiceId, invoiceParameter]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setPageError("");
  }

  function validateForm() {
    const validationErrors = {};
    const paymentAmount = Number(formData.amount);
    const outstandingAmount = Number(
      invoice?.outstandingAmount ?? 0,
    );

    if (!formData.transactionReference.trim()) {
      validationErrors.transactionReference =
        "Transaction reference is required.";
    }

    if (!formData.paymentType) {
      validationErrors.paymentType =
        "Payment type is required.";
    }

    if (!formData.paymentDate) {
      validationErrors.paymentDate =
        "Payment date is required.";
    }

    if (!formData.amount) {
      validationErrors.amount =
        "Payment amount is required.";
    } else if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      validationErrors.amount =
        "Payment amount must be greater than zero.";
    } else if (paymentAmount > outstandingAmount) {
      validationErrors.amount =
        "Payment amount cannot exceed the outstanding balance.";
    }

    if (!formData.paymentMethod) {
      validationErrors.paymentMethod =
        "Payment method is required.";
    }

    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setPageError("");
    setCreatedPayment(null);

    try {
      const response = await createPayment({
        invoiceId,
        transactionReference:
          formData.transactionReference.trim(),
        paymentType: formData.paymentType,
        paymentDate: `${formData.paymentDate}:00`,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
      });

      setCreatedPayment(response);
    } catch (error) {
      const responseData = error.response?.data;

      setPageError(
        responseData?.message ??
          "Unable to submit the payment.",
      );

      if (responseData?.validationErrors) {
        setErrors(responseData.validationErrors);
      }
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

  if (pageError && !invoice) {
    return (
      <div>
        <Link
          to="/customer/billing/invoices"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>

        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {pageError}
        </div>
      </div>
    );
  }

  const outstandingAmount = Number(
    invoice?.outstandingAmount ?? 0,
  );

  const cannotSubmit =
    invoice?.invoiceStatus === "PAID" ||
    outstandingAmount <= 0;

  return (
    <div>
      <Link
        to={`/customer/billing/invoices/${invoiceId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoice
      </Link>

      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold text-primary-950 sm:text-4xl">
          Submit payment
        </h1>

        <p className="mt-3 text-stone-600">
          Submit payment information for invoice INV-
          {invoiceId}.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Invoice Total"
          value={formatCurrency(invoice.totalAmount)}
        />

        <SummaryCard
          label="Approved Payments"
          value={formatCurrency(invoice.approvedAmount)}
        />

        <SummaryCard
          label="Outstanding Balance"
          value={formatCurrency(invoice.outstandingAmount)}
        />
      </section>

      {createdPayment ? (
        <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">
          <CheckCircle2 className="h-8 w-8 text-green-700" />

          <h2 className="mt-4 text-xl font-semibold text-green-950">
            Payment submitted successfully
          </h2>

          <p className="mt-2 text-sm text-green-800">
            Payment PAY-{createdPayment.paymentId} was created
            with status {createdPayment.paymentStatus}. It is now
            waiting for cashier verification.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/customer/billing/history"
              className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white"
            >
              View Payment History
            </Link>

            <Link
              to={`/customer/billing/invoices/${invoiceId}`}
              className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-900"
            >
              View Invoice
            </Link>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
          noValidate
        >
          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Payment information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Enter the transaction details for cashier
                verification.
              </p>
            </div>
          </div>

          {pageError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {pageError}
            </div>
          )}

          {cannotSubmit ? (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              This invoice is already fully paid.
            </div>
          ) : (
            <>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <FormField
                  label="Transaction Reference"
                  error={errors.transactionReference}
                >
                  <input
                    name="transactionReference"
                    value={formData.transactionReference}
                    onChange={handleChange}
                    placeholder="Example: BANK-TRX-2026-006"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-600"
                  />
                </FormField>

                <FormField
                  label="Payment Date and Time"
                  error={errors.paymentDate}
                >
                  <input
                    name="paymentDate"
                    type="datetime-local"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-600"
                  />
                </FormField>

                <FormField
                  label="Payment Type"
                  error={errors.paymentType}
                >
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-600"
                  >
                    <option value="ADVANCE_PAYMENT">
                      Advance Payment
                    </option>
                    <option value="FULL_PAYMENT">
                      Full Payment
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Payment Method"
                  error={errors.paymentMethod}
                >
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-600"
                  >
                    <option value="BANK_TRANSFER">
                      Bank Transfer
                    </option>
                    <option value="CASH">Cash</option>
                  </select>
                </FormField>

                <FormField
                  label="Payment Amount (LKR)"
                  error={errors.amount}
                >
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    max={outstandingAmount}
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-primary-600"
                  />
                </FormField>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}

                {submitting
                  ? "Submitting..."
                  : "Submit Payment"}
              </button>
            </>
          )}
        </form>
      )}

      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <ReceiptText className="mt-0.5 h-5 w-5 text-primary-700" />

          <p className="text-sm leading-6 text-primary-800">
            Submitted payments remain pending until an authorized
            cashier approves or rejects them.
          </p>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}