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
      const sections = gsap.utils.toArray<HTMLElement>("main > section, footer");
      sections.forEach((section, index) => {
        if (index === 0) return;
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (root.contains(trigger.trigger as Node)) trigger.kill();
      });
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
