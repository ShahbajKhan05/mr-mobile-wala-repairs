
import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  Package,
  Wrench,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Repair Status Tracker | MR MOBILE WALA",
  description:
    "Track your mobile phone repair progress with MR MOBILE WALA.",
  robots: {
    index: false,
    follow: false,
  },
};

const steps = [
  {
    title: "Phone Received",
    description: "Your device has been received at our shop.",
    icon: Smartphone,
    status: "completed",
  },
  {
    title: "Part Ordered",
    description: "Required repair parts have been arranged.",
    icon: Package,
    status: "completed",
  },
  {
    title: "Repairing",
    description: "Our technician is working on your device.",
    icon: Wrench,
    status: "current",
  },
  {
    title: "Ready for Pickup",
    description: "Your repaired phone will be ready for collection.",
    icon: CheckCircle2,
    status: "pending",
  },
];

export default function RepairStatusPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-xl">

        {/* Shop Logo */}
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Image
            src="/mr-mobile-wala-logo.png"
            alt="MR MOBILE WALA"
            width={190}
            height={64}
            priority
            className="h-auto w-[155px] object-contain"
          />

          <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <ShieldCheck size={15} />
            Live Update
          </span>
        </header>

        {/* Job Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Repair Tracking
          </p>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            Track your repair
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Hello Rahul Sharma! Here is the latest update
            on your device.
          </p>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-500">Job Number</p>
              <p className="mt-1 font-bold text-slate-900">
                #MR-001
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Device</p>
              <p className="mt-1 font-bold text-slate-900">
                iPhone 13
              </p>
            </div>
          </div>
        </section>

        {/* Current Status */}
        <section className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-2 text-blue-700">
            <Clock3 size={19} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Current Status
            </span>
          </div>

          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            Repairing
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Your phone is currently being repaired by our technician.
          </p>
        </section>

        {/* Progress Timeline */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Repair Progress
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Follow each step of your repair journey.
          </p>

          <div className="mt-6 space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const completed = step.status === "completed";
              const current = step.status === "current";
              const last = index === steps.length - 1;

              return (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        completed
                          ? "bg-green-100 text-green-600"
                          : current
                            ? "bg-blue-100 text-blue-600 ring-4 ring-blue-50"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    {!last && (
                      <div
                        className={`my-1 min-h-12 w-0.5 ${
                          completed
                            ? "bg-green-300"
                            : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          completed || current
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {completed && (
                        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                          COMPLETED
                        </span>
                      )}

                      {current && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                          IN PROGRESS
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 pb-4 text-center">
          <p className="text-xs font-semibold text-slate-500">
            MR MOBILE WALA REPAIRS
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Thank you for trusting our repair service.
          </p>
        </footer>
      </div>
    </main>
  );
}
