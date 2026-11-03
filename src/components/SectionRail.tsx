"use client";

import { useEffect, useState } from "react";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";

const SECTIONS = [
  { id: "top", key: "home" },
  { id: "services", key: "services" },
  { id: "booking", key: "book" },
  { id: "reviews", key: "testimonialsTitle" },
  { id: "faq", key: "faqTitle" },
] as const;

export default function SectionRail() {
  const { t } = useCustomerLanguage();
  const [active, setActive] = useState("top");

  useEffect(() => {
    const nodes = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node)
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-32% 0px -48% 0px", threshold: [0, 0.15, 0.35, 0.6] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t("services")}
      className="fixed right-1 top-1/2 z-[80] flex -translate-y-1/2 flex-col gap-1 rounded-full border border-black/5 bg-white/90 p-1 shadow-lg shadow-black/10 backdrop-blur-xl sm:right-3 sm:gap-2 sm:p-1.5"
    >
      {SECTIONS.map(({ id, key }) => {
        const label = t(key);
        const selected = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={selected ? "location" : undefined}
            title={label}
            className={
              "group flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 sm:h-8 sm:w-8 " +
              (selected
                ? "bg-[#1d1d1f] text-white"
                : "text-[#777] hover:bg-[#f0f0f2] hover:text-[#1d1d1f]")
            }
          >
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={
                "block rounded-full transition-all " +
                (selected ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-current")
              }
            />
          </a>
        );
      })}
    </nav>
  );
}
