
import Image from "next/image";

export default function Loading() {
  return (
    <main className="premium-loader fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#FFFFFF] px-5">
      {/* Subtle background details */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[min(80%,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D9C7A5]/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(80%,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D9C7A5]/50 to-transparent" />
        <div className="absolute left-8 top-8 h-2 w-2 rounded-full border border-[#C5A675]/40 sm:left-12 sm:top-12" />
        <div className="absolute bottom-8 right-8 h-2 w-2 rounded-full border border-[#C5A675]/40 sm:bottom-12 sm:right-12" />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center">
        {/* Brand emblem */}
        <div className="emblem relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
          {/* Outer rotating ring */}
          <div className="orbit-ring absolute inset-0 rounded-full border border-[#C5A675]/35" />

          {/* Inner dashed ring */}
          <div className="orbit-dashed absolute inset-[11px] rounded-full border border-dashed border-[#C5A675]/45" />

          {/* Orbit dots */}
          <span className="orbit-dot absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#A58A5B]" />
          <span className="orbit-dot-reverse absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#D5C09A]" />

          {/* Logo container */}
          <div className="logo-chamber relative flex h-[108px] w-[108px] items-center justify-center rounded-full border border-[#EEE8DC] bg-white shadow-[0_12px_45px_rgba(32,43,50,0.07)] sm:h-[124px] sm:w-[124px]">
            <div className="absolute inset-[5px] rounded-full border border-[#F1EDE5]" />

            <Image
              src="/mr-mobile-wala-logo.png"
              alt="MR MOBILE WALA REPAIRS"
              width={180}
              height={80}
              priority
              className="relative h-auto w-[82%] object-contain"
            />
          </div>

          {/* Small gold sparkle */}
          <span className="sparkle absolute right-4 top-7 h-2 w-2 rounded-full bg-[#B69A69] sm:right-5 sm:top-9" />
        </div>

        {/* Brand title */}
        <div className="mt-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#202B32] sm:text-xs">
            MR MOBILE WALA REPAIRS
          </p>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D9C7A5]" />
            <span className="h-1 w-1 rounded-full bg-[#A58A5B]" />
            <span className="h-px w-8 bg-[#D9C7A5]" />
          </div>

          <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.3em] text-[#A58A5B] sm:text-[10px]">
            Your Trusted Mobile Destination
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-12 w-full max-w-[210px]">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#EEEAE2]">
            <div className="progress-line absolute inset-y-0 left-0 w-[38%] rounded-full bg-[#A58A5B]" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#A0A09A]">
              Please wait
            </span>
            <span className="loading-dots text-[10px] tracking-[0.2em] text-[#A58A5B]">
              * * *
            </span>
          </div>
        </div>

        {/* Bottom brand signature */}
        <p className="mt-12 text-[9px] font-medium tracking-[0.3em] text-[#B4B0A7]">
          BUY <span className="px-2 text-[#C5A675]">.</span>
          SELL <span className="px-2 text-[#C5A675]">.</span>
          REPAIR
        </p>
      </div>

      <style>{`
        .orbit-ring {
          animation: orbit 9s linear infinite;
        }

        .orbit-dashed {
          animation: orbit 16s linear infinite reverse;
        }

        .orbit-dot {
          box-shadow: 0 0 12px rgba(165, 138, 91, 0.35);
        }

        .orbit-dot-reverse {
          box-shadow: 0 0 10px rgba(197, 166, 117, 0.3);
        }

        .logo-chamber {
          animation: chamber 2.8s ease-in-out infinite;
        }

        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .progress-line {
          animation: progress 1.7s cubic-bezier(.65, 0, .35, 1) infinite;
        }

        .loading-dots {
          animation: dots 1.2s ease-in-out infinite;
        }

        @keyframes orbit {
          to { transform: rotate(360deg); }
        }

        @keyframes chamber {
          0%, 100% {
            box-shadow: 0 12px 45px rgba(32,43,50,0.06);
          }
          50% {
            box-shadow: 0 14px 55px rgba(165,138,91,0.13);
          }
        }

        @keyframes sparkle {
          0%, 100% { opacity: .4; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes progress {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(370%); }
        }

        @keyframes dots {
          0%, 100% { opacity: .35; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-ring,
          .orbit-dashed,
          .logo-chamber,
          .sparkle,
          .progress-line,
          .loading-dots {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
