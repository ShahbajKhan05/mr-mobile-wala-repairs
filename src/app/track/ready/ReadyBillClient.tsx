
"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Download,
  MessageCircle,
  ShieldCheck,
  Printer,
  Smartphone,
  Receipt,
} from "lucide-react";

const bill = {
  invoice: "MR-INV-001",
  jobNumber: "MR-001",
  date: "01 November 2026",
  customer: "Rahul Sharma",
  phone: "919876543210",
  device: "iPhone 13",
  problem: "Display damaged",
  parts: 2800,
  labour: 700,
  discount: 0,
  total: 3500,
  paymentMethod: "UPI",
  paymentStatus: "PAID",
  warranty: "30 Days",
  warrantyUntil: "01 December 2026",
};

export default function ReadyBillClient() {
  const total =
    bill.parts + bill.labour - bill.discount;

  const whatsappMessage = `
Hello ${bill.customer}!

Your mobile repair is complete.

Shop: MR MOBILE WALA
Invoice: ${bill.invoice}
Job Number: ${bill.jobNumber}
Device: ${bill.device}
Repair: ${bill.problem}
Total Bill: Rs. ${total.toLocaleString("en-IN")}
Payment Status: ${bill.paymentStatus}

Your digital invoice is available here:
${typeof window !== "undefined" ? window.location.href : ""}

Thank you for choosing MR MOBILE WALA.
  `.trim();

  const whatsappUrl = `https://wa.me/${bill.phone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  function downloadBill() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <header className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm print:hidden">
          <Image
            src="/mr-mobile-wala-logo.png"
            alt="MR MOBILE WALA"
            width={190}
            height={64}
            priority
            className="h-auto w-[155px] object-contain"
          />

          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            <CheckCircle2 size={15} />
            Repair Complete
          </span>
        </header>

        {/* Invoice */}
        <section
          id="repair-invoice"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 print:border-0 print:p-0 print:shadow-none"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-5">
            <div>
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA"
                width={190}
                height={64}
                className="h-auto w-[155px] object-contain"
              />
              <p className="mt-2 text-xs text-slate-500">
                Mobile Repair Service
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tax Invoice / Bill
              </p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">
                {bill.invoice}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="my-5 flex items-center justify-between rounded-xl bg-green-50 p-4 print:border print:border-green-200">
            <div>
              <p className="text-xs font-semibold text-green-700">
                PAYMENT STATUS
              </p>
              <p className="mt-1 text-lg font-extrabold text-green-800">
                {bill.paymentStatus}
              </p>
              <p className="mt-1 text-[10px] text-green-700">
                Demo payment record
              </p>
            </div>

            <CheckCircle2
              size={35}
              className="text-green-600"
            />
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Customer
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {bill.customer}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                +91 {bill.phone.slice(2)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Invoice Date
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {bill.date}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Job #{bill.jobNumber}
              </p>
            </div>
          </div>

          {/* Device Details */}
          <div className="my-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Smartphone size={19} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Device & Repair Details
              </h2>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-slate-400">DEVICE</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {bill.device}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">PROBLEM</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {bill.problem}
                </p>
              </div>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Receipt size={18} className="text-blue-600" />
              Bill Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Parts Charges</span>
                <span className="font-semibold text-slate-800">
                  ₹{bill.parts.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Labour Charges</span>
                <span className="font-semibold text-slate-800">
                  ₹{bill.labour.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Discount</span>
                <span className="font-semibold text-slate-800">
                  - ₹{bill.discount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-semibold text-slate-700">
                  {bill.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 print:border-blue-200">
            <div className="flex items-center gap-2">
              <ShieldCheck size={21} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Digital Warranty
              </h2>
            </div>

            <p className="mt-2 text-sm font-bold text-blue-700">
              {bill.warranty} Repair Warranty
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Valid until: {bill.warrantyUntil}
            </p>

            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Warranty applies to the repair work listed on
              this invoice, subject to the shop's warranty terms.
            </p>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center">
            <p className="text-sm font-bold text-slate-800">
              Thank you for choosing MR MOBILE WALA!
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Please keep this invoice for your records.
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-5 space-y-3 print:hidden">
          <button
            type="button"
            onClick={downloadBill}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Download size={19} />
            Download PDF Bill
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={19} />
            Share Bill on WhatsApp
          </a>

          <p className="text-center text-[11px] leading-relaxed text-slate-400">
            PDF download opens your browser's print window.
            Choose "Save as PDF" to save the invoice.
          </p>
        </section>
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
        }
      `}</style>
    </main>
  );
}
