
"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export default function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    const nextSection = heroRef.current?.nextElementSibling;

    nextSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="w-full overflow-hidden bg-white px-4 pb-12 pt-36 sm:px-8 sm:pb-16 sm:pt-12 lg:px-12 lg:pb-20 lg:pt-14"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Brand Introduction */}
        <div className="mx-auto text-center">

          <p className="mb-6 text-[9px] font-bold uppercase tracking-[0.35em] text-[#A58A5B] sm:mb-8 sm:text-xs">
            Your Trusted Mobile Destination
          </p>

          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.12] tracking-[-0.06em] text-[#202B32]"
          >
            Welcome in the World of
            <br className="sm:hidden" />{" "}
            <span className="font-serif font-normal italic text-[#A58A5B]">
              Mr Mobile Wala
            </span>
          </h1>

          {/* Brand Video */}
          <div className="mx-auto mt-9 aspect-[16/9] w-full max-w-[1150px] overflow-hidden rounded-xl bg-[#F5F4F1] shadow-[0_12px_40px_rgba(32,43,50,0.08)] sm:mt-12 sm:aspect-[16/7] sm:rounded-2xl lg:aspect-[16/6]">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="MR MOBILE WALA brand video"
              className="h-full w-full object-cover object-center"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Tagline */}
          <h2 className="mt-8 text-[clamp(1.7rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.055em] text-[#202B32] sm:mt-10">
            Your Phone.{" "}
            <span className="font-serif font-normal italic text-[#A58A5B]">
              Our Passion.
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#777D80] sm:text-base">
            Everything your phone needs, from buying and selling
            to expert repairs. All in one place.
          </p>

          {/* Services */}
          <div className="mt-7 flex items-center justify-center gap-4 text-[10px] font-bold tracking-[0.22em] text-[#26343C] sm:mt-9 sm:gap-5 sm:text-xs">
            <span>BUY</span>
            <span className="text-[#B69A69]">•</span>
            <span>SELL</span>
            <span className="text-[#B69A69]">•</span>
            <span>REPAIR</span>
          </div>

          {/* Scroll Button */}
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="Scroll to next section"
            className="group mx-auto mt-9 flex flex-col items-center gap-3 sm:mt-12"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#777D80] transition-colors group-hover:text-[#A58A5B]">
              Discover More
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9E5DC] text-[#A58A5B] transition-all duration-300 group-hover:translate-y-1 group-hover:border-[#A58A5B] group-hover:bg-[#A58A5B] group-hover:text-white">
              <ArrowDown size={17} strokeWidth={1.7} />
            </span>
          </button>

        </div>
      </div>
    </section>
  );
}
