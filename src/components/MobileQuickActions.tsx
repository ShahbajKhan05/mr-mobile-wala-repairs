"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";

export default function MobileQuickActions() {
  const { t } = useCustomerLanguage();
  const [isBookingVisible, setIsBookingVisible] = useState(false);

  useEffect(() => {
    const booking = document.querySelector("#booking");
    if (!booking) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsBookingVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(booking);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-label={t("getInTouch")}
      className={
        "fixed inset-x-3 bottom-3 z-[90] flex items-center gap-2 rounded-full border border-[#e5e5ea] bg-white/95 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 sm:hidden " +
        (isBookingVisible
          ? "pointer-events-none translate-y-5 opacity-0"
          : "translate-y-0 opacity-100")
      }
      aria-hidden={isBookingVisible}
    >
      <a
        href="https://wa.me/919131383323"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isBookingVisible ? -1 : 0}
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-3 text-xs font-semibold text-white transition active:scale-[.98]"
      >
        <MessageCircle size={16} /> {t("whatsapp")}
      </a>
      <Link
        href="/#booking"
        tabIndex={isBookingVisible ? -1 : 0}
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#0071e3] px-3 text-xs font-semibold text-white transition active:scale-[.98]"
      >
        {t("book")} <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
