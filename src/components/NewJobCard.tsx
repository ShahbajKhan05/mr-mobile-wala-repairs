
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  MessageCircle,
  Smartphone,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import { saveJob, type JobPhoto, type PhotoKey, type RepairJob } from "@/lib/jobs";

const photoSlots: { key: PhotoKey; label: string }[] = [
  { key: "front", label: "Front Side" },
  { key: "back", label: "Back Side" },
  { key: "left", label: "Left Side" },
  { key: "right", label: "Right Side" },
];

export default function NewJobCard() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [problem, setProblem] = useState("");
  const [estimate, setEstimate] = useState("");
  const [photos, setPhotos] = useState<
    Partial<Record<PhotoKey, { file: File; preview: string }>>
  >({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const inputRefs = useRef<
    Partial<Record<PhotoKey, HTMLInputElement | null>>
  >({});

  function handlePhotoChange(key: PhotoKey, file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo size must be less than 5 MB.");
      return;
    }

    setError("");

    setPhotos((previous) => {
      const oldPreview = previous[key]?.preview;
      if (oldPreview) URL.revokeObjectURL(oldPreview);

      return {
        ...previous,
        [key]: {
          file,
          preview: URL.createObjectURL(file),
        },
      };
    });
  }

  function removePhoto(key: PhotoKey) {
    setPhotos((previous) => {
      const oldPreview = previous[key]?.preview;
      if (oldPreview) URL.revokeObjectURL(oldPreview);

      const updated = { ...previous };
      delete updated[key];
      return updated;
    });

    if (inputRefs.current[key]) {
      inputRefs.current[key]!.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (!customerName.trim() || !brand || !model.trim() || !problem.trim()) {
      setError("Please fill all required customer and device details.");
      return;
    }

    if (!estimate || !Number.isFinite(Number(estimate)) || Number(estimate) < 0) {
      setError("Please enter a valid repair estimate.");
      return;
    }

    if (Object.keys(photos).length !== 4) {
      setError("Please upload all four phone photos before saving.");
      return;
    }

    setSaving(true);

    try {
      const jobNumber = `MR-${Date.now().toString().slice(-6)}`;

      const jobPhotos: JobPhoto[] = photoSlots.map((slot) => {
        const photo = photos[slot.key];

        if (!photo) {
          throw new Error(`Missing ${slot.label} photo.`);
        }

        return {
          key: slot.key,
          name: photo.file.name,
          type: photo.file.type,
          blob: photo.file,
        };
      });

      const job: RepairJob = {
        id: jobNumber,
        customerName: customerName.trim(),
        phone: cleanPhone,
        brand,
        model: model.trim(),
        problem: problem.trim(),
        estimate: Number(estimate),
        photos: jobPhotos,
        status: "Received",
        paymentStatus: "Pending",
        approvalStatus: "Pending",
        createdAt: new Date().toISOString(),
      };

      const trackingUrl = await saveJob(job);

      const message = [
        `Hello ${customerName.trim()},`,
        "",
        "Your mobile repair job card has been created.",
        `Job Number: ${jobNumber}`,
        `Device: ${brand} ${model}`,
        `Problem: ${problem.trim()}`,
        `Estimated Cost: ₹${Number(estimate).toLocaleString("en-IN")}`,
        `Private Repair Tracking: ${trackingUrl}`,
        "",
        "We have received your device for repair. Use the private link below to check progress anytime.",
        "",
        "Thank you!",
      ].join("\n");

      const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

      window.location.href = whatsappUrl;
    } catch (err) {
      console.error("Job save failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const uploadedCount = Object.keys(photos).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <ArrowLeft size={16} />
              <span>Jobs</span>
              <span>/</span>
              <span className="font-medium text-slate-900">New Job Card</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create New Job Card
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Register customer, device details and repair estimate.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            New Repair Entry
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <UserRound size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Customer Information</h2>
                    <p className="text-xs text-slate-500">Enter customer contact details</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Customer Name *
                    </label>
                    <input
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      WhatsApp Number *
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                      <span className="border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="10-digit mobile number"
                        className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Smartphone size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Device Information</h2>
                    <p className="text-xs text-slate-500">Enter phone brand and model</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Mobile Brand *
                    </label>
                    <select
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">Select brand</option>
                      {["Apple", "Samsung", "OnePlus", "Redmi", "POCO", "Realme", "Vivo", "OPPO", "Motorola", "Google Pixel", "Other"].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Model Name *
                    </label>
                    <input
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. iPhone 13"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Repair Problem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Describe the phone problem..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                      <Camera size={21} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">Device Photos</h2>
                      <p className="text-xs text-slate-500">Upload all four sides of the phone</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {uploadedCount}/4 uploaded
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {photoSlots.map((slot) => {
                    const photo = photos[slot.key];

                    return (
                      <div key={slot.key}>
                        <input
                          ref={(element) => {
                            inputRefs.current[slot.key] = element;
                          }}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) =>
                            handlePhotoChange(slot.key, e.target.files?.[0])
                          }
                        />

                        <div className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                          {photo ? (
                            <>
                              <Image
                                src={photo.preview}
                                alt={`${slot.label} device photo`}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(slot.key)}
                                aria-label={`Remove ${slot.label} photo`}
                                className="absolute right-2 top-2 z-10 rounded-lg bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-2 text-center text-xs font-medium text-white">
                                {slot.label}
                              </div>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => inputRefs.current[slot.key]?.click()}
                              className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center transition hover:bg-blue-50"
                            >
                              <ImagePlus size={25} className="text-slate-400" />
                              <span className="text-xs font-semibold text-slate-700">{slot.label}</span>
                              <span className="text-[10px] text-slate-400">Add photo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Maximum 5 MB per photo.
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Wallet size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Repair Estimate</h2>
                    <p className="text-xs text-slate-500">Estimated repair amount</p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Cost (₹) *
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <span className="text-lg font-semibold text-slate-400">₹</span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={estimate}
                    onChange={(e) => setEstimate(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent px-3 py-4 text-xl font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Estimated Total</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{Number(estimate || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Final cost may change after customer approval.
                  </p>
                </div>
              </section>


            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {saving ? "Saving Job..." : "Save Job & WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
