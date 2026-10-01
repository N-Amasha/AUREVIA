import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  ReceiptText,
  Upload,
} from "lucide-react";

import {
  getInvoicesByCustomer,
  getPaymentsByCustomer,
} from "../../api/billingApi";
import { getAuth } from "../../api/authStorage";

export default function CustomerBillingPage() {
  const [summary, setSummary] = useState({
    invoices: 0,
    pending: 0,
    approved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBillingSummary() {
      try {
        setLoading(true);
        setLoadError("");

        const auth = getAuth();
        const customerId = auth?.userId;

        if (!customerId) {
          throw new Error(
            "Customer account information is unavailable.",
          );
        }

        const [invoices, payments] = await Promise.all([
          getInvoicesByCustomer(customerId),
          getPaymentsByCustomer(customerId),
        ]);

        if (!active) {
          return;
        }

        setSummary({
          invoices: invoices.length,
          pending: payments.filter(
            (payment) =>
              payment.paymentStatus?.toUpperCase() ===
              "PENDING",
          ).length,
          approved: payments.filter(
            (payment) =>
              payment.paymentStatus?.toUpperCase() ===
              "APPROVED",
          ).length,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error.response?.data?.message ??
            error.message ??
            "Unable to load billing information.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBillingSummary();

    return () => {
      active = false;
    };
  }, []);

  const actions = [
    {
      title: "My Invoices",
      description:
        "View invoices generated for your Aurevia reservations and event bookings.",
      icon: ReceiptText,
      path: "/customer/billing/invoices",
    },
    {
      title: "Submit Payment",
      description:
        "Submit bank transaction information for an invoice awaiting payment.",
      icon: Upload,
      path: "/customer/billing/payment-slip",
    },
    {
      title: "Payment History",
      description:
        "Review the verification status of your submitted payments.",
      icon: Banknote,
      path: "/customer/billing/history",
    },
  ];

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Billing & Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          My billing
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review your invoices, submit bank payment information and
          follow payment verification status.
        </p>
      </section>

      {loadError && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800">
            Billing information could not be loaded
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {loadError}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={FileText}
          label="Invoices"
          value={summary.invoices}
          loading={loading}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Verification"
          value={summary.pending}
          loading={loading}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved Payments"
          value={summary.approved}
          loading={loading}
        />
      </section>

      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Billing Services
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Manage your payments
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Payment Process
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          How payment verification works
        </h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProcessStep
            number="01"
            title="Invoice"
            text="An invoice is generated for the relevant reservation, booking or order."
          />

          <ProcessStep
            number="02"
            title="Bank Payment"
            text="The customer completes the required bank payment."
          />

          <ProcessStep
            number="03"
            title="Submit Payment"
            text="The customer submits the transaction information for verification."
          />

          <ProcessStep
            number="04"
            title="Verification"
            text="An authorized cashier approves or rejects the payment."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  loading,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function ProcessStep({ number, title, text }) {
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