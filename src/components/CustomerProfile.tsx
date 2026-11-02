
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Smartphone,
  Phone,
  MessageCircle,
  CalendarDays,
  IndianRupee,
  ClipboardList,
  CheckCircle2,
  Clock,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { getJobs, type RepairJob } from "@/lib/jobs";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  return digits;
}

function getStatusStyle(status: RepairJob["status"]) {
  const styles: Record<RepairJob["status"], string> = {
    Received: "bg-blue-50 text-blue-700",
    "Part Ordered": "bg-amber-50 text-amber-700",
    Repairing: "bg-violet-50 text-violet-700",
    Ready: "bg-emerald-50 text-emerald-700",
  };

  return styles[status];
}

export default function CustomerProfile() {
  const params = useParams<{ phone: string }>();
  const router = useRouter();

  const phoneParam = decodeURIComponent(params.phone || "");

  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const savedJobs = await getJobs();

      const customerJobs = savedJobs
        .filter(
          (job) =>
            normalizePhone(job.phone) === normalizePhone(phoneParam)
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      setJobs(customerJobs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer profile."
      );
    } finally {
      setLoading(false);
    }
  }, [phoneParam]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const customer = jobs[0];

  const stats = useMemo(() => {
    return {
      totalJobs: jobs.length,
      paidJobs: jobs.filter((job) => job.paymentStatus === "Paid").length,
      pendingJobs: jobs.filter(
        (job) => job.paymentStatus === "Pending"
      ).length,
      totalSpent: jobs.reduce(
        (total, job) =>
          total +
          (job.paymentStatus === "Paid"
            ? Number(job.estimate) || 0
            : 0),
        0
      ),
      pendingAmount: jobs.reduce(
        (total, job) =>
          total +
          (job.paymentStatus === "Pending"
            ? Number(job.estimate) || 0
            : 0),
        0
      ),
    };
  }, [jobs]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-5">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-blue-600" size={28} />
          <p className="mt-3 text-sm text-slate-500">
            Loading customer profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <UserRound className="mx-auto text-slate-300" size={40} />

          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Customer not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "This customer does not have any saved repair records."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/customers")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Customers
          </button>
        </div>
      </main>
    );
  }

  const whatsappNumber = getWhatsAppNumber(customer.phone);

  const whatsappMessage = encodeURIComponent(
    `Hello ${customer.customerName}, thank you for choosing MR MOBILE WALA REPAIRS. How can we help you?`
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back and Header */}
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Customers
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                MR MOBILE WALA REPAIRS
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Customer Profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Complete customer information and repair history.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <MessageCircle size={18} />
              WhatsApp Customer
            </a>
          </div>
        </div>

        {/* Customer Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-3xl font-bold text-blue-700 shadow-sm">
                {customer.customerName.charAt(0).toUpperCase()}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {customer.customerName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customer since {formatDate(
                    jobs[jobs.length - 1].createdAt
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    WhatsApp / Phone
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <Smartphone size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Total Repair Jobs
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {stats.totalJobs}{" "}
                    {stats.totalJobs === 1 ? "Job" : "Jobs"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Repairs</p>
              <ClipboardList className="text-blue-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stats.totalJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Spent</p>
              <IndianRupee className="text-emerald-600" size={21} />
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.totalSpent)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Payments Completed</p>
              <CheckCircle2 className="text-emerald-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stats.paidJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Pending Amount</p>
              <Clock className="text-amber-600" size={21} />
            </div>
            <p className="mt-3 text-2xl font-bold text-amber-600">
              {formatCurrency(stats.pendingAmount)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stats.pendingJobs} unpaid jobs
            </p>
          </div>
        </div>

        {/* Repair History */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Repair History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All repair jobs associated with this customer.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {stats.totalJobs} Records
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                    <Smartphone size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">
                      {job.brand} {job.model}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Job ID: {job.id}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {job.problem}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays size={13} />
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <div>
                    <p className="text-xs text-slate-400">Estimate</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {formatCurrency(Number(job.estimate) || 0)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${getStatusStyle(job.status)}`}
                    >
                      {job.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${
                        job.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {job.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Wrench size={16} />
                    Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => void loadProfile()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh History
          </button>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Smartphone size={17} />
            Create New Job
          </Link>
        </div>
      </div>
    </main>
  );
}