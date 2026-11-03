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
      if (window.matchMedia("(pointer: fine)").matches) {
        const tiltCards = root.querySelectorAll<HTMLElement>(
          "#services a, #why article, #reviews article"
        );
        tiltCards.forEach((card) => {
          const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.65, ease: "power3.out" });
          const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.65, ease: "power3.out" });
          const onMove = (event: PointerEvent) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            rotateX(y * -2.2);
            rotateY(x * 2.8);
          };
          const reset = () => { rotateX(0); rotateY(0); };
          card.style.transformStyle = "preserve-3d";
          card.style.willChange = "transform";
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", reset);
          context.add(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", reset);
            card.style.willChange = "";
          });
        });
      }

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
