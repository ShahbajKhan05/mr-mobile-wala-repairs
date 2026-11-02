
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Smartphone,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import { getJobs, type RepairJob } from "@/lib/jobs";

export default function JobsList() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    setLoading(true);
    setError("");

    try {
      const savedJobs = await getJobs();
      setJobs(savedJobs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load repair jobs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialSearch = new URLSearchParams(window.location.search).get("search");
    if (initialSearch) setSearch(initialSearch);
    void loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.id.toLowerCase().includes(query) ||
        job.customerName.toLowerCase().includes(query) ||
        job.phone.includes(query) ||
        job.model.toLowerCase().includes(query);

      const matchesStatus = status === "All" || job.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function statusStyle(value: RepairJob["status"]) {
    const styles: Record<RepairJob["status"], string> = {
      Received: "bg-blue-50 text-blue-700",
      "Part Ordered": "bg-amber-50 text-amber-700",
      Repairing: "bg-violet-50 text-violet-700",
      Ready: "bg-emerald-50 text-emerald-700",
    };

    return styles[value];
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              MR MOBILE WALA REPAIRS
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              All Repair Jobs
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track your saved repair records.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadJobs()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              href="/jobs"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              <Plus size={18} />
              New Job
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm text-slate-500">Total Jobs</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {jobs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm text-slate-500">Received</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {jobs.filter((job) => job.status === "Received").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm text-slate-500">Repairing</p>
            <p className="mt-2 text-3xl font-bold text-violet-600">
              {jobs.filter((job) => job.status === "Repairing").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-sm text-slate-500">Ready for Pickup</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {jobs.filter((job) => job.status === "Ready").length}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job, customer, phone or model..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Part Ordered">Part Ordered</option>
              <option value="Repairing">Repairing</option>
              <option value="Ready">Ready</option>
            </select>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
              Loading repair jobs...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => void loadJobs()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                <ClipboardList size={30} />
              </div>
              <h2 className="mt-4 font-bold text-slate-900">
                {jobs.length === 0 ? "No repair jobs yet" : "No matching jobs"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {jobs.length === 0
                  ? "Create your first repair job to see it here."
                  : "Try a different search or status filter."}
              </p>
              {jobs.length === 0 && (
                <Link
                  href="/jobs"
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
              
<article
  key={job.id}
  className="flex flex-col gap-3 p-3 transition hover:bg-slate-50 sm:flex-row sm:gap-4 sm:p-5 sm:items-center sm:justify-between sm:p-5"
>
  <div className="flex min-w-0 items-start gap-3">
    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
      <Smartphone size={23} />
    </div>

    <div className="min-w-0">
      <p className="font-bold text-slate-900">
        {job.customerName}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {job.brand} {job.model}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {job.id} . {job.phone}
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
        {job.problem}
      </p>

      <Link
        href={`/jobs/${job.id}`}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
      >
        View Details <span aria-hidden="true">→</span>
      </Link>
    </div>
  </div>

  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
    <div className="text-sm text-slate-500">
      <div className="flex items-center gap-1">
        <CalendarDays size={14} />
        {formatDate(job.createdAt)}
      </div>
      <div className="mt-1 flex items-center gap-1 font-semibold text-slate-900">
        <IndianRupee size={14} />
        {job.estimate.toLocaleString("en-IN")}
      </div>
    </div>

    <div className="flex flex-col items-start gap-2">
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(job.status)}`}
      >
        {job.status}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          job.paymentStatus === "Paid"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        Payment: {job.paymentStatus}
      </span>
    </div>
  </div>
</article>

              ))}
            </div>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Showing {filteredJobs.length} of {jobs.length} repair jobs
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
