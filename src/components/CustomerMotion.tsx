"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CustomerMotionProps = { children: ReactNode };

export default function CustomerMotion({ children }: CustomerMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main section, footer");
      sections.forEach((section, index) => {
        if (index === 0) return;

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    const frame = window.requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.cancelAnimationFrame(frame);
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
