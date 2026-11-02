import { MessageCircle, Quote, Star } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/919131383323?text=" +
  encodeURIComponent("Hello MR MOBILE WALA, I would like to share my feedback.");

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="glass-page px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            Your Experience Matters
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl"
          >
            Customer <span className="font-serif font-normal italic text-[#765A2B]">Testimonials</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            हर feedback हमारे लिए खास है। अपना अनुभव हमारे साथ साझा करें।
          </p>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[28px] border border-white/80 bg-white/55 px-6 py-10 text-center shadow-[0_18px_60px_rgba(32,43,50,0.06)] sm:px-12 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E9E5DC] bg-white/70 text-[#765A2B]">
            <Quote size={25} strokeWidth={1.5} />
          </div>
          <div className="mt-5 flex justify-center gap-1 text-[#B69A69]" aria-label="Share your review">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={15} />
            ))}
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Your review could be featured here
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
            अभी तक कोई verified customer review publish नहीं किया गया है।
            अगर आपने हमसे service ली है, तो अपना असली अनुभव WhatsApp पर भेजें।
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <MessageCircle size={16} />
            Share Your Feedback
          </a>
        </div>
      </div>
    </section>
  );
}
