import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Info,
  ReceiptText,
  ShieldCheck,
  Upload,
} from "lucide-react";

import FileUpload from "../../components/forms/FileUpload";

export default function PaymentSlipUploadPage() {
  const [searchParams] = useSearchParams();

  const invoiceId = searchParams.get("invoice");

  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);

  const [errors, setErrors] = useState({});
  const [previewReady, setPreviewReady] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!invoiceId) {
      nextErrors.invoice = "An invoice reference is required.";
    }

    if (!paymentReference.trim()) {
      nextErrors.paymentReference =
        "Bank transaction or payment reference is required.";
    }

    if (!paymentDate) {
      nextErrors.paymentDate = "Payment date is required.";
    }

    if (!paymentSlip) {
      nextErrors.paymentSlip = "Please select a payment slip.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreviewReady(false);
      return;
    }

    setPreviewReady(true);
  }

  function handleClear() {
    setPaymentReference("");
    setPaymentDate("");
    setPaymentSlip(null);
    setErrors({});
    setPreviewReady(false);
  }

  return (
    <div>
      {/* Back */}
      <Link
        to={
          invoiceId
            ? `/customer/billing/invoices/${invoiceId}`
            : "/customer/billing"
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Billing
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Upload payment slip
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Provide your bank payment information and upload the relevant
          payment slip for cashier verification.
        </p>
      </section>

      {/* Important Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Payment submission preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This frontend does not currently upload or store payment
              evidence. The payment record and file will be submitted to
              the backend after Billing & Payment integration is
              implemented.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Payment information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Enter the information related to your bank payment.
              </p>
            </div>
          </div>

          {/* Invoice */}
          <div className="mt-7">
            <label className="text-sm font-semibold text-stone-700">
              Invoice Reference
            </label>

            <input
              type="text"
              value={invoiceId || ""}
              readOnly
              placeholder="Select an invoice"
              className="mt-2 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-600 outline-none"
            />

            {errors.invoice && (
              <p className="mt-2 text-sm text-red-600">
                {errors.invoice}
              </p>
            )}
          </div>

          {/* Payment Reference */}
          <div className="mt-5">
            <label
              htmlFor="paymentReference"
              className="text-sm font-semibold text-stone-700"
            >
              Bank Transaction / Payment Reference
            </label>

            <input
              id="paymentReference"
              type="text"
              value={paymentReference}
              onChange={(event) => {
                setPaymentReference(event.target.value);
                setPreviewReady(false);
              }}
              placeholder="Enter payment reference"
              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
            />

            {errors.paymentReference && (
              <p className="mt-2 text-sm text-red-600">
                {errors.paymentReference}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="mt-5">
            <label
              htmlFor="paymentDate"
              className="text-sm font-semibold text-stone-700"
            >
              Payment Date
            </label>

            <input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(event) => {
                setPaymentDate(event.target.value);
                setPreviewReady(false);
              }}
              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
            />

            {errors.paymentDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.paymentDate}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="mt-5">
            <FileUpload
              label="Bank Payment Slip"
              value={paymentSlip}
              onChange={(file) => {
                setPaymentSlip(file);
                setPreviewReady(false);
              }}
              accept=".jpg,.jpeg,.png,.pdf"
              helperText="Accepted formats: JPG, PNG or PDF."
            />

            {errors.paymentSlip && (
              <p className="mt-2 text-sm text-red-600">
                {errors.paymentSlip}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              <Upload className="mr-2 h-4 w-4" />
              Preview Submission
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Side Information */}
        <aside className="space-y-5">
          <div className="rounded-2xl bg-primary-950 p-6 text-white">
            <Building2 className="h-6 w-6 text-gold-400" />

            <h2 className="mt-5 font-semibold">
              Bank payment evidence
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-300">
              Aurevia uses payment-slip verification for this project.
              The uploaded evidence will later be reviewed by an
              authorized cashier.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <ShieldCheck className="h-5 w-5 text-primary-700" />

            <h2 className="mt-4 font-semibold text-primary-950">
              Verification
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Uploading a payment slip does not automatically verify the
              payment. The initial payment status will require cashier
              review.
            </p>
          </div>
        </aside>
      </div>

      {/* Preview */}
      {previewReady && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="font-semibold text-primary-950">
                Payment submission ready
              </h2>

              <p className="mt-1 text-sm leading-6 text-primary-800">
                The information passed frontend validation. Nothing has
                been uploaded or stored yet.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <PreviewItem
              label="Invoice"
              value={invoiceId}
            />

            <PreviewItem
              label="Payment Reference"
              value={paymentReference}
            />

            <PreviewItem
              label="Payment Date"
              value={paymentDate}
            />

            <PreviewItem
              label="Payment Slip"
              value={paymentSlip?.name || "Selected file"}
            />
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Future status: Pending Verification
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              After backend submission, the payment should remain pending
              until an authorized cashier reviews the evidence.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function PreviewItem({ label, value }) {
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