"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Printer, ShieldCheck, AlertCircle } from "lucide-react";
import { formatWarrantyDate, isWarrantyActive, getRemainingWarrantyDays } from "@/lib/warranty";

type WarrantyJob = {
  jobNumber: string; customerName: string; brand: string; model: string;
  paymentStatus: string; warrantyDays: number;
  warrantyStartDate: string | null; warrantyEndDate: string | null;
};

export default function CustomerWarrantyCard({ token }: { token: string }) {
  const [job, setJob] = useState<WarrantyJob | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(token)}`, { cache: "no-store", signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Warranty link is unavailable.");
        setJob(result.job);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load warranty card.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [token]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Loading warranty card...</main>;
  if (error || !job || job.paymentStatus !== "Paid" || !job.warrantyStartDate || !job.warrantyEndDate) {
    return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center"><AlertCircle size={32} className="text-amber-600" /><h1 className="mt-4 text-xl font-bold text-slate-900">Warranty Card Unavailable</h1><p className="mt-2 max-w-md text-sm text-slate-500">{error || "The warranty card becomes available after payment is marked as Paid."}</p><Link href={`/track/${encodeURIComponent(token)}`} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">Back to Repair Tracking</Link></main>;
  }

  const active = isWarrantyActive(job.warrantyEndDate, new Date(), job.warrantyExpiresAt);
  const remaining = getRemainingWarrantyDays(job.warrantyEndDate, new Date(), job.warrantyExpiresAt);
  const warrantyId = job.jobNumber;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/track/${encodeURIComponent(token)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700"><ArrowLeft size={16}/> Back to Tracking</Link>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"><Printer size={16}/> Print / Save PDF</button>
        </div>
        <article id="warranty-card" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl print:rounded-none print:border-2 print:border-slate-300 print:shadow-none">
          <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10"/>
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={190} height={64} className="h-auto w-36 rounded-lg bg-white/95 p-1 object-contain" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">Digital Repair Warranty</p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">Warranty Card</h1>
              </div>
              <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider">7 DAYS</span>
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              <div><p className="text-[10px] uppercase tracking-widest text-blue-200">Warranty Holder</p><p className="mt-1 break-words text-xl font-bold">{job.customerName}</p><p className="mt-1 text-sm text-blue-100">{job.brand} {job.model}</p></div>
              <div className="sm:text-right"><p className="text-[10px] uppercase tracking-widest text-blue-200">Warranty / Job ID</p><p className="mt-1 break-all text-lg font-bold">{warrantyId}</p></div>
            </div>
          </header>
          <section className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-10">
            <div className={`sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${active ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
              <div className={`flex items-center gap-2 font-bold ${active ? "text-emerald-800" : "text-red-800"}`}><ShieldCheck size={20}/>{active ? "Warranty Active" : "Warranty Expired"}</div>
              <p className="text-sm font-bold text-slate-700">{active ? `${remaining} days remaining` : "0 days remaining"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Warranty Start</p><p className="mt-1 font-bold text-slate-900">{formatWarrantyDate(job.warrantyStartDate)}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Warranty Expiry</p><p className="mt-1 font-bold text-slate-900">{formatWarrantyDate(job.warrantyEndDate)}</p></div>
            <div className="sm:col-span-2 rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarDays size={17}/> Warranty Terms</div><ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600"><li>• Warranty period is 7 days from the recorded payment date.</li><li>• Keep this card and Job ID for verification.</li><li>• Physical or liquid damage and unrelated faults are not covered unless explicitly agreed by the shop.</li><li>• Final eligibility is subject to inspection and the terms agreed at the time of repair.</li></ul></div>
          </section>
          <footer className="border-t border-slate-200 px-6 py-4 text-center text-[10px] font-semibold tracking-wide text-slate-500 sm:px-10">MR MOBILE WALA REPAIRS · REWA · PRIVATE DIGITAL WARRANTY</footer>
        </article>
      </div>
      <style jsx global>{`@media print { @page { size: A4; margin: 12mm; } body { background: white !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; } body * { visibility: hidden; } #warranty-card, #warranty-card * { visibility: visible; } #warranty-card { position: absolute; inset: 0; width: 100%; border-radius: 0; box-shadow: none; } }`}</style>
    </main>
  );
}
