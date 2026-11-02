"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  ShieldCheck,
  Smartphone,
  Wrench,
  AlertCircle,
} from "lucide-react";

type TrackingJob = {
  jobNumber: string;
  customerName: string;
  brand: string;
  model: string;
  problem: string;
  estimate: number;
  status: string;
  paymentStatus: string;
  pickupStatus: string;
  createdAt: string;
  warrantyDays: number;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  photos: { key: string; name: string; type: string; url: string }[];
  events: { event_type: string; description: string; created_at: string }[];
};

const stages = [
  { value: "Received", label: "Phone received", icon: Smartphone },
  { value: "Part Ordered", label: "Part ordered", icon: Package },
  { value: "Repairing", label: "Repair in progress", icon: Wrench },
  { value: "Ready", label: "Ready for pickup", icon: CheckCircle2 },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function PrivateRepairTracker({ token }: { token: string }) {
  const [job, setJob] = useState<TrackingJob | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(token)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Private tracking link is invalid.");
        }
        setJob(result.job);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unable to load repair details.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [token]);

  const activeIndex = job ? stages.findIndex((stage) => stage.value === job.status) : -1;

  return (
    <main className="min-h-screen glass-page px-3 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-7">
          <a href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-700">← Home</a>
          <Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={170} height={58} className="h-auto w-28 object-contain sm:w-36" priority />
        </header>

        <section className="overflow-hidden rounded-[24px] border border-white/80 bg-white/60 shadow-[0_20px_65px_rgba(44,62,100,0.10)] backdrop-blur-2xl sm:rounded-[30px]">
          <div className="border-b border-white/70 bg-gradient-to-br from-white/70 via-indigo-50/60 to-sky-50/60 px-5 py-6 sm:px-8 sm:py-8">
            <span className="inline-flex rounded-full border border-indigo-200/70 bg-white/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              Private Customer Portal
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your repair, live updates.</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">This private link gives you secure access to your repair details. Keep it safe.</p>
          </div>

          <div className="p-4 sm:p-8">
            {loading && (
              <div className="flex min-h-44 items-center justify-center gap-3 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                Loading your repair…
              </div>
            )}

            {!loading && error && (
              <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                <AlertCircle size={22} />
                <h2 className="mt-3 font-bold">Tracking link unavailable</h2>
                <p className="mt-1 text-sm leading-6">{error}</p>
                <p className="mt-3 text-xs">Please contact MR MOBILE WALA to request a fresh private link.</p>
                <a href="https://wa.me/919131383323" target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white">Contact on WhatsApp</a>
              </div>
            )}

            {job && (
              <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/70 pb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-600">Repair job · {job.jobNumber}</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Hello, {job.customerName}</h2>
                    <p className="mt-1 text-[11px] text-slate-500">Booked {formatDate(job.createdAt)}</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-800">{job.status === "Ready" ? "Ready for pickup" : job.status}</span>
                </div>

                <section className="rounded-2xl border border-white/80 bg-white/55 p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-slate-900">Repair progress</h3>
                  <div className="mt-5 grid grid-cols-4 gap-1 sm:gap-3">
                    {stages.map((stage, index) => {
                      const Icon = stage.icon;
                      const completed = activeIndex >= index;
                      return (
                        <div key={stage.value} className="min-w-0 text-center">
                          <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11 ${completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                            <Icon size={17} />
                          </div>
                          <p className={`mt-2 text-[9px] font-semibold leading-4 sm:text-[11px] ${completed ? "text-slate-800" : "text-slate-400"}`}>{stage.label}</p>
                          {index < 3 && <div className={`mt-2 hidden h-1 rounded-full sm:block ${activeIndex > index ? "bg-emerald-300" : "bg-slate-100"}`} />}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white/60 p-4">
                    <Smartphone className="text-indigo-600" size={18} />
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">Your device</p>
                    <p className="mt-1 break-words text-sm font-bold text-slate-800">{job.brand} {job.model}</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/60 p-4">
                    <IndianRupee className="text-indigo-600" size={18} />
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">Estimated amount</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">₹{job.estimate.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <section className="rounded-2xl border border-white/80 bg-white/60 p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-slate-900">Reported issue</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-600">{job.problem}</p>
                </section>

                {job.photos.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm font-bold text-slate-900">Device photos</h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                      {job.photos.map((photo) => (
                        <a key={photo.key} href={photo.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-white/80 bg-white/60">
                          <img src={photo.url} alt={`${photo.key} side of device`} className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                          <p className="px-2 py-2 text-center text-[10px] font-semibold capitalize text-slate-600">{photo.key} side</p>
                        </a>
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Photos are available through secure, temporary links.</p>
                  </section>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white/60 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Payment</p>
                    <p className={`mt-2 text-sm font-bold ${job.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>{job.paymentStatus}</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/60 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pickup</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{job.pickupStatus === "Picked Up" ? "Picked up" : job.status === "Ready" ? "Awaiting pickup" : "Not ready"}</p>
                  </div>
                </div>

                {job.status === "Ready" && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                    <h3 className="text-sm font-bold text-indigo-900">Your phone is ready!</h3>
                    <p className="mt-1 text-xs leading-5 text-indigo-800">Please contact the shop to arrange collection.</p>
                  </div>
                )}

                {job.paymentStatus === "Paid" && job.warrantyDays > 0 && (
                  <section className="rounded-2xl border border-emerald-200 bg-emerald-50/75 p-4 sm:p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900"><ShieldCheck size={18} /> 7-day digital warranty</h3>
                    <p className="mt-2 text-xs text-emerald-800">Valid from {formatDate(job.warrantyStartDate)} to {formatDate(job.warrantyEndDate)}.</p>
                  </section>
                )}

                {!!job.events.length && (
                  <section className="rounded-2xl border border-white/80 bg-white/55 p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-slate-900">Repair update history</h3>
                    <div className="mt-4 space-y-4">
                      {[...job.events].reverse().map((event, index) => (
                        <div key={event.created_at + index} className="flex gap-3">
                          <Clock3 size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium leading-5 text-slate-700">{event.description}</p>
                            <p className="mt-1 text-[10px] text-slate-400">{formatDate(event.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </section>

        <p className="mt-4 text-center text-[10px] text-slate-400">MR MOBILE WALA REPAIRS · Rewa · Private customer tracking</p>
      </div>
    </main>
  );
}
