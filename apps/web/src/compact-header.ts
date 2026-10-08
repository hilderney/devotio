import { useLayoutEffect, useRef, useState, type RefObject } from "react";

/** Local presentation state; never reloads content while scrolling. */
export function useCompactHeader(header: RefObject<HTMLDivElement | null>) {
  const [compact, setCompact] = useState(false);
  const [height, setHeight] = useState(0);
  const current = useRef(false);
  useLayoutEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia("(min-width: 901px)");
    let frame = 0;
    let settling = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      if (!settling && !current.current && desktop.matches) {
        const measured = header.current?.getBoundingClientRect().height ?? 0;
        if (measured > 0) setHeight(measured);
      }
    };
    const update = () => {
      frame = 0;
      measure();
      const next = desktop.matches && (current.current ? window.scrollY > 16 : window.scrollY > 64);
      if (next !== current.current) {
        settling = true; clearTimeout(settleTimer);
        current.current = next; setCompact(next);
        settleTimer = setTimeout(() => { settling = false; measure(); }, 200);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    if (header.current) observer?.observe(header.current);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(settleTimer); observer?.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); desktop.removeEventListener("change", schedule);
    };
  }, [header]);
  return { compact, height };
}
