import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  Info,
  ReceiptText,
  Upload,
} from "lucide-react";

export default function CustomerInvoiceDetailsPage() {
  const { invoiceId } = useParams();

  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/billing/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Invoice details
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review invoice information and follow the related payment
          verification process.
        </p>
      </section>

      {/* Backend Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Invoice data not connected yet
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              This page is ready to load invoice{" "}
              <span className="font-semibold">{invoiceId}</span> from the
              Aurevia backend. No real invoice record is currently being
              displayed.
            </p>
          </div>
        </div>
      </section>

      {/* Main Invoice Information */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <ReceiptText className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Invoice information
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Billing information associated with this invoice.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <DetailItem
              label="Invoice Number"
              value="—"
            />

            <DetailItem
              label="Invoice Date"
              value="—"
            />

            <DetailItem
              label="Billing Reference"
              value="—"
            />

            <DetailItem
              label="Invoice Status"
              value="—"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
          <CreditCard className="h-6 w-6 text-gold-400" />

          <p className="mt-5 text-sm font-medium text-stone-300">
            Invoice Amount
          </p>

          <p className="mt-2 text-3xl font-bold">
            —
          </p>

          <p className="mt-4 text-sm leading-6 text-stone-300">
            The actual amount will be displayed after invoice data is
            retrieved from the backend.
          </p>
        </div>
      </section>

      {/* Related Booking */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Related booking
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              The reservation or event booking associated with this
              invoice.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="Booking Reference"
            value="—"
          />

          <DetailItem
            label="Booking Type"
            value="—"
          />

          <DetailItem
            label="Booking Date"
            value="—"
          />

          <DetailItem
            label="Booking Status"
            value="—"
          />
        </div>
      </section>

      {/* Payment Status */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-primary-700" />

          <div>
            <h2 className="text-lg font-semibold text-primary-950">
              Payment status
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Payment evidence and cashier verification status for this
              invoice.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <DetailItem
            label="Payment Slip"
            value="—"
          />

          <DetailItem
            label="Verification Status"
            value="—"
          />

          <DetailItem
            label="Verified Date"
            value="—"
          />
        </div>
      </section>

      {/* Payment Action */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-gold-600" />

              <h2 className="font-semibold text-primary-950">
                Bank payment slip
              </h2>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              When an invoice requires payment, you will be able to upload
              the relevant bank payment slip for cashier verification.
            </p>
          </div>

          <Link
            to={`/customer/billing/payment-slip?invoice=${invoiceId}`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Payment Slip
          </Link>
        </div>

        <p className="mt-4 text-xs leading-5 text-stone-500">
          Backend rules will later determine whether payment-slip upload is
          available based on the invoice and payment status.
        </p>
      </section>
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
        {value}
      </p>
    </div>
  );
}