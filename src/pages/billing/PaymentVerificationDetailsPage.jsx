import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Info,
  ReceiptText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function PaymentVerificationDetailsPage() {
  const { paymentId } = useParams();

  const [decision, setDecision] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [previewReady, setPreviewReady] = useState(false);

  function selectDecision(value) {
    setDecision(value);
    setError("");
    setPreviewReady(false);

    if (value === "approve") {
      setRejectionReason("");
    }
  }

  function handlePreview() {
    if (!decision) {
      setError("Please select Approve or Reject.");
      setPreviewReady(false);
      return;
    }

    if (decision === "reject" && !rejectionReason.trim()) {
      setError("A rejection reason is required.");
      setPreviewReady(false);
      return;
    }

    setError("");
    setPreviewReady(true);
  }

  return (
    <div>
      {/* Back */}
      <Link
        to="/cashier/payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payment Queue
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payment Management
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Verify payment
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review the submitted payment evidence and related invoice before
          making a verification decision.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Payment data not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This page is ready to load payment{" "}
              <span className="font-semibold">{paymentId}</span> from the
              backend. No real payment evidence is currently displayed or
              processed.
            </p>
          </div>
        </div>
      </section>

      {/* Payment + Invoice */}
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <InformationCard
          icon={ShieldCheck}
          title="Payment information"
          description="Information submitted with the customer's payment evidence."
          items={[
            ["Payment ID", paymentId || "—"],
            ["Customer", "—"],
            ["Payment Reference", "—"],
            ["Payment Date", "—"],
            ["Submitted Date", "—"],
            ["Current Status", "—"],
          ]}
        />

        <InformationCard
          icon={ReceiptText}
          title="Related invoice"
          description="Invoice information associated with this payment."
          items={[
            ["Invoice Number", "—"],
            ["Booking Reference", "—"],
            ["Invoice Date", "—"],
            ["Invoice Amount", "—"],
            ["Invoice Status", "—"],
            ["Booking Type", "—"],
          ]}
        />
      </section>

      {/* Evidence */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Payment evidence
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              The customer's uploaded bank payment slip will be available
              here for authorized review.
            </p>
          </div>
        </div>

        <div className="mt-7 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <div>
            <FileText className="mx-auto h-8 w-8 text-stone-400" />

            <p className="mt-4 font-semibold text-primary-950">
              No payment slip loaded
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
              The uploaded image or PDF will be retrieved securely from
              the backend after file storage integration.
            </p>
          </div>
        </div>
      </section>

      {/* Decision */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
            Cashier Decision
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            Verification decision
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Select a decision after reviewing the invoice and submitted
            payment evidence.
          </p>
        </div>

        {/* Approve / Reject */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectDecision("approve")}
            className={[
              "rounded-2xl border p-5 text-left transition",
              decision === "approve"
                ? "border-primary-700 bg-primary-50"
                : "border-stone-200 hover:border-primary-300",
            ].join(" ")}
          >
            <CheckCircle2 className="h-6 w-6 text-primary-700" />

            <p className="mt-4 font-semibold text-primary-950">
              Approve Payment
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Mark the submitted payment evidence as verified.
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectDecision("reject")}
            className={[
              "rounded-2xl border p-5 text-left transition",
              decision === "reject"
                ? "border-red-300 bg-red-50"
                : "border-stone-200 hover:border-red-200",
            ].join(" ")}
          >
            <XCircle className="h-6 w-6 text-red-600" />

            <p className="mt-4 font-semibold text-primary-950">
              Reject Payment
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Reject the evidence and provide a reason to the customer.
            </p>
          </button>
        </div>

        {/* Rejection Reason */}
        {decision === "reject" && (
          <div className="mt-6">
            <label
              htmlFor="rejectionReason"
              className="text-sm font-semibold text-stone-700"
            >
              Rejection Reason
            </label>

            <textarea
              id="rejectionReason"
              rows="4"
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
                setError("");
                setPreviewReady(false);
              }}
              placeholder="Explain why the payment evidence is being rejected"
              className="mt-2 w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500"
            />

            <p className="mt-2 text-xs text-stone-500">
              A rejection reason is required so the customer understands
              what needs to be corrected.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handlePreview}
          className="mt-6 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          Preview Decision
        </button>
      </section>

      {/* Decision Preview */}
      {previewReady && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            {decision === "approve" ? (
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary-700" />
            ) : (
              <XCircle className="mt-1 h-5 w-5 text-red-600" />
            )}

            <div>
              <h2 className="font-semibold text-primary-950">
                Verification decision ready
              </h2>

              <p className="mt-1 text-sm leading-6 text-primary-800">
                Frontend validation passed. No payment status has been
                changed because backend verification is not connected yet.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <PreviewItem
              label="Payment"
              value={paymentId}
            />

            <PreviewItem
              label="Decision"
              value={decision === "approve" ? "Approve" : "Reject"}
            />
          </div>

          {decision === "reject" && (
            <div className="mt-5">
              <PreviewItem
                label="Rejection Reason"
                value={rejectionReason}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function InformationCard({ icon: Icon, title, description, items }) {
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
          <PreviewItem
            key={label}
            label={label}
            value={value}
          />
        ))}
      </div>
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