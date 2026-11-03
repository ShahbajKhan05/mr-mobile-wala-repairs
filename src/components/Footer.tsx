"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FOOTER_GROUPS = [
  {
    key: "explore",
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Repair Services", href: "/#services" },
      { label: "Track Repair", href: "/track" },
      { label: "Book a Service", href: "/#booking" },
    ],
  },
  {
    key: "connect",
    title: "Connect",
    links: [
      { label: "WhatsApp Support", href: "https://wa.me/919131383323" },
      { label: "Email Us", href: "mailto:mrmobilewala610@gmail.com" },
      { label: "Instagram", href: "https://instagram.com/mrmobilewala.2.0" },
    ],
  },
  {
    key: "info",
    title: "Information",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const HINDI_LINKS: Record<string, string> = {
  Home: "होम",
  "Repair Services": "रिपेयर सेवाएँ",
  "Track Repair": "रिपेयर ट्रैक करें",
  "Book a Service": "बुकिंग करें",
  "WhatsApp Support": "WhatsApp सहायता",
  "Email Us": "ईमेल करें",
  Instagram: "इंस्टाग्राम",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम और शर्तें",
};

export default function Footer() {
  const { t, language } = useCustomerLanguage();
  const hi = language === "hi";

  return (
    <footer className="customer-footer relative isolate overflow-hidden bg-[#101923] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 -top-44 h-[28rem] w-[28rem] rounded-full bg-[#3B82F6]/20 blur-[110px]" />
        <div className="absolute -bottom-56 -left-28 h-[30rem] w-[30rem] rounded-full bg-[#B58A4A]/15 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <section className="relative -mt-1 overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.07] px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl sm:rounded-[32px] sm:px-9 sm:py-9 lg:px-12">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-white/10" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D9B779]/30 bg-[#D9B779]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#E8C98F]">
                <Sparkles size={12} />
                {hi ? "आपके फोन के लिए, एक भरोसेमंद जगह" : "One place for your phone"}
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-.045em] text-white sm:text-4xl lg:text-[2.8rem]">
                {hi ? "फोन से जुड़ी मदद चाहिए?" : "Need a hand with your phone?"}
                <span className="mt-1 block bg-gradient-to-r from-[#F2D7A2] via-[#D9B779] to-[#AFCBFF] bg-clip-text text-transparent">
                  {hi ? "बात शुरू यहीं से करें।" : "Let’s make it simple."}
                </span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                {hi
                  ? "रिपेयर, नया फोन या अपना फोन बेचना — हमें WhatsApp पर बताइए।"
                  : "Repairs, a new phone, or selling yours — tell us what you need on WhatsApp."}
              </p>
            </div>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#D9B779] px-6 text-sm font-bold text-[#17212B] shadow-[0_12px_35px_rgba(217,183,121,.2)] transition duration-300 hover:-translate-y-1 hover:bg-[#F0D5A3] hover:shadow-[0_18px_42px_rgba(217,183,121,.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F0D5A3]"
            >
              <WhatsAppIcon size={19} />
              {hi ? "WhatsApp पर बात करें" : "Chat on WhatsApp"}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-12 sm:py-16 lg:grid-cols-[1.45fr_.8fr_.95fr_.8fr] lg:gap-14">
          <div className="max-w-sm">
            <Link href="/" aria-label="MR MOBILE WALA REPAIRS Home" className="inline-flex rounded-xl bg-white p-2.5">
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA REPAIRS"
                width={220}
                height={90}
                className="h-auto w-[150px] object-contain sm:w-[175px]"
              />
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              {t("footerDescription")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://wa.me/919131383323" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="footer-social-link">
                <WhatsAppIcon size={19} />
              </a>
              <a href="https://instagram.com/mrmobilewala.2.0" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link">
                <Image src="/Instagram-3d.svg" alt="" aria-hidden="true" width={25} height={25} className="object-contain" />
              </a>
              <a href="mailto:mrmobilewala610@gmail.com" aria-label="Email" className="footer-social-link">
                <Image src="/Gmail-3d.svg" alt="" aria-hidden="true" width={25} height={25} className="object-contain" />
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={14} className="shrink-0 text-[#D9B779]" />
              {hi ? "रीवा, मध्य प्रदेश" : "Rewa, Madhya Pradesh"}
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.key} aria-label={group.title}>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#D9B779]">
                {group.key === "explore" ? t("footerExplore") : group.key === "connect" ? (hi ? "संपर्क" : "Connect") : t("footerInfo")}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                    >
                      <span>{hi ? HINDI_LINKS[link.label] : link.label}</span>
                      <ArrowUpRight size={13} className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="grid gap-3 border-y border-white/10 py-5 sm:grid-cols-2 sm:gap-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.045] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">{t("footerTrust")}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{hi ? "हर कदम पर साफ जानकारी" : "Clear information at every step"}</p>
            </div>
            <CheckCircle2 size={16} className="ml-auto text-emerald-300" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.045] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9B779]/10 text-[#E8C98F]">
              <Clock3 size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">{hi ? "सीधी बातचीत" : "Personal assistance"}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{hi ? "WhatsApp पर हमसे संपर्क करें" : "Reach us directly on WhatsApp"}</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-slate-500" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] leading-5 text-slate-400">
            © {new Date().getFullYear()} MR MOBILE WALA REPAIRS. {hi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
            <span>BUY <i className="px-1 not-italic text-[#D9B779]">·</i> SELL <i className="px-1 not-italic text-[#D9B779]">·</i> REPAIR</span>
            <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              {hi ? "ऊपर जाएँ" : "Back to top"} <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-social-link {
          display: inline-flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 14px;
          background: rgba(255,255,255,.06);
          color: #fff;
          transition: transform .3s ease, border-color .3s ease, background .3s ease;
        }
        .footer-social-link:hover {
          transform: translateY(-4px);
          border-color: rgba(217,183,121,.65);
          background: rgba(217,183,121,.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-social-link { transition: none; }
          .footer-social-link:hover { transform: none; }
        }
      `}</style>
    </footer>
  );
}
