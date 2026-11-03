"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-hero-kicker]", { y: 16, autoAlpha: 0, duration: 0.65 })
        .from("[data-hero-title]", { y: 42, autoAlpha: 0, duration: 0.9 }, "-=0.32")
        .from("[data-hero-copy]", { y: 22, autoAlpha: 0, duration: 0.7 }, "-=0.48")
        .from("[data-hero-actions]", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.42")
        .from("[data-hero-visual]", { y: 52, scale: 0.965, autoAlpha: 0, duration: 1.1 }, "-=0.45");

      gsap.to("[data-hero-visual]", {
        yPercent: 9,
        scale: 0.975,
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

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-white px-4 pb-12 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_50%_0%,#f1f1f4_0%,rgba(255,255,255,0)_72%)]" />

      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center text-center">
        <p data-hero-kicker className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73] shadow-sm sm:mb-8 sm:text-[11px]">
          <Sparkles size={13} className="text-[#0071e3]" />
          Rewa&apos;s mobile care destination
        </p>

        <h1
          id="hero-heading"
          data-hero-title
          className="max-w-5xl text-[clamp(3rem,9.2vw,8.4rem)] font-semibold leading-[0.91] tracking-[-0.085em] text-[#1d1d1f]"
        >
          Your phone.
          <br />
          <span className="text-[#86868b]">In better hands.</span>
        </h1>

        <p data-hero-copy className="mt-6 max-w-2xl text-base leading-7 text-[#6e6e73] sm:mt-8 sm:text-xl sm:leading-8">
          Thoughtful repairs, phones worth discovering, and honest help when it matters.
          Everything your phone needs, all in one place.
        </p>

        <div data-hero-actions className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={scrollToServices}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] sm:w-auto"
          >
            Explore services
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <a
            href="https://wa.me/919131383323"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-7 text-sm font-semibold text-[#1d1d1f] transition duration-300 hover:border-[#86868b] hover:bg-[#f5f5f7] sm:w-auto"
          >
            Talk to our team <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#86868b] sm:mt-10 sm:text-[11px]">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#0071e3]" /> Personal assistance</span>
          <span aria-hidden="true" className="hidden size-1 rounded-full bg-[#d2d2d7] sm:block" />
          <span>Buy <span className="px-1 text-[#d2d2d7]">/</span> Sell <span className="px-1 text-[#d2d2d7]">/</span> Repair</span>
        </div>

        <div data-hero-visual className="relative mt-12 w-full sm:mt-16 lg:mt-20">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f5f5f7] shadow-[0_28px_90px_rgba(0,0,0,0.12)] sm:rounded-[2rem]">
            <div className="relative aspect-[5/4] w-full sm:aspect-[16/8.2]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="MR MOBILE WALA REPAIRS brand film"
                poster="/mr-mobile-wala-logo.png"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-left text-white sm:inset-x-9 sm:bottom-9">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-[10px]">MR MOBILE WALA REPAIRS</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">Sahi Daam. Best Kaam.</p>
                </div>
                <span className="rounded-full border border-white/35 bg-black/20 px-3 py-2 text-[9px] font-semibold tracking-[0.12em] backdrop-blur-md sm:text-[10px]">REWA, MP</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#86868b] sm:mt-5 sm:text-[11px]">
            A little more care in every connection.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToServices}
        aria-label="Discover our services"
        className="mx-auto mt-10 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86868b] transition hover:text-[#1d1d1f] lg:flex"
      >
        Discover more <ArrowDown size={14} />
      </button>
    </section>
  );
}
