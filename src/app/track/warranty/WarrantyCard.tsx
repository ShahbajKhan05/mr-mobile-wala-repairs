
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ShieldCheck,
  Smartphone,
  CalendarDays,
  Download,
  CheckCircle2,
  MessageCircle,
  RotateCw,
  CreditCard,
  Wrench,
  Phone,
} from "lucide-react";

const warranty = {
  id: "MR-WAR-001",
  job: "MR-001",
  invoice: "MR-INV-001",
  customer: "Rahul Sharma",
  phone: "919876543210",
  device: "iPhone 13",
  service: "Display Replacement",
  start: "01 November 2026",
  expiry: "01 December 2026",
  duration: "30 Days",
};

export default function WarrantyCard() {
  const [flipped, setFlipped] = useState(false);

  const message = `
Hello ${warranty.customer}!

Your MR MOBILE WALA digital warranty card:

Warranty ID: ${warranty.id}
Job Number: ${warranty.job}
Invoice: ${warranty.invoice}
Device: ${warranty.device}
Service: ${warranty.service}
Warranty: ${warranty.duration}
Valid From: ${warranty.start}
Valid Until: ${warranty.expiry}

Thank you for choosing MR MOBILE WALA!
  `.trim();

  const whatsappUrl = `https://wa.me/${warranty.phone}?text=${encodeURIComponent(message)}`;

  function downloadWarranty() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12 print:bg-white print:p-0">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Digital Warranty
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Your premium repair warranty card
            </p>
          </div>

          <div className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
            <ShieldCheck size={14} className="mr-1 inline" />
            30 Days
          </div>
        </header>

        {/* Card Flip Area */}
        <div className="print:hidden">
          <div
            className={`warranty-card-scene ${flipped ? "is-flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            aria-label="Flip warranty card"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFlipped(!flipped);
              }
            }}
          >
            <div className="warranty-card-inner">

              {/* FRONT SIDE */}
              <section className="warranty-card-face warranty-card-front">
                <div className="flex items-start justify-between">
                  <Image
                    src="/mr-mobile-wala-logo.png"
                    alt="MR MOBILE WALA"
                    width={190}
                    height={64}
                    priority
                    className="h-auto w-[145px] rounded-lg bg-white p-2 object-contain"
                  />

                  <div className="text-right">
                    <ShieldCheck
                      size={31}
                      className="ml-auto text-emerald-400"
                    />
                    <p className="mt-1 text-[9px] font-bold tracking-[2px] text-emerald-300">
                      WARRANTY
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-[9px] font-semibold uppercase tracking-[2.5px] text-blue-200">
                    Digital Repair Warranty
                  </p>

                  <h2 className="mt-1 text-3xl font-black tracking-wide text-white">
                    {warranty.duration}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-300">
                    PREMIUM SERVICE PROTECTION
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                      <CreditCard
                        size={23}
                        className="text-amber-300"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-widest text-blue-200">
                        Card Holder
                      </p>
                      <p className="truncate text-sm font-bold uppercase text-white">
                        {warranty.customer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/20 pt-3">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-blue-200">
                        Warranty ID
                      </p>
                      <p className="mt-1 text-xs font-bold tracking-wider text-white">
                        {warranty.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] uppercase tracking-widest text-blue-200">
                        Valid Until
                      </p>
                      <p className="mt-1 text-xs font-bold text-white">
                        01 DEC 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-5 text-[8px] font-bold tracking-[2px] text-white/40">
                  FRONT SIDE
                </div>
              </section>

              {/* BACK SIDE */}
              <section className="warranty-card-face warranty-card-back">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black tracking-[2px] text-white">
                    MR MOBILE WALA
                  </p>

                  <ShieldCheck
                    size={25}
                    className="text-emerald-300"
                  />
                </div>

                {/* Magnetic Stripe */}
                <div className="mx-[-20px] mt-5 h-10 bg-black/80" />

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-blue-200">
                      Job Number
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {warranty.job}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-blue-200">
                      Invoice
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {warranty.invoice}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-white/20 bg-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <Smartphone
                      size={16}
                      className="text-blue-200"
                    />
                    <p className="text-xs font-bold text-white">
                      {warranty.device}
                    </p>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-300">
                    {warranty.service}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
                    Warranty Conditions
                  </p>

                  <ul className="mt-2 space-y-1.5 text-[9px] leading-relaxed text-slate-200">
                    <li>• Valid only for the repair mentioned on this card.</li>
                    <li>• Physical and liquid damage are not covered.</li>
                    <li>• Unrelated faults are not covered.</li>
                    <li>• Original invoice must be presented for claims.</li>
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/20 pt-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-blue-200">
                      Valid From
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-white">
                      01 NOV 2026
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest text-blue-200">
                      Valid Until
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-white">
                      01 DEC 2026
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-5 text-[8px] font-bold tracking-[2px] text-white/40">
                  BACK SIDE
                </div>
              </section>
            </div>
          </div>

          {/* Flip Hint */}
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCw size={15} />
            {flipped ? "Show Front Side" : "Flip to Back Side"}
          </button>
        </div>

        {/* Both Sides for PDF */}
        <div className="hidden print:block">
          <div className="warranty-print-card warranty-card-front">
            <div className="flex items-start justify-between">
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA"
                width={190}
                height={64}
                className="h-auto w-[145px] rounded-lg bg-white p-2 object-contain"
              />
              <ShieldCheck size={30} className="text-emerald-400" />
            </div>

            <p className="mt-7 text-xs text-blue-200">
              DIGITAL REPAIR WARRANTY
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              {warranty.duration}
            </h2>

            <div className="mt-10">
              <p className="text-xs text-blue-200">CARD HOLDER</p>
              <p className="mt-1 font-bold text-white">
                {warranty.customer}
              </p>
            </div>

            <div className="mt-8 flex justify-between border-t border-white/20 pt-4">
              <p className="text-sm font-bold text-white">
                {warranty.id}
              </p>
              <p className="text-sm font-bold text-white">
                01 DEC 2026
              </p>
            </div>
          </div>

          <div className="warranty-print-card warranty-card-back mt-8">
            <p className="text-sm font-bold text-white">
              MR MOBILE WALA — WARRANTY TERMS
            </p>

            <div className="my-5 h-9 bg-black/80" />

            <p className="text-sm font-bold text-white">
              {warranty.device} — {warranty.service}
            </p>

            <p className="mt-3 text-xs text-white">
              Job: {warranty.job} | Invoice: {warranty.invoice}
            </p>

            <p className="mt-6 text-xs leading-6 text-white">
              This warranty covers only the repair service mentioned
              on this card. Physical damage, liquid damage and
              unrelated faults are not covered. Original invoice
              must be presented for warranty claims.
            </p>

            <div className="mt-8 flex justify-between border-t border-white/20 pt-4 text-xs text-white">
              <span>START: 01 NOV 2026</span>
              <span>EXPIRES: 01 DEC 2026</span>
            </div>
          </div>
        </div>

        {/* Warranty Details */}
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <h2 className="text-sm font-extrabold text-slate-900">
            Warranty Information
          </h2>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400">DEVICE</p>
                <p className="text-sm font-bold text-slate-800">
                  {warranty.device}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wrench size={18} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400">REPAIR SERVICE</p>
                <p className="text-sm font-bold text-slate-800">
                  {warranty.service}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400">VALIDITY</p>
                <p className="text-sm font-bold text-slate-800">
                  {warranty.start} – {warranty.expiry}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400">CUSTOMER CONTACT</p>
                <p className="text-sm font-bold text-slate-800">
                  +91 {warranty.phone.slice(2)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-5 space-y-3 print:hidden">
          <button
            type="button"
            onClick={downloadWarranty}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Download size={19} />
            Download Both Sides PDF
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={19} />
            Share Warranty on WhatsApp
          </a>
        </section>

        <p className="mt-5 text-center text-[10px] text-slate-400 print:hidden">
          MR MOBILE WALA · Digital Repair Warranty
        </p>
      </div>

      <style jsx global>{`
        .warranty-card-scene {
          width: 100%;
          aspect-ratio: 1.586 / 1;
          perspective: 1200px;
          cursor: pointer;
        }

        .warranty-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }

        .warranty-card-scene.is-flipped .warranty-card-inner {
          transform: rotateY(180deg);
        }

        .warranty-card-face {
          position: absolute;
          inset: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          padding: 20px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
        }

        .warranty-card-front {
          background: linear-gradient(135deg, #101827, #173d70 55%, #071b36);
        }

        .warranty-card-back {
          background: linear-gradient(135deg, #071b36, #173d70 55%, #101827);
          transform: rotateY(180deg);
        }

        .warranty-print-card {
          width: 100%;
          aspect-ratio: 1.586 / 1;
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          break-inside: avoid;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media (max-width: 420px) {
          .warranty-card-face {
            padding: 15px;
          }

          .warranty-card-face .mt-7 {
            margin-top: 14px;
          }

          .warranty-card-face .mt-5 {
            margin-top: 10px;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }

          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .warranty-card-inner {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
