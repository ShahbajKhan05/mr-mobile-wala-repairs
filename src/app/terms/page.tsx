
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for mobile repair, buying and selling services at MR MOBILE WALA.",
  robots: {
    index: true,
    follow: true,
  },
};

const terms = [
  {
    title: "1. Booking Requests",
    content:
      "Submitting a booking request through our website is an enquiry and does not automatically confirm an appointment, repair order, purchase or sale. Our team may contact you to confirm the details.",
  },
  {
    title: "2. Repair Estimates",
    content:
      "Any repair price or estimate discussed before inspection is indicative and may change after the device is examined. We will communicate relevant changes and seek customer approval before proceeding with additional work.",
  },
  {
    title: "3. Device Inspection and Repair",
    content:
      "Repair time depends on the device, fault, parts availability and workload. Some faults may only become apparent during inspection or repair. We will inform you if the scope of work changes.",
  },
  {
    title: "4. Customer Data and Backup",
    content:
      "Customers are responsible for backing up important data before handing over a device. Although reasonable care will be taken, MR MOBILE WALA cannot guarantee that data will remain intact during diagnosis or repair. Please remove sensitive information where possible.",
  },
  {
    title: "5. Device Access and Security",
    content:
      "If device access is required for diagnosis or testing, customers should discuss the requirement with our team. Do not share sensitive passwords or account credentials unless absolutely necessary and through an agreed, secure process.",
  },
  {
    title: "6. Buy and Sell Requests",
    content:
      "Buying or selling a phone is subject to physical inspection, device condition, ownership verification, agreed pricing and final confirmation by both parties. A website enquiry alone does not guarantee a transaction.",
  },
  {
    title: "7. Payments",
    content:
      "Payment terms will be communicated before or at the time of service confirmation. Customers should verify the amount and payment status with our team and retain their bill or receipt.",
  },
  {
    title: "8. Warranty",
    content:
      "Any repair warranty, its duration, coverage and exclusions will be specified on the invoice or provided in writing at the time of service. Warranty does not automatically cover every repair, part or type of damage.",
  },
  {
    title: "9. Collection of Devices",
    content:
      "Customers should collect their devices after receiving a completion notification and verify the device condition and repair work at collection. Any applicable collection or storage arrangements will be communicated by our team.",
  },
  {
    title: "10. Website and Third-Party Services",
    content:
      "We aim to keep website information accurate, but service details, prices and availability may change. WhatsApp and other external services are governed by their respective terms and policies.",
  },
  {
    title: "11. Changes to These Terms",
    content:
      "We may revise these Terms & Conditions when our services or applicable requirements change. The updated version will be published on this page.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-5 py-14 text-[#202B32] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-[#777E81] transition hover:text-[#B08D57]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="rounded-[28px] border border-[#EAE5DB] bg-white p-7 shadow-[0_15px_50px_rgba(32,43,50,0.04)] sm:p-12">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F1E7] text-[#B08D57]">
            <FileText size={28} strokeWidth={1.5} />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B08D57]">
            MR MOBILE WALA
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#777E81] sm:text-base">
            Please read these terms carefully before using our mobile repair,
            buying or selling services.
          </p>

          <div className="my-9 h-px bg-[#EEEAE2]" />

          <div className="space-y-8">
            {terms.map((term) => (
              <section key={term.title}>
                <h2 className="text-lg font-semibold text-[#202B32]">
                  {term.title}
                </h2>
                <p className="mt-3 text-sm leading-8 text-[#70787B]">
                  {term.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#F8F6F1] p-5">
            <h2 className="font-semibold">Need Help?</h2>
            <p className="mt-2 text-sm leading-7 text-[#70787B]">
              Contact our team if you have any questions about these terms or
              our services.
            </p>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-[#A17D45] underline underline-offset-4"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#9A9D9B]">
          © 2026 MR MOBILE WALA. All rights reserved.
        </p>
      </div>
    </main>
  );
}
