
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  IndianRupee,
  MessageCircle,
  Smartphone,
  UserRound,
  Save,
  FileText,
  Link2,
  Copy,
  Truck,
} from "lucide-react";
import {
  getJobById,
  updateJob,
  updatePaymentStatus,
  type RepairJob,
} from "@/lib/jobs";
import {
  getShopSettings,
  defaultShopSettings,
  type ShopSettings,
} from "@/lib/settings";
import { WARRANTY_DAYS } from "@/lib/warranty";

const statusSteps: RepairJob["status"][] = [
  "Received",
  "Part Ordered",
  "Repairing",
  "Ready",
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<RepairJob | null>(null);
  const [settings, setSettings] =
    useState<ShopSettings>(defaultShopSettings);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<RepairJob["status"]>("Received");

  const [savingStatus, setSavingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [savingPayment, setSavingPayment] = useState(false);
  const [savingPickup, setSavingPickup] = useState(false);
  const [pickupMessage, setPickupMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJob() {
      try {
        const [result, shopSettings] = await Promise.all([
          getJobById(params.id),
          getShopSettings().catch(() => defaultShopSettings),
        ]);

        if (!active) return;

        setSettings(shopSettings);

        if (result) {
          setJob(result);
          setSelectedStatus(result.status);
        } else {
          setError("This repair job could not be found.");
        }
      } catch {
        if (active) {
          setError("Unable to load repair job.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJob();

    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleGenerateTrackingLink() {
    if (!job || trackingLoading) return;
    setTrackingLoading(true);
    setTrackingMessage("");
    try {
      const response = await fetch(`/api/admin/jobs/${encodeURIComponent(job.id)}/tracking-link`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.trackingUrl) {
        throw new Error(result.message || "Unable to generate tracking link.");
      }
      setTrackingUrl(result.trackingUrl);
      setTrackingMessage("Private link generated. Share it only with this customer.");
    } catch (err) {
      setTrackingMessage(err instanceof Error ? err.message : "Unable to generate tracking link.");
    } finally {
      setTrackingLoading(false);
    }
  }

  async function handleCopyTrackingLink() {
    if (!trackingUrl) return;
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setTrackingMessage("Tracking link copied.");
    } catch {
      setTrackingMessage("Copy failed. Select and copy the link manually.");
    }
  }

  // Update repair status
  async function handleStatusUpdate() {
    if (!job || savingStatus) return;

    setSavingStatus(true);
    setStatusMessage("");

    try {
      const updatedJob: RepairJob = {
        ...job,
        status: selectedStatus,
      };

      await updateJob(updatedJob);

      setJob(updatedJob);
      setStatusMessage("Repair status updated successfully.");
    } catch {
      setStatusMessage("Status update failed. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  }

  // Update payment status
  async function handlePaymentUpdate() {
    if (!job || savingPayment) return;

    const nextStatus: RepairJob["paymentStatus"] =
      job.paymentStatus === "Paid" ? "Pending" : "Paid";

    const confirmed = window.confirm(
      nextStatus === "Paid"
        ? "Confirm that customer payment has actually been received?"
        : "Change payment status back to Pending? The warranty will become inactive."
    );

    if (!confirmed) return;

    setSavingPayment(true);
    setPaymentMessage("");

    try {
      await updatePaymentStatus(job.id, nextStatus);

      const updatedJob = await getJobById(job.id);

      if (!updatedJob) {
        throw new Error("Unable to reload updated repair job.");
      }

      setJob(updatedJob);
      setSelectedStatus(updatedJob.status);

      setPaymentMessage(
        nextStatus === "Paid"
          ? "Payment marked as Paid successfully."
          : "Payment marked as Pending."
      );
    } catch {
      setPaymentMessage("Unable to update payment. Please try again.");
    } finally {
      setSavingPayment(false);
    }
  }

  async function handlePickupUpdate() {
    if (!job || savingPickup) return;
    const nextStatus = job.pickupStatus === "Picked Up" ? "Pending" : "Picked Up";
    if (nextStatus === "Picked Up" && job.status !== "Ready") {
      setPickupMessage("Device ko pickup ke liye pehle Ready mark karo.");
      return;
    }
    const confirmed = window.confirm(
      nextStatus === "Picked Up"
        ? "Confirm that the customer has collected the device?"
        : "Reset pickup status to Pending?"
    );
    if (!confirmed) return;

    setSavingPickup(true);
    setPickupMessage("");
    try {
      const response = await fetch(`/api/admin/jobs/${encodeURIComponent(job.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupStatus: nextStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Pickup update failed.");
      const updatedJob = await getJobById(job.id);
      if (!updatedJob) throw new Error("Unable to reload repair job.");
      setJob(updatedJob);
      setPickupMessage(nextStatus === "Picked Up" ? "Device marked as picked up." : "Pickup status reset.");
    } catch (cause) {
      setPickupMessage(cause instanceof Error ? cause.message : "Unable to update pickup status.");
    } finally {
      setSavingPickup(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Job Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || "This job does not exist in your local database."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/jobs/list")}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to All Jobs
        </button>
      </div>
    );
  }

  const shopName =
    settings.shopName.trim() || defaultShopSettings.shopName;

  const customerPhone = job.phone.replace(/\D/g, "").slice(-10);

  const paidDate = job.paidAt ? formatDate(job.paidAt) : null;

  const warrantyDays = WARRANTY_DAYS;

  const whatsappMessage = encodeURIComponent(
    `Hello ${job.customerName},

This is an update from ${shopName}.

Repair Job ID: ${job.id}
Device: ${job.brand} ${job.model}
Repair Status: ${job.status}
Estimated Amount: Rs. ${job.estimate.toLocaleString("en-IN")}

${
  job.status === "Ready"
    ? `Your device is ready for pickup. Please visit our shop to collect it.

${
  settings.googleReviewLink
    ? `After collecting your device, we would appreciate your feedback:\n${settings.googleReviewLink}\n\n`
    : ""
}`
    : "We will keep you updated about your repair."
}
${
  settings.phone
    ? `Shop Contact: ${settings.phone}\n`
    : ""
}${
  settings.address
    ? `Shop Address: ${settings.address}\n`
    : ""
}
Thank you for choosing ${shopName}.`
  );

  return (
    <main className="box-border min-h-screen w-full overflow-x-clip bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push("/jobs/list")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to All Jobs
        </button>

        {/* Job Header */}
        <section className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Repair Job Details
            </p>

            <h1 className="mt-2 break-all text-2xl font-bold text-slate-900 sm:text-3xl">
              {job.id}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-slate-500">
              <CalendarDays size={15} />
              Created on {formatDate(job.createdAt)}
            </p>

            <p className="mt-2 text-xs font-medium text-slate-400">
              {shopName}
            </p>
          </div>

          <a
            href={`https://wa.me/91${customerPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle size={18} />
            WhatsApp Customer
          </a>
        </section>

        <div className="grid min-w-0 gap-6 lg:grid-cols-3">

          <div className="min-w-0 space-y-6 lg:col-span-2">

            {/* Customer Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <UserRound size={21} />
                </div>

                <h2 className="font-bold text-slate-900">
                  Customer Information
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Customer Name
                  </p>
                  <p className="mt-1 break-words font-semibold text-slate-900">
                    {job.customerName}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    WhatsApp Number
                  </p>
                  <p className="mt-1 break-words font-semibold text-slate-900">
                    +91 {job.phone}
                  </p>
                </div>
              </div>
            </section>

            {/* Device Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <Smartphone size={21} />
                </div>

                <h2 className="font-bold text-slate-900">
                  Device & Repair Information
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Device</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {job.brand} {job.model}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Repair Estimate
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    ₹{job.estimate.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Reported Problem
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                  {job.problem}
                </p>
              </div>
            </section>

            {/* Device Photos */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Smartphone size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Device Photos
                  </h2>
                  <p className="text-xs text-slate-500">
                    Photos saved with this repair job
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {job.photos.map((photo) => (
                  <PhotoPreview
                    key={photo.key}
                    label={photo.key}
                    blob={photo.blob}
                    src={photo.url}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="min-w-0 space-y-6">

            {/* Private Customer Tracking Link */}
            <section className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Link2 size={18} className="text-indigo-600" />
                <h2 className="font-bold text-slate-900">Private Customer Tracking</h2>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Generate a secure link for this customer. Creating a new link revokes the previous one.
              </p>
              <button
                type="button"
                onClick={handleGenerateTrackingLink}
                disabled={trackingLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                <Link2 size={16} />
                {trackingLoading ? "Generating..." : trackingUrl ? "Generate New Link" : "Generate Private Link"}
              </button>
              {trackingUrl && (
                <>
                  <input
                    readOnly
                    aria-label="Private customer tracking link"
                    value={trackingUrl}
                    onFocus={(event) => event.currentTarget.select()}
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700"
                  />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button type="button" onClick={handleCopyTrackingLink} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <Copy size={14} /> Copy Link
                    </button>
                    <a
                      href={`https://wa.me/91${customerPhone}?text=${encodeURIComponent(`Hello ${job.customerName}, track your repair securely here: ${trackingUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </>
              )}
              {trackingMessage && <p role="status" className="mt-3 text-xs text-indigo-700">{trackingMessage}</p>}
              <p className="mt-2 text-[10px] leading-4 text-slate-400">Link expires after 1 year. Anyone with this private link can view this repair.</p>
            </section>

            {/* Repair Progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Repair Progress
              </h2>

              <div className="mt-5 space-y-4">
                {statusSteps.map((step, index) => {
                  const completed = index <= statusSteps.indexOf(job.status);

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Clock size={17} />
                        )}
                      </div>

                      <p
                        className={`text-sm font-medium ${
                          completed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <label
                  htmlFor="repair-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Update Repair Status
                </label>

                <select
                  id="repair-status"
                  value={selectedStatus}
                  onChange={(event) => {
                    setSelectedStatus(
                      event.target.value as RepairJob["status"]
                    );
                    setStatusMessage("");
                  }}
                  className="box-border w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statusSteps.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={
                    savingStatus || selectedStatus === job.status
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Save size={17} />
                  {savingStatus ? "Saving..." : "Save Status"}
                </button>

                {statusMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-3 rounded-lg p-3 text-xs font-medium ${
                      statusMessage.includes("successfully")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </section>

            {/* Customer Pickup */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-indigo-600" />
                <h2 className="font-bold text-slate-900">Customer Pickup</h2>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Pickup Status</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${job.pickupStatus === "Picked Up" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {job.pickupStatus === "Picked Up" ? "Picked Up" : "Awaiting Pickup"}
                </span>
              </div>
              <button type="button" onClick={handlePickupUpdate} disabled={savingPickup || (job.status !== "Ready" && job.pickupStatus !== "Picked Up")} className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {savingPickup ? "Updating..." : job.pickupStatus === "Picked Up" ? "Reset Pickup Status" : "Mark as Picked Up"}
              </button>
              {pickupMessage && <p role="status" className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{pickupMessage}</p>}
              {job.status !== "Ready" && job.pickupStatus !== "Picked Up" && <p className="mt-2 text-xs text-slate-400">Pickup can be confirmed after repair status is Ready.</p>}
            </section>

            {/* Payment Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Payment Information
              </h2>

              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-sm text-slate-500">
                  Payment Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    job.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {job.paymentStatus}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  Estimated Amount
                </p>

                <p className="mt-1 flex items-center text-2xl font-bold text-slate-900">
                  <IndianRupee size={20} />
                  {job.estimate.toLocaleString("en-IN")}
                </p>
              </div>

              {job.paymentStatus === "Paid" && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CalendarDays size={17} />
                    <p className="text-xs font-semibold">
                      Payment Received On
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-bold text-emerald-900">
                    {paidDate || "Payment date unavailable"}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    {warrantyDays}-day warranty will be calculated from this payment date.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handlePaymentUpdate}
                disabled={savingPayment}
                className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  job.paymentStatus === "Paid"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {savingPayment
                  ? "Updating..."
                  : job.paymentStatus === "Paid"
                    ? "Mark as Pending"
                    : "Mark as Paid"}
              </button>

              {paymentMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 rounded-lg p-3 text-xs font-medium ${
                    paymentMessage.includes("successfully") ||
                    paymentMessage.includes("Pending.")
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {paymentMessage}
                </p>
              )}

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Only mark as Paid after confirming that payment has actually been received.
              </p>

              {job.paymentStatus === "Paid" && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/jobs/${job.id}/invoice`)
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <FileText size={17} />
                  View / Download Invoice
                </button>
              )}

              {job.paymentStatus === "Paid" && job.paidAt && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/jobs/${job.id}/warranty`)
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <CheckCircle2 size={17} />
                  View Digital Warranty Card
                </button>
              )}
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

function PhotoPreview({
  label,
  blob,
  src,
}: {
  label: string;
  blob: Blob;
  src?: string;
}) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (src) {
      setImageUrl(src);
      return;
    }

    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob, src]);

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${label} phone view`}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square w-full animate-pulse bg-slate-100" />
      )}

      <p className="px-2 py-2 text-center text-xs font-semibold capitalize text-slate-600">
        {label} Side
      </p>
    </div>
  );
}
