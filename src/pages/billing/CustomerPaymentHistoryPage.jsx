import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  History,
  Search,
  XCircle,
} from "lucide-react";

import { getPaymentsByCustomer } from "../../api/billingApi";
import { getAuth } from "../../api/authStorage";

export default function CustomerPaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPayments() {
      const auth = getAuth();

      if (!auth?.userId) {
        setErrorMessage(
          "Your account information could not be found. Please sign in again.",
        );
        setLoading(false);
        return;
      }

      try {
        const response = await getPaymentsByCustomer(
          auth.userId,
        );

        setPayments(response);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load your payment history.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const availableStatuses = useMemo(
    () =>
      [...new Set(payments.map(
        (payment) => payment.paymentStatus,
      ))].filter(Boolean),
    [payments],
  );

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !normalizedSearch ||
        String(payment.paymentId)
          .includes(normalizedSearch) ||
        String(payment.invoiceId)
          .includes(normalizedSearch) ||
        payment.transactionReference
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        payment.paymentMethod
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchText, statusFilter]);

  const pendingCount = payments.filter(
    (payment) =>
      payment.paymentStatus?.toUpperCase() === "PENDING",
  ).length;

  const verifiedCount = payments.filter((payment) =>
    ["APPROVED", "VERIFIED"].includes(
      payment.paymentStatus?.toUpperCase(),
    ),
  ).length;

  const rejectedCount = payments.filter(
    (payment) =>
      payment.paymentStatus?.toUpperCase() === "REJECTED",
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
          Payment history
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review your submitted payment records and their cashier
          verification status.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">
            Unable to load payment history
          </p>

          <p className="mt-1 text-sm text-red-700">
            {errorMessage}
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Pending Verification"
          value={pendingCount}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Verified Payments"
          value={verifiedCount}
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected Payments"
          value={rejectedCount}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_230px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search by payment, invoice or reference"
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
              All Payment Statuses
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
            <History className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Payment records
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {filteredPayments.length} payment
                {filteredPayments.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-7 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
          <span>Payment</span>
          <span>Invoice</span>
          <span>Reference</span>
          <span>Payment Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-stone-600">
              Loading your payment history...
            </p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <EmptyState hasPayments={payments.length > 0} />
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredPayments.map((payment) => (
              <PaymentRow
                key={payment.paymentId}
                payment={payment}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Payment Status
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Understanding verification status
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <StatusExplanation
            icon={Clock3}
            title="Pending Verification"
            text="The payment has been submitted and is waiting for cashier review."
          />

          <StatusExplanation
            icon={CheckCircle2}
            title="Approved"
            text="The cashier reviewed and approved the submitted payment information."
          />

          <StatusExplanation
            icon={XCircle}
            title="Rejected"
            text="The cashier rejected the payment information and another submission may be required."
          />
        </div>
      </section>
    </div>
  );
}

function PaymentRow({ payment }) {
  return (
    <article className="grid gap-4 px-6 py-5 lg:grid-cols-7 lg:items-center">
      <RecordValue
        label="Payment"
        value={`PAY-${payment.paymentId}`}
        strong
      />

      <RecordValue
        label="Invoice"
        value={`INV-${payment.invoiceId}`}
      />

      <RecordValue
        label="Reference"
        value={payment.transactionReference}
      />

      <RecordValue
        label="Payment Date"
        value={formatDateTime(payment.paymentDate)}
      />

      <RecordValue
        label="Amount"
        value={formatCurrency(payment.amount)}
        strong
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
          Status
        </p>

        <span className={getStatusClasses(
          payment.paymentStatus,
        )}>
          {formatStatus(payment.paymentStatus)}
        </span>
      </div>

      <div>
        <Link
          to={`/customer/billing/invoices/${payment.invoiceId}`}
          className="inline-flex rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          View invoice
        </Link>
      </div>
    </article>
  );
}

function RecordValue({ label, value, strong = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 lg:hidden">
        {label}
      </p>

      <p
        className={`text-sm ${
          strong
            ? "font-semibold text-primary-950"
            : "text-stone-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ hasPayments }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
        <History className="h-6 w-6 text-primary-700" />
      </div>

      <h3 className="mt-5 font-semibold text-primary-950">
        {hasPayments
          ? "No matching payment records"
          : "No payment history available"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {hasPayments
          ? "Try changing your search text or status filter."
          : "Payments submitted for your invoices will appear here."}
      </p>

      {!hasPayments && (
        <Link
          to="/customer/billing/invoices"
          className="mt-5 inline-block text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          View My Invoices →
        </Link>
      )}
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

function StatusExplanation({ icon: Icon, title, text }) {
  return (
    <div>
      <Icon className="h-5 w-5 text-gold-400" />

      <h3 className="mt-3 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
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
    normalizedStatus === "APPROVED" ||
    normalizedStatus === "VERIFIED"
  ) {
    return "inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700";
  }

  if (normalizedStatus === "PENDING") {
    return "inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700";
  }

  if (normalizedStatus === "REJECTED") {
    return "inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700";
  }

  return "inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700";
}