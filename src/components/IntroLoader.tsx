
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function IntroLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = "mr-mobile-wala-intro-seen";

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "true");
    } catch {
      // Continue showing intro if session storage is unavailable.
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-white animate-[loaderExit_0.6s_ease-in-out_2.4s_forwards]">

      <div className="relative flex flex-col items-center">

        {/* Logo reveal */}
        <div className="relative animate-[logoReveal_1s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Image
            src="/mr-mobile-wala-logo.png"
            alt="MR MOBILE WALA REPAIRS"
            width={420}
            height={180}
            priority
            className="h-auto w-[240px] object-contain sm:w-[300px]"
          />

          {/* Subtle golden light sweep */}
          <div className="pointer-events-none absolute inset-y-0 left-[-50%] w-1/3 skew-x-[-20deg] animate-[lightSweep_1s_ease-in-out_0.5s_forwards] bg-gradient-to-r from-transparent via-[#C5A675]/25 to-transparent opacity-0 blur-sm" />
        </div>

        {/* Brand */}
        <div className="mt-7 text-center animate-[textReveal_0.8s_ease-out_0.5s_both]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#202B32] sm:text-xs">
            MR MOBILE WALA REPAIRS
          </p>

          <div className="mx-auto mt-4 h-px w-10 bg-[#B69A69]" />

          <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.32em] text-[#A58A5B]">
            BUY . SELL . REPAIR
          </p>
        </div>

        {/* Minimal loading indicator */}
        <div className="mt-10 h-[2px] w-28 overflow-hidden rounded-full bg-[#F0EDE7]">
          <div className="h-full w-1/2 animate-[progress_1.2s_ease-in-out_infinite] rounded-full bg-[#B69A69]" />
        </div>

      </div>

      <p className="absolute bottom-9 text-[8px] font-medium uppercase tracking-[0.3em] text-[#A5A5A0] animate-[textReveal_0.8s_ease-out_1s_both]">
        A better mobile experience
      </p>

      <style>
        {`
          @keyframes logoReveal {
            0% {
              opacity: 0;
              transform: translateY(18px) scale(.94);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes textReveal {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes lightSweep {
            0% { left: -50%; opacity: 0; }
            25% { opacity: 1; }
            100% { left: 120%; opacity: 0; }
          }

          @keyframes progress {
            0% { transform: translateX(-110%); }
            100% { transform: translateX(220%); }
          }

          @keyframes loaderExit {
            to {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .fixed {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
