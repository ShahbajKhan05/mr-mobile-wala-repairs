"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import gsap from "gsap";

export default function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-hero-kicker]", { y: 18, autoAlpha: 0, duration: 0.65 })
        .from("[data-hero-title]", { y: 34, autoAlpha: 0, duration: 0.85 }, "-=0.35")
        .from("[data-hero-copy]", { y: 20, autoAlpha: 0, duration: 0.65 }, "-=0.45")
        .from("[data-hero-visual]", { y: 38, scale: 0.97, autoAlpha: 0, duration: 1 }, "-=0.4")
        .from("[data-hero-actions]", { y: 16, autoAlpha: 0, duration: 0.55 }, "-=0.5");
    }, root);

    return () => context.revert();
  }, []);

  const scrollToBooking = () => {
    document.querySelector("#services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[min(900px,100svh)] w-full items-center overflow-hidden px-4 pb-10 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-300/25 blur-[100px] sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-violet-300/30 blur-[110px] sm:h-[34rem] sm:w-[34rem]" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-amber-200/25 blur-[90px]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <p data-hero-kicker className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-700 shadow-sm backdrop-blur-xl sm:mb-7 sm:text-[10px]">
            <Sparkles size={13} />
            Rewa&apos;s mobile care destination
          </p>

          <h1
            id="hero-heading"
            data-hero-title
            className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.94] tracking-[-0.075em] text-slate-950"
          >
            MR MOBILE WALA
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              REPAIRS.
            </span>
          </h1>

          <p data-hero-copy className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:mt-7 sm:text-base sm:leading-8 lg:mx-0">
            Your phone, our passion. Buy, sell or repair with honest guidance,
            careful service and personal support — all in one place.
          </p>

          <div data-hero-actions className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={scrollToBooking}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-7 text-sm font-bold text-white shadow-[0_16px_40px_rgba(49,46,129,.22)] transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-[0_22px_50px_rgba(79,70,229,.28)] sm:w-auto"
            >
              Explore our services
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/65 px-7 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white sm:w-auto"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold text-slate-500 sm:mt-9 sm:text-xs lg:justify-start">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-600" /> Personal assistance</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>BUY <span className="px-1 text-indigo-400">/</span> SELL <span className="px-1 text-indigo-400">/</span> REPAIR</span>
          </div>
        </div>

        <div data-hero-visual className="relative mx-auto w-full max-w-[760px] lg:ml-auto">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-indigo-300/35 via-white/20 to-fuchsia-300/35 blur-2xl sm:-inset-6" />
          <div className="glass-panel relative overflow-hidden rounded-[1.6rem] p-2 shadow-[0_35px_100px_rgba(49,46,129,.18)] sm:rounded-[2.25rem] sm:p-3">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.2rem] bg-slate-900 sm:rounded-[1.75rem]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="MR MOBILE WALA REPAIRS brand video"
                poster="/mr-mobile-wala-logo.png"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-slate-950/10" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white sm:inset-x-7 sm:bottom-7">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/65 sm:text-[10px]">MR MOBILE WALA REPAIRS</p>
                  <p className="mt-1 text-xl font-bold tracking-tight sm:text-3xl">Sahi Daam. Best Kaam.</p>
                </div>
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-2 text-[9px] font-semibold backdrop-blur-xl sm:text-[10px]">REWA, MP</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-2 flex items-center gap-2 rounded-2xl border border-white/80 bg-white/85 px-3 py-2.5 shadow-[0_14px_35px_rgba(30,41,59,.12)] backdrop-blur-xl sm:-bottom-5 sm:left-8 sm:px-4 sm:py-3">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={17} /></span>
            <span><span className="block text-[10px] font-bold text-slate-900 sm:text-xs">Care you can trust</span><span className="block text-[9px] text-slate-500 sm:text-[10px]">Support at every step</span></span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToBooking}
        aria-label="Discover our services"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-slate-500 transition hover:text-indigo-700 lg:flex"
      >
        Scroll to explore <ArrowDown size={14} />
      </button>
    </section>
  );
}
