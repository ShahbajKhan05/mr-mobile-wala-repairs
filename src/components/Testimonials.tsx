"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ArrowUpRight, MessageCircle, Quote } from "lucide-react";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";

const REVIEWS = [
  { name: "Sajid", review: "Badhiya service hai." },
  { name: "Arbaj", review: "Excellent!" },
  { name: "Arish", review: "Naam hi nahi, kaam bhi unique hai." },
  { name: "Abdul Haq", review: "Superb service." },
];

const WHATSAPP_URL =
  "https://wa.me/919131383323?text=" +
  encodeURIComponent("Hello MR MOBILE WALA REPAIRS, I would like to share my feedback.");

export default function Testimonials() {
  const { t } = useCustomerLanguage();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="customer-testimonials px-3 py-8 sm:px-8 sm:py-12 lg:px-12"
    >
      <div className="mx-auto max-w-[1120px]">
        <header className="overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-[#071b2d] via-[#102f4d] to-[#244b72] px-5 py-5 text-white shadow-[0_18px_48px_rgba(13,31,55,.14)] sm:rounded-[28px] sm:px-7 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-200 sm:text-[10px]">
                {t("testimonialsEyebrow")}
              </p>
              <h2 id="testimonials-heading" className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                {t("testimonialsTitle")}
              </h2>
              <p className="mt-1.5 max-w-lg text-xs leading-5 text-blue-100/75 sm:text-sm">
                {t("testimonialsCopy")}
              </p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/90 shadow-inner backdrop-blur-xl sm:size-14">
              <MessageCircle size={22} strokeWidth={1.6} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-3 text-[10px] font-semibold text-blue-100/75 sm:text-xs">
            <Quote size={14} />
            <span>{t("customerFeedback")}</span>
            <span className="ml-auto rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] tracking-wider text-white/90">
              {String(REVIEWS.length).padStart(2, "0")} {t("customerFeedback")}
            </span>
          </div>
        </header>

        <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">
          {REVIEWS.map((review, index) => (
            <article
              key={review.name}
              className="group flex min-w-0 items-start gap-3 rounded-[20px] border border-white/80 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(13,31,55,.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-[0_16px_36px_rgba(13,31,55,.11)] sm:rounded-[22px] sm:p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f0fb] to-[#d9e6f5] text-sm font-extrabold text-[#244b72] ring-1 ring-[#dce7f4] sm:size-11">
                {review.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-bold text-[#172033]">{review.name}</h3>
                  <span className="rounded-full bg-[#f1f5fa] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#63748b]">
                    {t("customerFeedback")}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-medium leading-5 text-[#475569] sm:text-sm">
                  “{review.review}”
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-[#9aabc0]" aria-hidden="true">
                <Quote size={17} strokeWidth={1.7} />
              </span>
            </article>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 text-[11px] font-bold text-[#24364d] shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[.99] sm:mt-4 sm:min-h-12 sm:text-xs"
        >
          <WhatsAppIcon size={16} />
          {t("sendFeedback")}
          <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
