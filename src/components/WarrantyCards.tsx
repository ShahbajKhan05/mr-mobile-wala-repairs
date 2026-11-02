"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, RefreshCw, Search, ShieldCheck, Smartphone } from "lucide-react";
import { formatWarrantyDate, getWarrantyDetails, isWarrantyActive } from "@/lib/warranty";

type WarrantyListItem = {
  id: string; customerName: string; phone: string; brand: string; model: string;
  paymentStatus: string; paidAt?: string;
};

export default function WarrantyCards() {
  const [jobs, setJobs] = useState<WarrantyListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/warranties", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to load warranty cards.");
      setJobs(result.warranties ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load warranty cards.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const paidJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => job.paidAt)
      .filter((job) => !query || [job.id, job.customerName, job.phone, job.brand, job.model].some((value) => value.toLowerCase().includes(query)));
  }, [jobs, search]);

  const activeCount = paidJobs.filter((job) => {
    const warranty = getWarrantyDetails(job.paymentStatus, job.paidAt);
    return isWarrantyActive(warranty.endDate, new Date(), warranty.expiresAt);
  }).length;

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Business</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Warranty Cards</h1>
            <p className="mt-1 text-sm text-slate-500">Open and print digital warranty cards for paid repairs.</p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Paid repairs with warranty</p><p className="mt-1 text-2xl font-bold text-slate-900">{paidJobs.length}</p></div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs text-emerald-700">Currently active</p><p className="mt-1 text-2xl font-bold text-emerald-800">{activeCount}</p></div>
        </div>

        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job ID, customer, phone or device..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500" />
        </div>

        {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading warranty cards...</div> :
          error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm sm:p-5 text-red-700">{error}<button type="button" onClick={() => void load()} className="ml-3 font-bold underline">Try again</button></div> :
          paidJobs.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><ShieldCheck size={30} className="mx-auto text-slate-300" /><h2 className="mt-3 font-bold text-slate-800">No warranty cards found</h2><p className="mt-1 text-sm text-slate-500">Warranty cards appear here after a repair payment is marked Paid.</p></div> :
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {paidJobs.map((job) => {
                const warranty = getWarrantyDetails(job.paymentStatus, job.paidAt);
                const active = isWarrantyActive(warranty.endDate);
                return <article key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><Smartphone size={20} /></span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{job.customerName}</p>
                      <p className="mt-0.5 text-sm text-slate-600">{job.brand} {job.model}</p>
                      <p className="mt-1 text-xs text-slate-400">{job.id} · {job.phone}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={13} /> {formatWarrantyDate(warranty.startDate)} – {formatWarrantyDate(warranty.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{active ? "Active" : "Expired"}</span>
                    <Link href={`/jobs/${encodeURIComponent(job.id)}/warranty`} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">View Card</Link>
                  </div>
                </article>;
              })}
            </div>
          </section>
        }
      </div>
    </main>
  );
}
