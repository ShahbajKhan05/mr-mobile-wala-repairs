"use client";

import Link from "next/link";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";
import { ArrowUpRight, Wrench, ShoppingBag, RefreshCw, ShieldCheck, Clock3 } from "lucide-react";

const services = [
  {
    id: "repair",
    icon: Wrench,
    title: "Phone Repair",
    simple: "Phone theek karwayein",
    action: "Book karein",
    href: "/?service=repair#booking",
    tone: "repair",
  },
  {
    id: "buy",
    icon: ShoppingBag,
    title: "Buy Phone",
    simple: "Naya phone kharidein",
    action: "Phone dekhein",
    href: "/?service=buy#booking",
    tone: "buy",
  },
  {
    id: "sell",
    icon: RefreshCw,
    title: "Sell Phone",
    simple: "Apna phone bechein",
    action: "Phone bechein",
    href: "/?service=sell#booking",
    tone: "sell",
  },
];

export default function ServiceShowcase() {
  const { t } = useCustomerLanguage();

  return (
    <section id="services" aria-labelledby="services-heading" className="customer-services relative scroll-mt-20 px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[.2em] text-[#4776b5] sm:text-[10px]">{t("serviceEyebrow")}</p>
            <h2 id="services-heading" className="mt-2 text-[clamp(1.65rem,3vw,2.55rem)] font-semibold leading-tight tracking-[-.055em] text-[#172033]">
              {t("chooseService")}
            </h2>
            <p className="mt-1.5 max-w-xl text-xs leading-5 text-[#7a8799] sm:text-sm">{t("tapButton")}</p>
          </div>
          <span className="hidden rounded-full border border-white/80 bg-white/50 px-3 py-2 text-[10px] font-bold text-[#7a8799] shadow-sm backdrop-blur-xl sm:inline-flex">01 — 03</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {services.map(({ id, icon: Icon, title, simple, action, href, tone }, index) => (
            <Link
              key={id}
              href={href}
              className={"customer-service-card group relative flex min-h-[112px] items-center gap-3.5 overflow-hidden rounded-[22px] border border-white/85 bg-white/65 p-3.5 shadow-[0_14px_38px_rgba(32,48,82,.065)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(32,48,82,.12)] active:scale-[.99] sm:min-h-[230px] sm:flex-col sm:items-start sm:justify-between sm:rounded-[28px] sm:p-5 lg:p-6 " + tone}
            >
              <span className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-white/35 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative flex min-w-0 flex-1 items-center gap-3.5 sm:block">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[17px] border border-white/80 bg-white/70 text-[#315d96] shadow-[0_8px_20px_rgba(31,55,92,.07)] transition duration-500 group-hover:rotate-[-5deg] group-hover:scale-105 sm:size-[58px] sm:rounded-[20px]">
                  <Icon size={23} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 sm:mt-6">
                  <span className="mb-1 hidden text-[9px] font-extrabold tracking-[.18em] text-[#91a0b4] sm:block">0{index + 1} / SERVICE</span>
                  <h3 className="text-sm font-extrabold tracking-[-.02em] text-[#1d2a3d] sm:text-xl">{title === "Phone Repair" ? t("phoneRepair") : title === "Buy Phone" ? t("buyPhone") : t("sellPhone")}</h3>
                  <p className="mt-1 text-[10px] font-medium leading-4 text-[#77869a] sm:text-xs">{simple === "Phone theek karwayein" ? t("fixPhone") : simple === "Naya phone kharidein" ? t("newPhone") : t("sellYourPhone")}</p>
                </div>
              </div>
              <span className="relative inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/80 bg-white/65 px-3 text-[10px] font-extrabold text-[#315d96] shadow-sm transition duration-300 group-hover:bg-[#1d3556] group-hover:text-white sm:min-h-10 sm:px-4 sm:text-[11px]">
                {action === "Book karein" ? t("bookNow") : action === "Phone dekhein" ? t("viewPhones") : t("sellYourPhone")}
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-[20px] border border-white/80 bg-white/55 px-3.5 py-3.5 shadow-[0_12px_32px_rgba(32,48,82,.05)] backdrop-blur-2xl sm:mt-4 sm:rounded-[22px] sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#e9f1fc] text-[#356aa9]"><ShieldCheck size={19} strokeWidth={1.8} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#25364d] sm:text-sm">{t("trackStatus")}</p>
              <p className="mt-0.5 text-[10px] leading-4 text-[#7c899a] sm:text-xs">{t("trackingHelp")}</p>
            </div>
          </div>
          <Link href="/track" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#172b46] px-3.5 text-[10px] font-bold text-white shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#244a78] sm:min-h-10 sm:px-4 sm:text-xs">
            {t("trackNow")} <Clock3 size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
