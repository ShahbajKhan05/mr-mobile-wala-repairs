"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2,
  ClipboardList, Clock3, IndianRupee, Package, Plus, RefreshCw,
  Smartphone, Users, Wallet, Wrench, AlertCircle,
} from "lucide-react";
import { getJobs, type RepairJob } from "@/lib/jobs";

const money = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(date);
};

const statusClass: Record<RepairJob["status"], string> = {
  Received: "bg-slate-100 text-slate-700 ring-slate-200",
  "Part Ordered": "bg-amber-50 text-amber-700 ring-amber-200",
  Repairing: "bg-blue-50 text-blue-700 ring-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const records = await getJobs();
      setJobs(records);
      setUpdatedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError("Dashboard data load nahi ho paaya. Refresh karke dobara try karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const metrics = useMemo(() => {
    const ready = jobs.filter((job) => job.status === "Ready").length;
    const active = jobs.filter((job) => job.status !== "Ready").length;
    const pending = jobs.filter((job) => job.paymentStatus === "Pending");
    const paid = jobs.filter((job) => job.paymentStatus === "Paid");
    const now = new Date();
    const monthRevenue = paid.reduce((sum, job) => {
      const paidDate = new Date(job.paidAt || job.createdAt);
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
        ? sum + Number(job.estimate || 0) : sum;
    }, 0);
    return {
      total: jobs.length, active, ready,
      pendingAmount: pending.reduce((sum, job) => sum + Number(job.estimate || 0), 0),
      pendingCount: pending.length,
      monthRevenue,
      paidCount: paid.length,
    };
  }, [jobs]);

  const recentJobs = useMemo(() => [...jobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 7), [jobs]);

  const statusCounts = useMemo(() => ([
    { label: "Received", count: jobs.filter((job) => job.status === "Received").length, color: "bg-slate-400" },
    { label: "Part Ordered", count: jobs.filter((job) => job.status === "Part Ordered").length, color: "bg-amber-400" },
    { label: "Repairing", count: jobs.filter((job) => job.status === "Repairing").length, color: "bg-blue-500" },
    { label: "Ready", count: jobs.filter((job) => job.status === "Ready").length, color: "bg-emerald-500" },
  ]), [jobs]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  }, []);

  const cards = [
    { label: "Total repair jobs", value: metrics.total.toLocaleString("en-IN"), note: "All registered jobs", icon: ClipboardList, tone: "bg-violet-50 text-violet-700" },
    { label: "Active repairs", value: metrics.active.toLocaleString("en-IN"), note: "Not marked ready", icon: Wrench, tone: "bg-blue-50 text-blue-700" },
    { label: "Ready for pickup", value: metrics.ready.toLocaleString("en-IN"), note: "Awaiting handover", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Pending payments", value: money(metrics.pendingAmount), note: `${metrics.pendingCount} unpaid jobs`, icon: Wallet, tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] glass-page px-3 py-4 sm:px-6 sm:py-8 xl:px-9">
      <div className="mx-auto max-w-[1500px] space-y-4 sm:space-y-6">
        <section className="relative overflow-hidden rounded-[20px] border border-white/80 bg-white/55 px-4 py-5 sm:rounded-[28px] sm:px-8 sm:py-8 text-slate-900 shadow-[0_18px_55px_rgba(39,55,95,0.10)] backdrop-blur-2xl shadow-[0_18px_50px_rgba(23,27,46,.14)] sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-110px] right-[28%] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-indigo-100">
                <Activity size={14} /> SHOP OVERVIEW
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{greeting}, welcome back 👋</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Yahan se apne repair jobs, customer payments aur shop activity manage karein.</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} />{new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void loadDashboard()} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-slate-900 transition hover:bg-white/15 disabled:opacity-60">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
              <Link href="/jobs" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-950/15 hover:bg-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50">
                <Plus size={17} /> Create Job Card <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}

        <section aria-label="Repair shop statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return <article key={card.label} className="group rounded-2xl glass-card rounded-2xl p-4 sm:p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,.08)]">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[12px] font-semibold text-slate-500">{card.label}</p><p className="mt-3 text-[27px] font-bold tracking-tight text-slate-900">{loading ? <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-slate-100" /> : card.value}</p></div>
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}><Icon size={20} /></span>
              </div>
              <p className="mt-3 text-xs text-slate-500">{card.note}</p>
            </article>;
          })}
        </section>

        <section className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.85fr)]">
          <article className="min-w-0 overflow-hidden rounded-2xl glass-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/70 px-5 py-5 sm:px-6">
              <div><h2 className="font-bold text-slate-900">Recent repair jobs</h2><p className="mt-1 text-xs text-slate-500">Latest jobs saved in your shop</p></div>
              <Link href="/jobs/list" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 transition hover:text-indigo-800">View all jobs <ArrowRight size={14} /></Link>
            </div>
            {loading ? <div className="space-y-4 p-6">{Array.from({length:4}).map((_,i)=><div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}</div> : recentJobs.length === 0 ? <div className="flex flex-col items-center px-5 py-12 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Smartphone size={25}/></span><h3 className="mt-4 font-bold text-slate-800">No repair jobs yet</h3><p className="mt-1 max-w-xs text-sm text-slate-500">Create your first job card to see customer repairs here.</p><Link href="/jobs" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/55 text-slate-800 shadow-[0_18px_55px_rgba(39,55,95,0.10)] backdrop-blur-2xl px-4 py-2.5 text-xs font-bold text-slate-900"><Plus size={15}/> Create first job</Link></div> :
              <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-white/45 text-[10px] font-bold uppercase tracking-[.12em] text-slate-500"><tr><th className="px-5 py-3.5 sm:px-6">Job / Customer</th><th className="px-4 py-3.5">Device</th><th className="px-4 py-3.5">Estimate</th><th className="px-4 py-3.5">Status</th><th className="px-5 py-3.5">Date</th></tr></thead><tbody>{recentJobs.map((job)=><tr key={job.id} className="border-t border-white/70 transition hover:bg-white/50"><td className="px-5 py-4 sm:px-6"><Link href={`/jobs/${encodeURIComponent(job.id)}`} className="font-bold text-slate-800 hover:text-indigo-700">{job.id}</Link><p className="mt-1 text-xs text-slate-500">{job.customerName}</p></td><td className="px-4 py-4"><p className="text-sm font-semibold text-slate-700">{job.brand} {job.model}</p><p className="mt-1 max-w-[170px] truncate text-xs text-slate-500">{job.problem}</p></td><td className="px-4 py-4 text-sm font-semibold text-slate-700">{money(Number(job.estimate || 0))}<p className={`mt-1 text-[10px] font-semibold ${job.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>{job.paymentStatus === "Paid" ? "Paid" : "Payment pending"}</p></td><td className="px-4 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusClass[job.status]}`}>{job.status}</span></td><td className="px-5 py-4 text-xs text-slate-500">{dateLabel(job.createdAt)}</td></tr>)}</tbody></table></div>}
          </article>

          <div className="space-y-5">
            <article className="rounded-2xl glass-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Job status overview</h2><p className="mt-1 text-xs text-slate-500">Current repair pipeline</p></div><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700"><Activity size={18}/></span></div>
              <div className="mt-6 space-y-4">{statusCounts.map((item)=>{const percent=jobs.length?Math.round(item.count/jobs.length*100):0;return <div key={item.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-slate-600">{item.label}</span><span className="font-bold tabular-nums text-slate-800">{loading?"—":item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{width:`${percent}%`}}/></div></div>})}</div>
              <p className="mt-5 border-t border-white/70 pt-4 text-[11px] text-slate-500">{jobs.length} total jobs · Live database data</p>
            </article>
            <article className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-4 sm:p-6">
              <div className="flex items-center gap-2 text-amber-800"><Clock3 size={17}/><h2 className="text-sm font-bold">Payment follow-up</h2></div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{loading?"—":money(metrics.pendingAmount)}</p>
              <p className="mt-1 text-xs text-slate-500">{metrics.pendingCount} jobs with payment pending</p>
              <Link href="/jobs/list" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950">Review job payments <ArrowRight size={14}/></Link>
            </article>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {label:"All repair jobs",href:"/jobs/list",icon:ClipboardList,desc:"Find and update jobs"},
            {label:"Customers",href:"/customers",icon:Users,desc:"Customer records"},
            {label:"Parts inventory",href:"/inventory",icon:Package,desc:"Stock and spare parts"},
            {label:"Business analytics",href:"/analytics",icon:IndianRupee,desc:"Revenue and reports"},
          ].map((item)=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className="group rounded-2xl border border-white/75 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-700"><Icon size={19}/></span><p className="mt-3 text-sm font-bold text-slate-800">{item.label}</p><p className="mt-1 text-[11px] text-slate-500">{item.desc}</p></Link>})}
        </section>
        <p className="flex items-center justify-end gap-1.5 text-[11px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>{updatedAt ? `Data refreshed at ${updatedAt}` : "Connected to repair records"}</p>
      </div>
    </main>
  );
}
