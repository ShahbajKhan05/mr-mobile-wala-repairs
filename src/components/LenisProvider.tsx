"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      lerp: 0.1,
      wheelMultiplier: 0.9,
    });

    return () => lenis.destroy();
  }, []);

  return children;
}
