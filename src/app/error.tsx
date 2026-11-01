
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-5 py-16">
      <div className="w-full max-w-lg rounded-[32px] border border-white bg-white/80 p-8 text-center shadow-[0_20px_70px_rgba(32,43,50,0.08)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#F7F1E7] text-[#B08D57]">
          <AlertTriangle size={36} strokeWidth={1.5} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-[#B08D57]">
          MR MOBILE WALA
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#202B32]">
          Something went wrong
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#777E81]">
          Sorry! Something unexpected happened while loading this page.
          Please try again.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#202B32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35434A] active:scale-[0.98]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E0D7] bg-white px-7 py-3.5 text-sm font-semibold text-[#202B32] transition hover:bg-[#F7F5F0]"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#A0A3A2]">
          We appreciate your patience.
        </p>
      </div>
    </main>
  );
}
