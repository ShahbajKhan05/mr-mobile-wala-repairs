
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Smartphone,
  Wrench,
  Camera,
  IndianRupee,
  MessageCircle,
} from "lucide-react";

export default function CustomerRepairApproval() {
  const [approval, setApproval] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  const job = {
    number: "MR-001",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    device: "iPhone 13",
    problem: "Display damaged",
    estimate: 3500,
    date: "01 November 2026",
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        {/* Shop Header */}
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Image
            src="/mr-mobile-wala-logo.png"
            alt="MR MOBILE WALA"
            width={190}
            height={64}
            priority
            className="h-auto w-[155px] object-contain"
          />

          <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <ShieldCheck size={15} />
            Official Update
          </div>
        </header>

        {/* Job Information */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Repair Job Card
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
                Your repair details
              </h1>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Smartphone size={25} />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Job Number
              </span>
              <span className="text-sm font-bold text-slate-900">
                #{job.number}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Job Created
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {job.date}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400">
                CUSTOMER NAME
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {job.customer}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                CONTACT NUMBER
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {job.phone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <Smartphone className="mb-2 text-blue-600" size={19} />
                <p className="text-[11px] font-medium text-slate-400">
                  DEVICE
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {job.device}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <Wrench className="mb-2 text-orange-500" size={19} />
                <p className="text-[11px] font-medium text-slate-400">
                  REPAIR ISSUE
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {job.problem}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estimate */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <IndianRupee size={19} className="text-blue-600" />
            <h2 className="font-bold text-slate-900">
              Repair Estimate
            </h2>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-5">
            <p className="text-xs font-semibold text-blue-700">
              ESTIMATED REPAIR COST
            </p>

            <p className="mt-2 flex items-center text-3xl font-extrabold tracking-tight text-slate-900">
              <IndianRupee size={26} />
              {job.estimate.toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Final cost may change only after discussing any
              additional repair requirement with you.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <ShieldCheck
              size={17}
              className="shrink-0 text-green-600"
            />
            Your repair will proceed after your estimate approval.
          </div>
        </section>

        {/* Approval */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {approval === "pending" ? (
            <>
              <h2 className="text-lg font-extrabold text-slate-900">
                Approve your repair?
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Please review the details and confirm whether
                you want us to proceed with this repair.
              </p>

              <button
                type="button"
                onClick={() => setApproval("approved")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <CheckCircle2 size={19} />
                Approve Estimate
              </button>

              <button
                type="button"
                onClick={() => setApproval("rejected")}
                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reject Estimate
              </button>
            </>
          ) : (
            <div className="py-3 text-center">
              {approval === "approved" ? (
                <>
                  <CheckCircle2
                    size={45}
                    className="mx-auto text-green-600"
                  />
                  <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                    Estimate Approved!
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Thank you. Your approval has been recorded
                    in this demo. The shop can now proceed
                    with the repair after confirmation.
                  </p>
                </>
              ) : (
                <>
                  <Clock3
                    size={45}
                    className="mx-auto text-orange-500"
                  />
                  <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                    Estimate Rejected
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Your choice has been recorded in this demo.
                    Please contact the shop if you want to
                    discuss the estimate.
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={() => setApproval("pending")}
                className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Change my response
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Camera size={15} />
            <span>MR MOBILE WALA REPAIRS</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Thank you for trusting our repair service.
          </p>
        </footer>
      </div>
    </main>
  );
}
