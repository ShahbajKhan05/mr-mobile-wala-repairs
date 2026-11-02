"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";

type InvoiceJob = {
  jobNumber: string; customerName: string; customerPhone: string;
  brand: string; model: string; problem: string; estimate: number;
  paymentStatus: string; paidAt: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

export default function CustomerInvoice({ token }: { token: string }) {
  const [job, setJob] = useState<InvoiceJob | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(token)}`, { cache: "no-store", signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Invoice link is unavailable.");
        setJob(result.job);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load invoice.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [token]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">Loading invoice...</main>;
  if (error || !job || job.paymentStatus !== "Paid") return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center"><AlertCircle size={32} className="text-amber-600"/><h1 className="mt-4 text-xl font-bold text-slate-900">Invoice Unavailable</h1><p className="mt-2 max-w-md text-sm text-slate-500">{error || "The paid invoice is available after payment is marked as Paid."}</p><Link href={`/track/${encodeURIComponent(token)}`} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">Back to Repair Tracking</Link></main>;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/track/${encodeURIComponent(token)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft size={16}/> Back to Tracking</Link>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"><Download size={16}/> Download PDF</button>
        </div>
        <article id="paid-invoice" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10 print:rounded-none print:border-0 print:shadow-none">
          <header className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-7">
            <div><Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={190} height={64} className="h-auto w-40 object-contain"/><p className="mt-3 text-sm text-slate-500">Mobile Repair & Service · Rewa</p><p className="mt-1 text-xs text-slate-500">WhatsApp: +91 91313 83323</p></div>
            <div className="text-left sm:text-right"><h1 className="text-3xl font-black text-slate-900">INVOICE</h1><p className="mt-2 text-sm text-slate-500">Invoice No: {job.jobNumber}</p><p className="text-sm text-slate-500">Date: {formatDate(job.paidAt)}</p><span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">PAID</span></div>
          </header>
          <section className="grid gap-6 border-b border-slate-200 py-7 sm:grid-cols-2">
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</p><p className="mt-2 font-bold text-slate-900">{job.customerName}</p><p className="mt-1 text-sm text-slate-600">+91 {job.customerPhone}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Device Details</p><p className="mt-2 font-bold text-slate-900">{job.brand} {job.model}</p><p className="mt-1 text-sm text-slate-600">Job ID: {job.jobNumber}</p></div>
          </section>
          <section className="py-7">
            <h2 className="font-bold text-slate-900">Repair Description</h2>
            <div className="mt-4 flex justify-between gap-4 border-y border-slate-200 py-4 text-sm"><div className="min-w-0"><p className="font-semibold text-slate-800">Mobile repair service</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-500">{job.problem}</p></div><p className="shrink-0 font-bold text-slate-900">₹{job.estimate.toLocaleString("en-IN")}</p></div>
            <div className="ml-auto mt-5 max-w-xs space-y-2"><div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>₹{job.estimate.toLocaleString("en-IN")}</span></div><div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-900"><span>Total Paid</span><span>₹{job.estimate.toLocaleString("en-IN")}</span></div></div>
          </section>
          <section className="rounded-xl bg-emerald-50 p-4"><p className="text-sm font-bold text-emerald-800">Payment received successfully</p><p className="mt-1 text-xs text-emerald-700">Payment recorded on {formatDate(job.paidAt)}.</p></section>
          <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-500">Thank you for choosing MR MOBILE WALA REPAIRS.</footer>
        </article>
      </div>
      <style jsx global>{`@media print { @page { size: A4; margin: 12mm; } body { background: white !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; } body * { visibility: hidden; } #paid-invoice, #paid-invoice * { visibility: visible; } #paid-invoice { position: absolute; inset: 0; width: 100%; border: 0; border-radius: 0; box-shadow: none; } }`}</style>
    </main>
  );
}
