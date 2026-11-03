"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-kicker]", { y: 12, autoAlpha: 0, duration: 0.45 })
        .from("[data-hero-title]", { y: 24, autoAlpha: 0, duration: 0.65 }, "-=0.2")
        .from("[data-hero-copy]", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.3")
        .from("[data-hero-actions]", { y: 12, autoAlpha: 0, duration: 0.45 }, "-=0.25")
        .from("[data-hero-visual]", { y: 24, scale: 0.985, autoAlpha: 0, duration: 0.7 }, "-=0.2");

      gsap.to("[data-hero-visual]", {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
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

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-white px-4 pb-7 pt-[5.6rem] sm:px-8 sm:pb-10 sm:pt-28 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_0%,#eef3ff_0%,rgba(255,255,255,0)_75%)]" />

      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-6 lg:grid-cols-[1fr_0.92fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p data-hero-kicker className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e5e5ea] bg-white px-3 py-1.5 text-[10px] font-bold text-[#555] shadow-sm sm:text-xs">
            <span className="size-2 rounded-full bg-[#16a36a]" />
            Rewa mein mobile ki dukaan
          </p>

          <h1
            id="hero-heading"
            data-hero-title
            className="mx-auto max-w-[700px] text-[clamp(2.35rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#171719] lg:mx-0"
          >
            Mobile ki har
            <br />
            problem ka <span className="text-[#1769d2]">solution.</span>
          </h1>

          <p data-hero-copy className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-[#626269] sm:mt-4 sm:text-base lg:mx-0">
            Phone theek karwana ho, naya lena ho ya bechna ho — hum madad karenge.
          </p>

          <div data-hero-actions className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={scrollToServices}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1769d2] px-6 text-sm font-bold text-white shadow-[0_8px_22px_rgba(23,105,210,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0d58b8] active:translate-y-0"
            >
              Kaam chunein <ArrowRight size={17} />
            </button>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#dedee4] bg-white px-6 text-sm font-bold text-[#222] transition hover:border-[#b9c9e2] hover:bg-[#f8faff]"
            >
              <MessageCircle size={17} /> WhatsApp karein
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#686870] lg:justify-start">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#16865a]" /> Aasaan booking</span>
            <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-[#1769d2]" /> Buy · Sell · Repair</span>
          </div>
        </div>

        <div data-hero-visual className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
          <div className="relative overflow-hidden rounded-2xl bg-[#e9edf3] shadow-[0_18px_55px_rgba(20,35,60,0.14)] sm:rounded-3xl">
            <div className="relative aspect-[16/8] w-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="MR MOBILE WALA REPAIRS"
                poster="/mr-mobile-wala-logo.png"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
              <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-left text-white sm:inset-x-6 sm:bottom-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/80">MR MOBILE WALA REPAIRS</p>
                  <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-2xl">Sahi Daam. Best Kaam.</p>
                </div>
                <span className="rounded-full border border-white/35 bg-black/20 px-2.5 py-1.5 text-[9px] font-bold backdrop-blur">REWA, MP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
