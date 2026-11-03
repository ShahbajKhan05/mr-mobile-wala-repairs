"use client";


import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,

  ShieldCheck,
  FileText,

} from "lucide-react";

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Repair Services", href: "/#services" },
      { label: "Track Repair", href: "/track" },
      { label: "Book a Service", href: "/#booking" },
    ],
  },
  {
    title: "Visit & Connect",
    links: [
      { label: "WhatsApp Support", href: "https://wa.me/919131383323" },
      { label: "Admin Login", href: "/admin-login" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const { t, language } = useCustomerLanguage();
  return (
    <footer className="glass-panel relative overflow-hidden border-t border-white/70 bg-white/45 text-slate-800">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#DCC69E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* Brand statement */}
        <div className="border-b border-white/70 py-8 text-center sm:py-20">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600 sm:mb-5 sm:text-xs">
            {language === "hi" ? "मोबाइल की पूरी सुविधा" : "The Mobile Experience"}
          </p>

          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.07em] sm:text-6xl md:text-7xl">
            BUY <span className="font-light text-indigo-400">/</span> SELL
            <br className="sm:hidden" />{" "}
            <span className="text-[#765A2B]">/</span> REPAIR
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-slate-500 sm:mt-7 sm:text-base sm:leading-7">
            {language === "hi" ? "MR MOBILE WALA REPAIRS पर मोबाइल से जुड़ी हर मदद पाएँ। सवाल लेकर आएँ और भरोसे के साथ जाएँ।" : "At MR MOBILE WALA REPAIRS, anything phone related. Walk in with a question, walk out with confidence."}
          </p>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 py-7 sm:grid-cols-2 sm:gap-12 sm:py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:py-16">

          {/* Brand column */}
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:text-left">
            <Link
              href="/"
              aria-label="MR MOBILE WALA REPAIRS Home"
              className="inline-flex items-center"
            >
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA REPAIRS"
                width={220}
                height={90}
                className="h-auto w-[145px] object-contain sm:w-[200px]"
              />
            </Link>

            <p className="mt-3 max-w-xs text-xs leading-6 text-[#626B70] sm:mt-5 sm:text-sm sm:leading-7">
              {t("footerDescription")}
            </p>

            <div className="mt-4 flex items-center gap-3 sm:mt-7">
              <a
                href="https://wa.me/919131383323"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/60 text-slate-700 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#A17D45] hover:bg-[#202B32] hover:text-white sm:h-11 sm:w-11"
              >
                <WhatsAppIcon size={18} />
              </a>

              <a
                href="https://instagram.com/mrmobilewala.2.0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8CE] bg-white text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-[#A17D45] hover:bg-[#202B32] hover:text-white sm:h-11 sm:w-11"
              >
                <Image src="/Instagram-3d.svg" alt="" aria-hidden="true" width={25} height={25} className="object-contain" />
              </a>

              <a
                href="mailto:mrmobilewala610@gmail.com"
                aria-label="Email MR MOBILE WALA REPAIRS"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8CE] bg-white text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-[#A17D45] hover:bg-[#202B32] hover:text-white sm:h-11 sm:w-11"
              >
                <Image src="/Gmail-3d.svg" alt="" aria-hidden="true" width={25} height={25} className="object-contain" />
              </a>
            </div>
          </div>

          {/* Navigation groups */}
          {FOOTER_GROUPS.map((group) => (
            <div key={language === "hi" ? (group.title === "Explore" ? t("footerExplore") : group.title === "Visit & Connect" ? t("footerVisit") : t("footerInfo")) : group.title} className="min-w-0">
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#765A2B] sm:mb-6 sm:text-xs sm:tracking-[0.2em]">
                {group.title}
              </h3>

              <ul className="space-y-2.5 sm:space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[11px] font-medium leading-5 text-slate-500 transition-colors duration-200 hover:text-[#765A2B] sm:text-sm"
                    >
                      {language === "hi" ? (link.label === "Home" ? t("home") : link.label === "Repair Services" ? t("services") : link.label === "Track Repair" ? t("track") : link.label === "Book a Service" ? t("book") : link.label === "WhatsApp Support" ? "WhatsApp सहायता" : link.label === "Admin Login" ? "एडमिन लॉगिन" : link.label === "Privacy Policy" ? "गोपनीयता नीति" : "नियम और शर्तें") : link.label}
                      <ArrowUpRight
                        size={13}
                        className="hidden opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/70 py-4 text-center sm:flex-row sm:gap-4 sm:py-6 sm:text-left">
          <div className="flex flex-col items-center gap-2.5 text-[10px] text-slate-500 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3 sm:text-xs">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="shrink-0 text-[#765A2B]" />
              {t("footerTrust")}
            </span>

            <span className="inline-flex items-center gap-2">
              <FileText size={15} className="shrink-0 text-[#765A2B]" />
              {t("footerDetails")}
            </span>
          </div>

          <a
            href="https://wa.me/919131383323"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#202B32] transition-colors hover:text-[#765A2B]"
          >
            <WhatsAppIcon size={16} />
            {t("getInTouch")}
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#DDD8CE] py-4 text-center sm:flex-row sm:gap-3 sm:py-6">
          <p className="text-[10px] text-[#5E6668] sm:text-xs">
            © 2026 MR MOBILE WALA REPAIRS. All rights reserved.
          </p>

          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#765A2B]">
            BUY . SELL . REPAIR
          </p>
        </div>
      </div>
    </footer>
  );
}
