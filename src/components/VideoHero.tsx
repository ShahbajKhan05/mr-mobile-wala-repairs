"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, MessageCircle, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";

const SKETCHFAB_MODEL_ID = "83d09a9b30ad4a6e921305c3b6e396ed";
const SKETCHFAB_EMBED_URL =
  `https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&preload=1&transparent=1&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0`;

export default function VideoHero() {
  const { t, language } = useCustomerLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-story-kicker]", { y: 14, autoAlpha: 0, duration: 0.5 })
        .from("[data-story-title]", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.22")
        .from("[data-story-copy]", { y: 18, autoAlpha: 0, duration: 0.55 }, "-=0.34")
        .from("[data-story-actions]", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.24")
        .from("[data-story-model]", { y: 32, scale: 0.975, autoAlpha: 0, duration: 0.9 }, "-=0.28");

      gsap.to("[data-story-glow]", {
        y: 28,
        x: -12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-story-model]", {
        yPercent: 2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const hi = language === "hi";

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="customer-hero relative isolate overflow-hidden px-4 pb-10 pt-[6.4rem] sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 lg:pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#f8faff_0%,#f3f6fc_55%,#fbfcff_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 -z-10 size-[26rem] rounded-full bg-[#c9dcff]/45 blur-[110px]" />
      <div aria-hidden="true" data-story-glow className="pointer-events-none absolute -right-28 top-44 -z-10 size-[30rem] rounded-full bg-[#d9d0ff]/45 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-center gap-8 lg:grid-cols-[.88fr_1.12fr] lg:gap-12">
          <div className="relative z-10 text-center lg:text-left">
            <p data-story-kicker className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[.2em] text-[#31547c] shadow-[0_8px_28px_rgba(32,56,96,.07)] backdrop-blur-2xl sm:text-[10px]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {t("heroKicker")}
            </p>

            <h1
              id="hero-heading"
              data-story-title
              className="mx-auto max-w-[720px] text-[clamp(2.75rem,6.2vw,5.8rem)] font-semibold leading-[.98] tracking-[-.075em] text-[#101827] lg:mx-0"
            >
              {hi ? (
                <>Phone sirf phone nahi.<br /><span className="bg-gradient-to-r from-[#1769d2] via-[#4779d5] to-[#7b65ca] bg-clip-text text-transparent">Aapki duniya hai.</span></>
              ) : (
                <>It’s more than a phone.<br /><span className="bg-gradient-to-r from-[#1769d2] via-[#4779d5] to-[#7b65ca] bg-clip-text text-transparent">It’s your world.</span></>
              )}
            </h1>

            <p data-story-copy className="mx-auto mt-5 max-w-[540px] text-sm font-medium leading-7 text-[#667085] sm:text-base sm:leading-8 lg:mx-0">
              {hi
                ? "Roz ke har zaroori pal mein aapka phone saath hota hai. Jab use madad chahiye, MR MOBILE WALA REPAIRS aapke saath hai."
                : "Your phone is part of every important moment. And when it needs a little help, MR MOBILE WALA REPAIRS is here for you."}
            </p>

            <div data-story-actions className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={scrollToServices}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1769d2] px-7 text-sm font-bold text-white shadow-[0_14px_34px_rgba(23,105,210,.24)] transition duration-500 hover:-translate-y-1 hover:bg-[#1059b7] hover:shadow-[0_20px_42px_rgba(23,105,210,.3)] active:scale-[.98]"
              >
                {t("chooseWork")} <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="https://wa.me/919131383323"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/90 bg-white/65 px-7 text-sm font-bold text-[#26364b] shadow-[0_8px_28px_rgba(32,56,96,.06)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-white"
              >
                <MessageCircle size={17} /> {t("whatsapp")}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold text-[#68778b] sm:text-[11px] lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> {t("easyBooking")}</span>
              <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-[#1769d2]" /> {t("buySellRepair")}</span>
            </div>
          </div>

          <div data-story-model className="relative mx-auto w-full max-w-[720px] lg:max-w-none">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-5 rounded-[36px] bg-gradient-to-br from-white/80 via-[#dce8ff]/50 to-[#e9e2ff]/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-[#e8edf5] p-1.5 shadow-[0_32px_90px_rgba(27,47,83,.16),inset_0_1px_0_rgba(255,255,255,.95)] sm:rounded-[34px] sm:p-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-[radial-gradient(ellipse_at_50%_40%,#fff_0%,#e9eff9_52%,#dce5f2_100%)] sm:rounded-[27px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_50%,transparent_45%,rgba(30,48,78,.08)_100%)]" />
                <iframe
                  title="Interactive 3D model featured by MR MOBILE WALA REPAIRS"
                  src={SKETCHFAB_EMBED_URL}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setModelLoaded(true)}
                  className="absolute inset-0 h-full w-full border-0"
                />
                {!modelLoaded && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,#fff_0%,#e9eff9_58%,#dce5f2_100%)] px-6 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-white bg-white/70 text-[#4774b5] shadow-lg shadow-blue-950/5 backdrop-blur-xl">
                      <Sparkles size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#24344c]">{hi ? "Aapki nazar, ek naya perspective." : "A closer look, a new perspective."}</p>
                      <p className="mt-1 text-[10px] font-medium text-[#75839a]">{hi ? "Interactive 3D experience load ho raha hai…" : "Loading interactive 3D experience…"}</p>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-[9px] font-bold tracking-wide text-[#31445f] shadow-lg backdrop-blur-xl sm:text-[10px]">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {hi ? "INTERACTIVE 3D MODEL" : "INTERACTIVE 3D MODEL"}
                  </span>
                  <a
                    href="https://sketchfab.com/models/83d09a9b30ad4a6e921305c3b6e396ed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[9px] font-bold text-[#31445f] shadow-lg backdrop-blur-xl transition hover:bg-white sm:text-[10px]"
                  >
                    {hi ? "3D model dekhein" : "View 3D model"} <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-4 flex max-w-[560px] items-center justify-center gap-3 text-center text-[10px] font-semibold leading-5 text-[#8290a3] sm:text-[11px]">
              <ArrowDown size={14} className="shrink-0" />
              <span>{hi ? "Neeche dekhein — aapke phone ke liye teen simple raaste." : "Scroll down — three simple ways we can help with your phone."}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-2.5 border-t border-[#dce4f0]/80 pt-5 sm:mt-14 sm:grid-cols-3 sm:gap-4 sm:pt-7">
          {(hi
            ? [
                { n: "01", title: "Pehle samajhte hain", copy: "Aapki zaroorat aur phone ki problem." },
                { n: "02", title: "Phir sahi raasta", copy: "Repair, naya phone ya sell karne mein madad." },
                { n: "03", title: "Aapke saath", copy: "Seedhi baat aur aasaan booking." },
              ]
            : [
                { n: "01", title: "We listen first", copy: "Your needs and your phone’s problem." },
                { n: "02", title: "Find the right way", copy: "Help with repair, buying or selling." },
                { n: "03", title: "Here when you need us", copy: "Clear communication and easy booking." },
              ]
          ).map((step) => (
            <div key={step.n} className="flex items-start gap-3 rounded-2xl border border-white/75 bg-white/45 px-4 py-3 backdrop-blur-xl sm:border-transparent sm:bg-transparent sm:px-2">
              <span className="pt-0.5 text-[10px] font-extrabold tracking-[.14em] text-[#7a91b1]">{step.n}</span>
              <div>
                <p className="text-xs font-extrabold text-[#26364b] sm:text-sm">{step.title}</p>
                <p className="mt-1 text-[10px] leading-4 text-[#7b8798] sm:text-xs">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
