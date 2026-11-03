"use client";

import { useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Quote, MessageCircle, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeReview = REVIEWS[activeIndex];
  const move = (direction: number) =>
    setActiveIndex((current) => (current + direction + REVIEWS.length) % REVIEWS.length);

  return (
    <section aria-labelledby="testimonials-heading" className="customer-testimonials px-3 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-[1320px] sm:hidden">
        <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_18px_48px_rgba(13,31,55,.12)]">
          <header className="relative overflow-hidden bg-gradient-to-br from-[#071b2d] via-[#102f4d] to-[#244b72] px-4 pb-4 pt-4 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-3 -top-5 size-24 rounded-full border border-white/10" />
            <div className="relative flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.22em] text-blue-200">{t("testimonialsEyebrow")}</p>
                <h2 id="testimonials-heading" className="mt-1 text-lg font-extrabold tracking-tight">{t("testimonialsTitle")}</h2>
              </div>
              <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-xl">{String(activeIndex + 1).padStart(2, "0")} / 0{REVIEWS.length}</span>
            </div>
            <div className="relative mt-4 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-base font-bold text-white shadow-inner backdrop-blur-xl">{activeReview.name.charAt(0)}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{activeReview.name}</p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[.15em] text-blue-100/75">{t("customerFeedback")}</p>
              </div>
              <Quote size={23} strokeWidth={1.5} className="ml-auto shrink-0 text-white/35" />
            </div>
          </header>

          <div className="px-4 pb-3 pt-4">
            <h3 key={activeIndex} id="testimonials-heading-mobile" aria-live="polite" className="customer-review-quote min-h-[58px] text-[clamp(1.15rem,5vw,1.4rem)] font-semibold leading-[1.35] tracking-[-.035em] text-[#172033]">
              “{activeReview.review}”
            </h3>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e9edf3] pt-3">
              <p className="min-w-0 text-[10px] leading-4 text-[#77808b]">{t("testimonialsCopy")}</p>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" onClick={() => move(-1)} aria-label="Previous customer review" className="flex size-8 items-center justify-center rounded-full border border-[#e5eaf1] bg-white text-[#46536a] shadow-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Next customer review" className="flex size-8 items-center justify-center rounded-full border border-[#e5eaf1] bg-white text-[#46536a] shadow-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2.5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/85 bg-white/65 px-4 text-[11px] font-bold text-[#24364d] shadow-sm backdrop-blur-xl transition active:scale-[.99]">
          <WhatsAppIcon size={15} /> {t("sendFeedback")} <ArrowUpRight size={13} />
        </a>
      </div>

      <div className="mx-auto hidden max-w-[1320px] sm:block rounded-[24px] bg-[#071722] p-2.5 shadow-[0_30px_90px_rgba(8,25,42,.18)] sm:rounded-[34px] sm:p-5">
        <div className="grid min-h-[390px] overflow-hidden rounded-[18px] bg-[#f8f8f6] sm:min-h-[480px] sm:grid-cols-[.78fr_1.22fr] sm:rounded-[26px]">
          <div className="relative flex min-h-[170px] flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_25%_20%,rgba(112,145,191,.36),transparent_48%),linear-gradient(145deg,#172d43,#091725)] p-5 text-white sm:min-h-[440px] sm:p-8 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 size-64 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-20 size-44 rounded-full border border-white/10" />
            <div className="relative flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[.24em] text-white/65 sm:text-[10px]">{t("testimonialsEyebrow")}</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-semibold text-white/80 backdrop-blur-xl">{String(activeIndex + 1).padStart(2, "0")} / 0{REVIEWS.length}</span>
            </div>
            <div className="relative mt-7 flex flex-1 items-center justify-center sm:mt-0">
              <div className="flex size-28 items-center justify-center rounded-full border border-white/25 bg-white/[.08] shadow-[0_20px_70px_rgba(0,0,0,.2)] backdrop-blur-xl sm:size-44">
                <div className="flex size-[78%] items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/20 to-white/[.03] text-5xl font-light tracking-[-.08em] text-white sm:text-7xl">
                  {activeReview.name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="relative mt-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-lg font-semibold tracking-tight sm:text-2xl">{activeReview.name}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.18em] text-white/55">{t("customerFeedback")}</p>
              </div>
              <Quote size={34} strokeWidth={1} className="text-white/25 sm:size-11" />
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-12 xl:p-14">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#63748b] sm:text-[10px]">{t("testimonialsTitle")}</p>
              <h2 key={activeIndex} id="testimonials-heading-desktop" aria-live="polite" className="customer-review-quote mt-5 min-h-[130px] font-serif text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.04] tracking-[-.045em] text-[#111827] sm:mt-7 sm:min-h-[220px]">
                “{activeReview.review}”
              </h2>
              <p className="mt-4 max-w-md text-xs leading-6 text-[#77808b] sm:text-sm">{t("testimonialsCopy")}</p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white bg-white/70 p-3 shadow-[0_12px_35px_rgba(18,35,60,.06)] backdrop-blur-xl sm:mt-10 sm:p-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#172033] sm:text-sm">{activeReview.name}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.13em] text-[#89919c]">{t("customerFeedback")}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => move(-1)} aria-label="Previous customer review" className="flex size-10 items-center justify-center rounded-full border border-[#e8ebf0] bg-white text-[#46536a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#edf3fb] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Next customer review" className="flex size-10 items-center justify-center rounded-full border border-[#e8ebf0] bg-white text-[#46536a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#edf3fb] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 px-2 py-4 text-white sm:flex-row sm:px-3 sm:py-5">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-white/65 sm:text-xs">
            <MessageCircle size={15} /> {t("feedbackWelcome")}
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold text-white backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto">
            <WhatsAppIcon size={16} /> {t("sendFeedback")} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
