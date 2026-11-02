
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  RotateCw,
  AlertCircle,
} from "lucide-react";
import { getJobById, type RepairJob } from "@/lib/jobs";
import {
  getShopSettings,
  defaultShopSettings,
  type ShopSettings,
} from "@/lib/settings";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

export default function JobWarranty() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<RepairJob | null>(null);
  const [settings, setSettings] =
    useState<ShopSettings>(defaultShopSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadWarranty() {
      try {
        const [result, shopSettings] = await Promise.all([
          getJobById(params.id),
          getShopSettings().catch(() => defaultShopSettings),
        ]);

        if (!active) return;

        setSettings(shopSettings);

        if (!result) {
          setError("Repair job not found.");
          return;
        }

        if (result.paymentStatus !== "Paid" || !result.paidAt) {
          setError(
            "Warranty card is available only after payment is marked as Paid."
          );
          return;
        }

        setJob(result);
      } catch {
        if (active) {
          setError("Unable to load warranty details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadWarranty();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Loading digital warranty card...
      </div>
    );
  }

  if (error || !job || !job.paidAt) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
          <AlertCircle size={30} />
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Warranty Unavailable
        </h1>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          {error || "Warranty details could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() => router.push(`/jobs/${params.id}`)}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Job Details
        </button>
      </main>
    );
  }

  const shopName =
    settings.shopName.trim() || defaultShopSettings.shopName;

  const warrantyDays = 7;

  const expiryDate = addDays(job.paidAt, warrantyDays);

  const today = new Date();

  const active = today.getTime() <= expiryDate.getTime();

  const remainingDays = active
    ? Math.max(
        0,
        Math.ceil(
          (expiryDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const warrantyPeriod = `${warrantyDays} Days`;

  const whatsappMessage = encodeURIComponent(
    `${shopName} - DIGITAL WARRANTY CARD\n\n` +
      `Warranty ID: ${job.id}\n` +
      `Customer: ${job.customerName}\n` +
      `Device: ${job.brand} ${job.model}\n` +
      `Warranty Start: ${formatDate(job.paidAt)}\n` +
      `Warranty Expiry: ${formatDate(expiryDate.toISOString())}\n` +
      `Warranty Period: ${warrantyPeriod}\n` +
      `Status: ${active ? "Active" : "Expired"}\n\n` +
      `${settings.phone ? `Shop Contact: ${settings.phone}\n` : ""}` +
      `Please keep this warranty ID safe.`
  );

  function handlePrint() {
    window.print();
  }

  return (
    <main className="box-border min-h-screen w-full overflow-x-clip bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full min-w-0 max-w-5xl space-y-7">

        {/* Header */}
        <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600 print:hidden"
            >
              <ArrowLeft size={17} />
              Back to Job Details
            </button>

            <p className="break-words text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              {shopName}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Digital Warranty Card
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Your repair warranty information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:flex print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <Printer size={17} />
              Print / PDF
            </button>

            <a
              href={`https://wa.me/91${job.phone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Warranty Status */}
        <section
          className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center ${
            active
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-3 ${
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {active ? (
                <ShieldCheck size={25} />
              ) : (
                <AlertCircle size={25} />
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Warranty Status
              </p>

              <h2
                className={`mt-1 text-xl font-bold ${
                  active ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {active ? "Warranty Active" : "Warranty Expired"}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-500">
              {active ? "Remaining Warranty" : "Expired"}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {active ? `${remainingDays} Days` : "0 Days"}
            </p>
          </div>
        </section>

        {/* Flip Card */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between print:hidden">
            <p className="text-sm font-semibold text-slate-600">
              {flipped ? "Back Side" : "Front Side"}
            </p>

            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              <RotateCw size={16} />
              Flip Card
            </button>
          </div>

          <div
            className="w-full cursor-pointer [perspective:1200px] print:cursor-default"
            onClick={() => setFlipped((value) => !value)}
          >
            <div
              className={`relative aspect-[1.65/1] w-full transition-transform duration-700 [transform-style:preserve-3d] print:!transform-none ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* FRONT */}
              <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-5 text-white shadow-2xl [backface-visibility:hidden] sm:p-8 print:!hidden">
                <div className="absolute -right-20 -top-24 size-64 rounded-full border border-white/10" />
                <div className="absolute -right-10 -top-14 size-44 rounded-full border border-white/10" />
                <div className="absolute -bottom-28 -left-16 size-64 rounded-full bg-blue-400/10 blur-2xl" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={25} />
                        <p className="break-words text-sm font-black tracking-[0.16em] sm:text-base">
                          {shopName}
                        </p>
                      </div>

                      <p className="mt-2 text-[9px] font-medium tracking-[0.28em] text-blue-200 sm:text-xs">
                        DIGITAL REPAIR WARRANTY
                      </p>
                    </div>

                    <div className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold tracking-wider sm:text-xs">
                      {warrantyDays} DAYS
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                      Warranty Holder
                    </p>

                    <h2 className="mt-1 truncate text-xl font-bold sm:text-3xl">
                      {job.customerName}
                    </h2>

                    <p className="mt-2 text-xs text-blue-100 sm:text-sm">
                      {job.brand} {job.model}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[8px] font-medium uppercase tracking-widest text-blue-200 sm:text-[10px]">
                        Warranty / Job ID
                      </p>

                      <p className="mt-1 break-all text-xs font-bold tracking-wider sm:text-sm">
                        {job.id}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${
                          active ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <span className="text-[9px] font-bold uppercase tracking-wider sm:text-xs">
                        {active ? "Active" : "Expired"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8 print:!hidden">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-xs font-black tracking-widest text-blue-900 sm:text-sm">
                        {shopName}
                      </p>
                      <p className="mt-1 text-[9px] font-semibold tracking-wider text-slate-400 sm:text-xs">
                        WARRANTY DETAILS
                      </p>
                    </div>

                    <ShieldCheck size={30} className="shrink-0 text-blue-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <div className="min-w-0">
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Customer Mobile
                      </p>
                      <p className="mt-1 break-words text-xs font-bold sm:text-sm">
                        +91 {job.phone}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Device
                      </p>
                      <p className="mt-1 break-words text-xs font-bold sm:text-sm">
                        {job.brand} {job.model}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Warranty Start
                      </p>
                      <p className="mt-1 text-xs font-bold sm:text-sm">
                        {formatDate(job.paidAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 sm:text-xs">
                        Warranty Expiry
                      </p>
                      <p className="mt-1 text-xs font-bold sm:text-sm">
                        {formatDate(expiryDate.toISOString())}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-[9px] leading-4 text-slate-500 sm:text-xs">
                      Warranty is subject to shop inspection and applicable
                      repair terms. Keep this card and job ID for reference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-slate-400 print:hidden">
            Tap the card or Flip Card to view the other side.
          </p>
        </section>

        {/* Warranty Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Warranty Information
              </h2>
              <p className="text-xs text-slate-500">
                Your official repair warranty record
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              icon={<UserRound size={17} />}
              label="Customer"
              value={job.customerName}
            />

            <Detail
              icon={<Smartphone size={17} />}
              label="Device"
              value={`${job.brand} ${job.model}`}
            />

            <Detail
              icon={<ShieldCheck size={17} />}
              label="Job / Warranty ID"
              value={job.id}
            />

            <Detail
              icon={<CalendarDays size={17} />}
              label="Warranty Start"
              value={formatDate(job.paidAt)}
            />

            <Detail
              icon={<Clock size={17} />}
              label="Warranty Expiry"
              value={formatDate(expiryDate.toISOString())}
            />

            <Detail
              icon={<CheckCircle2 size={17} />}
              label="Warranty Period"
              value={warrantyPeriod}
            />
          </div>

          {settings.phone && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-700">
                Shop Contact
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {settings.phone}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Reported Repair Problem
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {job.problem}
            </p>
          </div>
        </section>

        {/* Terms */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Warranty Terms
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>
              • Warranty period is {warrantyDays} days from the recorded
              payment date.
            </li>
            <li>
              • Keep your Job ID and digital warranty card for verification.
            </li>
            <li>
              • Physical or liquid damage and unrelated faults are not covered
              unless explicitly agreed by the shop.
            </li>
            <li>
              • Final warranty eligibility is subject to inspection and the
              terms agreed at the time of repair.
            </li>
          </ul>
        </section>

        {/* Print-only back card */}
        <section className="hidden print:block">
          <div className="rounded-3xl border-2 border-slate-300 p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-blue-950">
                {shopName}
              </h2>
              <ShieldCheck size={32} />
            </div>

            <h3 className="mt-6 text-lg font-bold">
              WARRANTY CARD - BACK SIDE
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
              <Detail
                icon={<UserRound size={17} />}
                label="Customer"
                value={job.customerName}
              />
              <Detail
                icon={<Smartphone size={17} />}
                label="Device"
                value={`${job.brand} ${job.model}`}
              />
              <Detail
                icon={<CalendarDays size={17} />}
                label="Warranty Start"
                value={formatDate(job.paidAt)}
              />
              <Detail
                icon={<Clock size={17} />}
                label="Warranty Expiry"
                value={formatDate(expiryDate.toISOString())}
              />
              <Detail
                icon={<CheckCircle2 size={17} />}
                label="Warranty Period"
                value={warrantyPeriod}
              />
            </div>

            <p className="mt-8 border-t border-slate-300 pt-4 text-xs leading-5 text-slate-600">
              Keep this card and Job ID for reference. Warranty is subject to
              shop inspection and applicable repair terms.
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-slate-400 print:hidden">
          {shopName} · Digital Warranty Record
        </p>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          main,
          main * {
            visibility: visible;
          }

          main {
            position: absolute;
            inset: 0;
            width: 100%;
            min-height: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print\\:!hidden {
            display: none !important;
          }

          .print\\:!transform-none {
            transform: none !important;
          }

          section {
            break-inside: avoid;
            box-shadow: none !important;
          }

          a {
            text-decoration: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <p className="text-xs">{label}</p>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
