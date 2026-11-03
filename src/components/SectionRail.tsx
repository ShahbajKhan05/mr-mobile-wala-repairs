"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "booking", label: "Book" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "Help" },
];

export default function SectionRail() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const nodes = SECTIONS
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

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
      aria-label="Page sections"
      className="fixed right-1.5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-2 rounded-full border border-black/5 bg-white/85 p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl sm:flex sm:right-3"
    >
      {SECTIONS.map(({ id, label }) => {
        const selected = active === id;

        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`Go to ${label}`}
            aria-current={selected ? "location" : undefined}
            title={label}
            className={
              "group flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 " +
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
