"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import gsap from "gsap";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoHero() {
  const { t } = useCustomerLanguage();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    let removePointerListeners = () => {};
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-kicker]", { y: 12, autoAlpha: 0, duration: 0.45 })
        .from("[data-hero-title]", { y: 24, autoAlpha: 0, duration: 0.65 }, "-=0.2")
        .from("[data-hero-copy]", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.3")
        .from("[data-hero-actions]", { y: 12, autoAlpha: 0, duration: 0.45 }, "-=0.25")
        .from("[data-hero-visual]", { y: 24, scale: 0.985, autoAlpha: 0, duration: 0.7 }, "-=0.2");

      gsap.to("[data-hero-visual]", {
        yPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const visual = root.querySelector<HTMLElement>(".customer-hero-visual");
      if (visual && window.matchMedia("(pointer: fine)").matches) {
        const rotateX = gsap.quickTo(visual, "rotationX", { duration: 0.8, ease: "power3.out" });
        const rotateY = gsap.quickTo(visual, "rotationY", { duration: 0.8, ease: "power3.out" });
        const moveX = gsap.quickTo(visual, "x", { duration: 0.9, ease: "power3.out" });
        const moveY = gsap.quickTo(visual, "y", { duration: 0.9, ease: "power3.out" });
        const onPointerMove = (event: PointerEvent) => {
          const bounds = visual.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          rotateX(y * -3.2);
          rotateY(x * 4);
          moveX(x * 3);
          moveY(y * 2);
        };
        const resetTilt = () => { rotateX(0); rotateY(0); moveX(0); moveY(0); };
        visual.addEventListener("pointermove", onPointerMove);
        visual.addEventListener("pointerleave", resetTilt);
        gsap.set(visual, { transformPerspective: 1100, transformOrigin: "50% 50%" });
        removePointerListeners = () => {
          visual.removeEventListener("pointermove", onPointerMove);
          visual.removeEventListener("pointerleave", resetTilt);
        };
      }

      gsap.to("[data-hero-orbit]", {
        rotate: 360,
        duration: 34,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    }, root);

    return () => {
      removePointerListeners();
      context.revert();
    };
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
      className="customer-hero relative isolate overflow-hidden px-4 pb-8 pt-[6.2rem] sm:px-8 sm:pb-12 sm:pt-32 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(204,220,255,.72)_0%,rgba(255,255,255,0)_72%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-52 -z-10 size-72 rounded-full bg-violet-200/30 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-64 -z-10 size-72 rounded-full bg-sky-200/35 blur-[100px]" />
      <div aria-hidden="true" data-hero-orbit className="pointer-events-none absolute left-[calc(50%-390px)] top-[470px] -z-10 hidden size-[780px] rounded-full border border-white/50 lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-[360px] -z-10 hidden size-24 rounded-full border border-white/65 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_12px_40px_rgba(55,85,140,.08)] backdrop-blur-xl lg:block" />

      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center text-center">
        <div className="w-full">
          <p data-hero-kicker className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 py-2 text-[10px] font-bold text-[#555] shadow-[0_8px_30px_rgba(30,50,90,.07)] backdrop-blur-xl sm:text-xs">
            <span className="size-2 rounded-full bg-[#16a36a]" />
            {t("heroKicker")}
          </p>

          <h1
            id="hero-heading"
            data-hero-title
            className="mx-auto max-w-[900px] text-[clamp(2.65rem,7.4vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-[#151923]"
          >
            {t("heroTitle")}
          </h1>

          <p data-hero-copy className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-[#626b7a] sm:mt-5 sm:text-lg sm:leading-8">
            {t("heroCopy")}
          </p>

          <div data-hero-actions className="mt-6 flex flex-col justify-center gap-3 sm:mt-7 sm:flex-row">
            <button
              type="button"
              onClick={scrollToServices}
              className="customer-hero-primary inline-flex min-h-12 items-center justify-center gap-2 bg-[#1769d2] px-7 text-sm font-bold text-white"
            >
              {t("chooseWork")} <ArrowRight size={17} />
            </button>
            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="customer-hero-secondary inline-flex min-h-12 items-center justify-center gap-2 border px-7 text-sm font-bold text-[#222]"
            >
              <MessageCircle size={17} /> {t("whatsapp")}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[#686870]">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#16865a]" /> {t("easyBooking")}</span>
            <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-[#1769d2]" /> {t("buySellRepair")}</span>
          </div>
        </div>

        <div data-hero-visual className="relative mx-auto mt-8 w-full max-w-[1050px] sm:mt-10">
          <div className="customer-hero-visual relative overflow-hidden rounded-[22px] bg-[#e9edf3] sm:rounded-[30px]" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            <div className="relative aspect-[16/8.6] w-full sm:aspect-[16/7.4]">
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071323]/65 via-transparent to-white/5" />
              <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-left text-white sm:inset-x-7 sm:bottom-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/80">MR MOBILE WALA REPAIRS</p>
                  <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-2xl">{t("brandTagline")}</p>
                </div>
                <span className="rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[9px] font-bold backdrop-blur-xl">REWA, MP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
