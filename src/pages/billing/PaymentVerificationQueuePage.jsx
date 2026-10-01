import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  FileCheck2,
  LoaderCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

import { getPaymentsByStatus } from "../../api/billingApi";

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(Number(value ?? 0));
}

function isToday(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function PaymentVerificationQueuePage() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [reviewedPayments, setReviewedPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const [pending, approved, rejected] =
          await Promise.all([
            getPaymentsByStatus("PENDING"),
            getPaymentsByStatus("APPROVED"),
            getPaymentsByStatus("REJECTED"),
          ]);

        setPendingPayments(pending);
        setReviewedPayments([...approved, ...rejected]);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load the payment verification queue.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const reviewedToday = reviewedPayments.filter((payment) =>
    isToday(payment.verifiedAt),
  ).length;

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return pendingPayments.filter((payment) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          `PAY-${payment.paymentId}`,
          `INV-${payment.invoiceId}`,
          payment.customerName,
          payment.transactionReference,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedSearch),
          );

      const matchesDate =
        !selectedDate ||
        payment.paymentDate?.slice(0, 10) === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [pendingPayments, searchTerm, selectedDate]);

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
          Payment verification
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review customer payments and process submissions awaiting
          verification.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Pending Verification"
          value={pendingPayments.length}
        />

        <SummaryCard
          icon={FileCheck2}
          label="Reviewed Today"
          value={reviewedToday}
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Awaiting Decision"
          value={filteredPayments.length}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search payment, invoice or customer"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600"
            />
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
          />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Verification queue
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {filteredPayments.length} pending payment
                {filteredPayments.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-8 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Payment</span>
          <span>Invoice</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Reference</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <ShieldCheck className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No payments awaiting verification
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              There are no pending payments matching the current
              filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredPayments.map((payment) => (
              <article
                key={payment.paymentId}
                className="grid gap-4 px-6 py-5 lg:grid-cols-8 lg:items-center"
              >
                <DataItem
                  label="Payment"
                  value={`PAY-${payment.paymentId}`}
                  strong
                />

                <DataItem
                  label="Invoice"
                  value={`INV-${payment.invoiceId}`}
                />

                <DataItem
                  label="Customer"
                  value={payment.customerName}
                />

                <DataItem
                  label="Payment Date"
                  value={formatDateTime(payment.paymentDate)}
                />

                <DataItem
                  label="Reference"
                  value={payment.transactionReference}
                />

                <DataItem
                  label="Amount"
                  value={formatCurrency(payment.amount)}
                  strong
                />

                <div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    {payment.paymentStatus}
                  </span>
                </div>

                <div>
                  <Link
                    to={`/cashier/payments/${payment.paymentId}`}
                    className="text-sm font-semibold text-primary-700 hover:text-primary-950"
                  >
                    Review
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Verification Process
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          From payment submission to cashier decision
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Pending"
            text="A customer submits payment information."
          />

          <FlowStep
            number="02"
            title="Review"
            text="The cashier opens the pending payment."
          />

          <FlowStep
            number="03"
            title="Compare"
            text="The payment is compared with its invoice."
          />

          <FlowStep
            number="04"
            title="Decide"
            text="The cashier approves or rejects the payment."
          />
        </div>
      </section>
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