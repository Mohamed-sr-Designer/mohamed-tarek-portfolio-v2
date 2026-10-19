"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Duration is how long Lenis takes to catch up to where the wheel already
    // put you. At 1.15s that lag was long enough to read as the page being
    // slow rather than smooth — one notch of the wheel kept coasting after the
    // hand had stopped. 0.75s still glides but tracks the input.
    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      // Touch is left to the OS. Phones already scroll at 120Hz with real
      // momentum, and rewriting that in JS is what makes a site feel heavy.
      syncTouch: false,
    });
    lenisRef.current = lenis;
    // dev only: lets the browser QA jump straight to a section
    if (process.env.NODE_ENV !== "production") (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Anchor links route through Lenis for smooth in-page scrolling.
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -10 });
      }
    };
    document.addEventListener("click", onClick);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Land every route change at the top.
  //
  // The App Router resets window.scrollTop on navigation, but Lenis holds its
  // own animated position and writes it straight back on the next frame — so
  // opening a project from the "Continue" slider dropped you at the same offset
  // partway down the new page instead of at its start.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
