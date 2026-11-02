"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock3, IndianRupee, Package, Search, ShieldCheck, Smartphone, Wrench } from "lucide-react";

type Job = {
  jobNumber: string; customerName: string; brand: string; model: string; problem: string;
  estimate: number; status: string; paymentStatus: string; createdAt: string;
  warrantyDays: number; warrantyStartDate?: string | null; warrantyEndDate?: string | null;
  events: { description: string; created_at: string }[];
};
const stages = [
  { value: "Received", label: "Phone Received", icon: Smartphone },
  { value: "Part Ordered", label: "Part Ordered", icon: Package },
  { value: "Repairing", label: "Repairing", icon: Wrench },
  { value: "Ready", label: "Ready for Pickup", icon: CheckCircle2 },
];
const date = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)) : "—";

export default function CustomerRepairTracker() {
  const [jobNumber, setJobNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setJob(null); setLoading(true);
    try {
      const response = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobNumber, phone }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Repair not found.");
      setJob(result.job);
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setLoading(false); }
  }

  const active = job ? stages.findIndex((stage) => stage.value === job.status) : -1;
  return <main className="min-h-screen glass-page px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
    <div className="mx-auto max-w-2xl">
      <header className="mb-7 flex items-center justify-between"><a href="/" className="text-sm font-semibold text-[#59636A]">← Home</a><Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={170} height={58} className="h-auto w-32 object-contain" priority /></header>
      <section className="overflow-hidden glass-panel rounded-[30px] shadow-[0_24px_80px_rgba(44,62,100,0.10)]">
        <div className="border-b border-white/50 bg-gradient-to-br from-white/55 via-indigo-50/50 to-sky-50/60 px-6 py-9 text-slate-800 backdrop-blur-2xl sm:px-9"><span className="rounded-full border border border-indigo-200/60 bg-white/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">Customer Portal</span><h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Track your repair</h1><p className="mt-2 text-sm text-slate-500">Check repair progress, payment status and warranty details.</p></div>
        <div className="p-6 sm:p-9">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block text-xs font-bold text-[#59636A]">JOB NUMBER<input value={jobNumber} onChange={(e) => setJobNumber(e.target.value.toUpperCase())} placeholder="e.g. MR-123456" required className="mt-2 h-12 w-full glass-input rounded-xl px-4 text-sm text-slate-800 outline-none" /></label>
            <label className="block text-xs font-bold text-[#59636A]">REGISTERED MOBILE<input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" inputMode="numeric" required className="mt-2 h-12 w-full rounded-xl border border-[#E5E4DE] bg-[#FCFCFA] px-4 text-sm text-[#202B32] outline-none focus:border-[#B69A69]" /></label>
            <button disabled={loading || phone.length !== 10 || !jobNumber.trim()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-50"><Search size={16} />{loading ? "Checking…" : "Track"}</button>
          </form>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {!job && !error && <p className="mt-5 flex gap-2 glass-card rounded-2xl p-4 text-xs leading-5 text-[#697176]"><ShieldCheck size={18} className="shrink-0" />Enter the job number and the same mobile number registered at the shop.</p>}
          {job && <div aria-live="polite" className="mt-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEEDE8] pb-5"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#92784F]">Repair found</p><h2 className="mt-1 text-xl font-extrabold text-[#202B32]">{job.customerName}</h2><p className="mt-1 text-xs text-[#737B7E]">#{job.jobNumber} · {date(job.createdAt)}</p></div><span className="rounded-full bg-[#EEF4F0] px-3 py-1.5 text-xs font-bold text-[#356B4D]">{job.status === "Ready" ? "Ready for pickup" : job.status}</span></div>
            <div className="grid grid-cols-2 gap-3"><div className="glass-card rounded-2xl p-4"><Smartphone className="text-[#92784F]" /><p className="mt-2 text-[10px] font-bold text-[#929995]">DEVICE</p><p className="mt-1 text-sm font-bold text-[#26343C]">{job.brand} {job.model}</p></div><div className="rounded-2xl border border-[#EEEDE8] p-4"><Wrench className="text-[#92784F]" /><p className="mt-2 text-[10px] font-bold text-[#929995]">REPAIR ISSUE</p><p className="mt-1 text-sm font-bold text-[#26343C]">{job.problem}</p></div></div>
            <section className="glass-card rounded-2xl p-5"><h3 className="text-sm font-extrabold text-[#26343C]">Repair progress</h3><div className="mt-5">{stages.map((stage, index) => { const Icon = stage.icon; const done = active >= index; return <div key={stage.value} className="flex gap-3"><div className="flex flex-col items-center"><span className={"flex h-10 w-10 items-center justify-center rounded-full " + (done ? "bg-[#EAF2EC] text-[#397451]" : "bg-[#F1F1ED] text-[#A5AAA5]")}><Icon size={18} /></span>{index < 3 && <span className={"my-1 min-h-8 w-px " + (active > index ? "bg-[#8BB99A]" : "bg-[#E8E8E2]")} />}</div><div className="pb-6"><p className={"text-sm font-bold " + (done ? "text-[#26343C]" : "text-[#A5AAA5]")}>{stage.label}{active === index ? " · Current" : ""}</p></div></div>; })}</div></section>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#F8F7F3] p-4"><p className="text-[10px] font-bold text-[#8A918D]">ESTIMATED COST</p><p className="mt-2 flex items-center text-xl font-extrabold text-[#26343C]"><IndianRupee size={18} />{job.estimate.toLocaleString("en-IN")}</p></div><div className="rounded-2xl bg-[#F8F7F3] p-4"><p className="text-[10px] font-bold text-[#8A918D]">PAYMENT</p><p className="mt-2 text-sm font-extrabold text-[#26343C]">{job.paymentStatus}</p></div></div>
            {job.status === "Ready" && <div className="glass-card rounded-2xl p-5"><h3 className="text-sm font-extrabold text-[#80663B]">Your phone is ready!</h3><p className="mt-2 text-xs text-[#777064]">Please contact the shop to arrange pickup.</p></div>}
            {job.paymentStatus === "Paid" && job.warrantyDays > 0 && <div className="glass-card rounded-2xl p-5"><h3 className="flex items-center gap-2 text-sm font-extrabold text-emerald-800"><ShieldCheck size={18} />{job.warrantyDays}-day digital warranty active</h3><p className="mt-2 text-xs text-emerald-800/80">Valid {date(job.warrantyStartDate)} – {date(job.warrantyEndDate)}</p></div>}
            {!!job.events.length && <section className="rounded-2xl border border-[#EEEDE8] p-5"><h3 className="text-sm font-extrabold text-[#26343C]">Update history</h3><div className="mt-4 space-y-4">{[...job.events].reverse().map((item, i) => <div key={item.created_at + i} className="flex gap-3"><Clock3 size={16} className="mt-0.5 text-[#92784F]" /><div><p className="text-xs font-semibold text-[#3E494D]">{item.description}</p><p className="mt-1 text-[10px] text-[#969D99]">{date(item.created_at)}</p></div></div>)}</div></section>}
          </div>}
        </div>
      </section>
      <footer className="mt-6 text-center text-[11px] text-[#929995]">MR MOBILE WALA REPAIRS · Rewa</footer>
    </div>
  </main>;
}
