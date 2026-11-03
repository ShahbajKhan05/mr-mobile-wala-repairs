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
      const sections = gsap.utils.toArray<HTMLElement>("main section, .customer-secondary-section > section, .customer-testimonials, footer");
      sections.forEach((section, index) => {
        if (index === 0) return;

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: "power4.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );

        const cards = section.querySelectorAll<HTMLElement>(
          "#services a, #why article, #reviews article, .customer-testimonials [data-motion-card]"
        );
        if (cards.length > 1) {
          gsap.fromTo(
            cards,
            { y: 16, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.075,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            }
          );
        }
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
