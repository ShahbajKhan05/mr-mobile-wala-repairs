
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  MessageCircle,
} from "lucide-react";
import {
  getJobById,
  type RepairJob,
} from "@/lib/jobs";
import {
  getShopSettings,
  defaultShopSettings,
  type ShopSettings,
} from "@/lib/settings";
import {
  formatWarrantyDate,
  getWarrantyDetails,
  parseWarrantyTimestamp,
} from "@/lib/warranty";

export default function JobInvoice() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<RepairJob | null>(null);
  const [settings, setSettings] =
    useState<ShopSettings>(defaultShopSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoice() {
      try {
        const [jobResult, settingsResult] = await Promise.all([
          getJobById(params.id),
          getShopSettings().catch(() => defaultShopSettings),
        ]);

        if (!active) return;

        if (!jobResult) {
          setError("Repair job not found.");
        } else {
          setJob(jobResult);
        }

        setSettings(settingsResult);
      } catch {
        if (active) {
          setError("Unable to load invoice.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInvoice();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading invoice...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-6 text-center sm:p-10">
        <h1 className="text-xl font-bold">Invoice Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <button
          onClick={() => router.push("/jobs/list")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (job.paymentStatus !== "Paid") {
    return (
      <div className="p-6 text-center sm:p-10">
        <h1 className="text-xl font-bold text-slate-900">
          Payment Pending
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Invoice PDF is available after payment is marked as Paid.
        </p>
        <button
          onClick={() => router.push(`/jobs/${job.id}`)}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Back to Job Details
        </button>
      </div>
    );
  }

  const shopName =
    settings.shopName.trim() || defaultShopSettings.shopName;

  const invoiceDate = job.paidAt || job.createdAt;
  const invoiceTimestamp = parseWarrantyTimestamp(invoiceDate);
  const formattedDate = invoiceTimestamp
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(invoiceTimestamp)
    : "Date unavailable";
  const warranty = getWarrantyDetails(job.paymentStatus, job.paidAt);

  const amount = job.estimate.toLocaleString("en-IN");

  const whatsappMessage = encodeURIComponent(
    `Hello ${job.customerName},

Thank you for choosing ${shopName}.

Invoice: ${job.id}
Device: ${job.brand} ${job.model}
Repair: ${job.problem}
Amount Paid: Rs. ${amount}
Payment Status: PAID

${settings.phone ? `Shop Contact: ${settings.phone}\n` : ""}${settings.address ? `Shop Address: ${settings.address}\n` : ""}
${settings.invoiceFooter || "Thank you for choosing us."}

Invoice: ${typeof window !== "undefined" ? window.location.href : ""}`
  );

  return (
    <main className="box-border min-h-screen w-full overflow-x-clip bg-slate-100 px-3 py-4 sm:px-5 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-4xl">

        {/* Actions */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <button
            onClick={() => router.push(`/jobs/${job.id}`)}
            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Job
          </button>

          <div className="grid grid-cols-1 gap-2 sm:flex">
            <a
              href={`https://wa.me/91${job.phone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>

            <button
              onClick={() => window.print()}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Download size={17} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Invoice */}
        <article className="box-border w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8 md:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">

          {/* Invoice Header */}
          <header className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-7 sm:flex-row">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {shopName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Mobile Repair & Service
              </p>

              {settings.ownerName && (
                <p className="mt-2 text-sm text-slate-600">
                  Owner: {settings.ownerName}
                </p>
              )}

              {settings.phone && (
                <p className="mt-1 text-sm text-slate-600">
                  Phone: {settings.phone}
                </p>
              )}

              {settings.email && (
                <p className="mt-1 break-all text-sm text-slate-600">
                  Email: {settings.email}
                </p>
              )}

              {settings.address && (
                <p className="mt-1 max-w-sm whitespace-pre-wrap text-sm text-slate-600">
                  {settings.address}
                </p>
              )}

              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Payment Invoice
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-3xl font-black text-slate-900">
                INVOICE
              </h2>

              <p className="mt-2 break-all text-sm text-slate-500">
                Invoice No: {job.id}
              </p>

              <p className="text-sm text-slate-500">
                Date: {formattedDate}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                PAID
              </span>
            </div>
          </header>

          {/* Customer & Device */}
          <section className="grid min-w-0 gap-6 border-b border-slate-200 py-7 sm:grid-cols-2 sm:gap-8">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bill To
              </p>

              <h3 className="mt-3 break-words font-bold text-slate-900">
                {job.customerName}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                +91 {job.phone}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Device Details
              </p>

              <h3 className="mt-3 break-words font-bold text-slate-900">
                {job.brand} {job.model}
              </h3>

              <p className="mt-1 break-all text-sm text-slate-600">
                Job ID: {job.id}
              </p>
            </div>
          </section>

          {/* Repair Description */}
          <section className="py-7">
            <h3 className="mb-4 font-bold text-slate-900">
              Repair Description
            </h3>

            <div className="w-full overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-12 bg-slate-50 px-3 py-3 text-xs font-bold uppercase text-slate-500 sm:px-4">
                <div className="col-span-8">Description</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              <div className="grid grid-cols-12 gap-2 px-3 py-5 sm:px-4">
                <div className="col-span-8 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Mobile Repair Service
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-500">
                    {job.problem}
                  </p>
                </div>

                <p className="col-span-4 break-words text-right text-sm font-semibold text-slate-900">
                  ₹{amount}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-7 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Warranty Period
            </p>
            {warranty.startDate && warranty.endDate ? (
              <p className="mt-2 text-sm font-semibold text-slate-800">
                7 days: {formatWarrantyDate(warranty.startDate)} -{" "}
                {formatWarrantyDate(warranty.endDate)}
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Warranty dates unavailable
              </p>
            )}
          </section>

          {/* Total */}
          <section className="flex justify-end border-t border-slate-200 pt-6">
            <div className="w-full max-w-xs">
              <div className="flex justify-between gap-3 py-2 text-sm text-slate-600">
                <span>Repair Amount</span>
                <span>₹{amount}</span>
              </div>

              <div className="mt-3 flex justify-between gap-3 border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-900">
                  Total Paid
                </span>

                <span className="text-xl font-black text-emerald-700 sm:text-2xl">
                  ₹{amount}
                </span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-slate-200 pt-6 text-center">
            <p className="break-words font-bold text-slate-900">
              {settings.invoiceFooter ||
                `Thank you for choosing ${shopName}!`}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              We appreciate your trust in our repair service.
            </p>
          </footer>
        </article>

        <p className="mt-4 text-center text-xs text-slate-400 print:hidden">
          Download PDF opens your browser print dialog. Choose Save as PDF.
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

          main {
            min-height: auto !important;
            padding: 0 !important;
            background: white !important;
          }

          article {
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </main>
  );
}
