"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Quote, MessageCircle } from "lucide-react";
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
      className="glass-page px-3 py-7 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1769c2] sm:text-xs">
              {t("testimonialsEyebrow")}
            </p>
            <h2 id="testimonials-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
              {t("testimonialsTitle")}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#666] sm:text-sm">
              {t("testimonialsCopy")}
            </p>
          </div>
          <span className="hidden items-center gap-2 text-[11px] font-semibold text-[#686b73] sm:inline-flex">
            <MessageCircle size={15} className="text-[#1769c2]" /> {t("feedbackWelcome")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {REVIEWS.map((review, index) => (
            <article
              key={review.name}
              className={
                "relative flex min-h-[150px] flex-col overflow-hidden rounded-2xl border p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,35,60,0.09)] sm:min-h-[178px] sm:rounded-3xl sm:p-4 " +
                (index === 0
                  ? "border-[#1d1d1f] bg-[#1d1d1f] text-white"
                  : "border-[#e5e7eb] bg-white text-[#1d1d1f]")
              }
            >
              <div className="flex items-center justify-between">
                <span className={"flex size-8 items-center justify-center rounded-full text-xs font-extrabold sm:size-9 " + (index === 0 ? "bg-white/15 text-white" : "bg-[#edf3fc] text-[#1769c2]")}>
                  {review.name.charAt(0).toUpperCase()}
                </span>
                <Quote size={19} className={index === 0 ? "text-white/40" : "text-[#1769c2]/35"} />
              </div>
              <p className={"mt-4 flex-1 text-sm font-semibold leading-6 sm:text-base " + (index === 0 ? "text-white" : "text-[#25262a]")}>
                “{review.review}”
              </p>
              <div className={"mt-3 border-t pt-2.5 " + (index === 0 ? "border-white/15" : "border-[#eceef1]")}>
                <p className="text-xs font-extrabold">{review.name}</p>
                <p className={"mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] " + (index === 0 ? "text-white/55" : "text-[#858993]")}>{t("customerFeedback")}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-3 py-3 sm:mt-4 sm:flex-row sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#e8f6ef] text-[#218653]"><MessageCircle size={17} /></span>
            <div>
              <p className="text-xs font-bold text-[#222] sm:text-sm">{t("experience")}</p>
              <p className="text-[10px] text-[#666] sm:text-xs">{t("tellFeedback")}</p>
            </div>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1769d2] px-5 text-xs font-bold text-white transition hover:bg-[#0d58b8] sm:w-auto"
          >
            <WhatsAppIcon size={16} />
            {t("sendFeedback")}
          </a>
        </div>
      </div>
    </section>
  );
}
