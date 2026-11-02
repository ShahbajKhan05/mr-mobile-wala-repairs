
"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Smartphone,
  IndianRupee,

  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { getJobs, type RepairJob } from "@/lib/jobs";

type Customer = {
  key: string;
  name: string;
  phone: string;
  jobs: RepairJob[];
  totalSpent: number;
  pendingAmount: number;
  lastVisit: string;
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").slice(-10);
}

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  return digits;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function Customers() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const savedJobs = await getJobs();
      setJobs(savedJobs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const customers = useMemo<Customer[]>(() => {
    const groups = new Map<string, RepairJob[]>();

    jobs.forEach((job) => {
      const phone = normalizePhone(job.phone);
      const key = phone || job.id;

      const existing = groups.get(key) ?? [];
      existing.push(job);
      groups.set(key, existing);
    });

    return Array.from(groups.entries())
      .map(([key, customerJobs]) => {
        const sortedJobs = [...customerJobs].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        const latestJob = sortedJobs[0];

        return {
          key,
          name: latestJob.customerName,
          phone: latestJob.phone,
          jobs: sortedJobs,
          totalSpent: sortedJobs.reduce(
            (total, job) =>
              total +
              (job.paymentStatus === "Paid"
                ? Number(job.estimate) || 0
                : 0),
            0
          ),
          pendingAmount: sortedJobs.reduce(
            (total, job) =>
              total +
              (job.paymentStatus === "Pending"
                ? Number(job.estimate) || 0
                : 0),
            0
          ),
          lastVisit: latestJob.createdAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastVisit).getTime() -
          new Date(a.lastVisit).getTime()
      );
  }, [jobs]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.jobs.some((job) =>
          job.id.toLowerCase().includes(query)
        )
    );
  }, [customers, search]);

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const totalPending = customers.reduce(
    (total, customer) => total + customer.pendingAmount,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              MR MOBILE WALA REPAIRS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your customers and their complete repair history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCustomers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Customers</p>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Users size={20} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {customers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Received</p>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <IndianRupee size={20} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Pending Amount</p>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                <ClipboardList size={20} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-amber-600">
              {formatCurrency(totalPending)}
            </p>
          </div>
        </div>

        {/* Customer List */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer, WhatsApp or job ID..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <span className="text-sm text-slate-500">
              {filteredCustomers.length} customers
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
              Loading customers...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => void loadCustomers()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                <Users size={30} />
              </div>

              <h2 className="mt-4 font-bold text-slate-900">
                {customers.length === 0
                  ? "No customers yet"
                  : "No matching customers"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {customers.length === 0
                  ? "Customers will automatically appear here when you create repair job cards."
                  : "Try searching with a different name or WhatsApp number."}
              </p>

              {customers.length === 0 && (
                <Link
                  href="/jobs"
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <article
                  key={customer.key}
                  className="flex flex-col gap-4 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-slate-900">
                        {customer.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {customer.phone}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Smartphone size={13} />
                          {customer.jobs.length} repair{" "}
                          {customer.jobs.length === 1 ? "job" : "jobs"}
                        </span>

                        <span>
                          Last visit: {formatDate(customer.lastVisit)}
                        </span>
                      </div>

                      <Link
                        href={`/customers/${encodeURIComponent(customer.phone)}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                      >
                        View Profile
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <div className="min-w-28">
                      <p className="text-xs text-slate-400">
                        Total Spent
                      </p>
                      <p className="mt-1 font-bold text-emerald-600">
                        {formatCurrency(customer.totalSpent)}
                      </p>

                      <p className="mt-1 text-xs text-amber-600">
                        Pending: {formatCurrency(customer.pendingAmount)}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${getWhatsAppNumber(customer.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${customer.name}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <WhatsAppIcon size={17} />
                      WhatsApp
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filteredCustomers.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          )}
        </section>
      </div>
    </main>
  );
}