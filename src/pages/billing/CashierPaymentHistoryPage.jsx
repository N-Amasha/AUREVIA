import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  History,
  LoaderCircle,
  Search,
  XCircle,
} from "lucide-react";

import { getPaymentsByStatus } from "../../api/billingApi";

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

export default function CashierPaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const [approved, rejected] = await Promise.all([
          getPaymentsByStatus("APPROVED"),
          getPaymentsByStatus("REJECTED"),
        ]);

        const processedPayments = [
          ...approved,
          ...rejected,
        ].sort(
          (first, second) =>
            new Date(second.verifiedAt ?? 0) -
            new Date(first.verifiedAt ?? 0),
        );

        setPayments(processedPayments);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ??
            "Unable to load payment history.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const approvedCount = payments.filter(
    (payment) => payment.paymentStatus === "APPROVED",
  ).length;

  const rejectedCount = payments.filter(
    (payment) => payment.paymentStatus === "REJECTED",
  ).length;

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
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

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.paymentStatus === statusFilter;

      const matchesDate =
        !dateFilter ||
        payment.verifiedAt?.slice(0, 10) === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payments, searchTerm, statusFilter, dateFilter]);

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
          Payment history
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Review approved and rejected payment verification
          decisions.
        </p>
      </section>

      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={History}
          label="Processed Payments"
          value={payments.length}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved Payments"
          value={approvedCount}
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected Payments"
          value={rejectedCount}
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
              placeholder="Search payment, invoice or customer"
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
            <option value="ALL">All Decisions</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600"
          />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <History className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Processed payments
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                {filteredPayments.length} processed payment
                {filteredPayments.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-9 gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
          <span>Payment</span>
          <span>Invoice</span>
          <span>Customer</span>
          <span>Reference</span>
          <span>Amount</span>
          <span>Payment Date</span>
          <span>Processed</span>
          <span>Decision</span>
          <span>Action</span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <History className="h-6 w-6 text-primary-700" />
            </div>

            <h3 className="mt-5 font-semibold text-primary-950">
              No processed payments available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              No payment records match the current filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredPayments.map((payment) => (
              <article
                key={payment.paymentId}
                className="grid gap-4 px-6 py-5 xl:grid-cols-9 xl:items-center"
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
                  label="Reference"
                  value={payment.transactionReference}
                />

                <DataItem
                  label="Amount"
                  value={formatCurrency(payment.amount)}
                  strong
                />

                <DataItem
                  label="Payment Date"
                  value={formatDateTime(payment.paymentDate)}
                />

                <DataItem
                  label="Processed"
                  value={formatDateTime(payment.verifiedAt)}
                />

                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.paymentStatus === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </div>

                <div>
                  <Link
                    to={`/cashier/payments/${payment.paymentId}`}
                    className="text-sm font-semibold text-primary-700 hover:text-primary-950"
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Payment Decisions
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Verification history
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <CheckCircle2 className="h-5 w-5 text-primary-300" />

            <h3 className="mt-3 font-semibold">Approved</h3>

            <p className="mt-2 text-sm leading-6 text-stone-300">
              The cashier approved the submitted payment
              information.
            </p>
          </div>

          <div>
            <XCircle className="h-5 w-5 text-red-300" />

            <h3 className="mt-3 font-semibold">Rejected</h3>

            <p className="mt-2 text-sm leading-6 text-stone-300">
              The cashier rejected the submitted payment
              information.
            </p>
          </div>
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
      <p className="text-xs font-semibold uppercase text-stone-400 xl:hidden">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm text-stone-700 xl:mt-0 ${
          strong ? "font-semibold text-primary-950" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}