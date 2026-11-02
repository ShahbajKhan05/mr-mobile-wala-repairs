import WhatsAppIcon from "@/components/WhatsAppIcon";
import { MessageCircle, Quote } from "lucide-react";

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
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="glass-page px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            Your Experience Matters
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl"
          >
            What Customers <span className="font-serif font-normal italic text-[#765A2B]">Say</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            हमारे ग्राहकों का भरोसा और प्यार ही हमारी पहचान है।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, index) => (
            <article
              key={review.name}
              className="glass-card group relative flex min-h-[220px] flex-col rounded-[24px] border border-white/80 bg-white/55 p-6 shadow-[0_12px_40px_rgba(32,43,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(32,43,50,0.10)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E9E5DC] bg-white/80 font-serif text-lg font-semibold text-[#765A2B]">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
                  REVIEW 0{index + 1}
                </span>
              </div>
              <Quote size={20} className="mt-6 text-[#B69A69]" />
              <p className="mt-2 flex-1 text-base font-medium leading-7 text-slate-800">
                “{review.review}”
              </p>
              <div className="mt-5 border-t border-slate-200/70 pt-4">
                <p className="text-sm font-bold text-slate-900">{review.name}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  Customer Feedback
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <WhatsAppIcon size={16} />
            Share Your Feedback
          </a>
        </div>
      </div>
    </section>
  );
}