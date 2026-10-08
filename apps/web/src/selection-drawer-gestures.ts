import { useEffect, useRef, type RefObject } from "react";

/** Browser gestures only: no data fetching or changes to the Bible selection. */
export function useSelectionDrawerGestures(panel: RefObject<HTMLElement | null>, collapsed: boolean, setCollapsed: (value: boolean) => void, onSwipe: () => void) {
  const callbacks = useRef({ setCollapsed, onSwipe });
  callbacks.current = { setCollapsed, onSwipe };
  const gesture = useRef<{ id: number; x: number; y: number; at: number; inPanel: boolean; dragging: boolean; applied: boolean } | null>(null);
  const suppressClick = useRef(false);
  const suppressUntil = useRef(0);
  useEffect(() => {
    const down = (event: PointerEvent) => {
      suppressClick.current = false;
      if (event.button > 0 || event.isPrimary === false || !(event.target instanceof Element)) return;
      if (event.target.closest("input,textarea,select,option")) return;
      const inPanel = !!panel.current?.contains(event.target);
      if (!inPanel && (!collapsed || event.pointerType !== "touch" || !event.target.closest(".bible-page"))) return;
      gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now(), inPanel, dragging: false, applied: false };
    };
    const move = (event: PointerEvent) => {
      const current = gesture.current;
      if (!current || current.id !== event.pointerId) return;
      if (current.applied) { event.preventDefault(); event.stopPropagation(); return; }
      const x = event.clientX - current.x, y = event.clientY - current.y;
      if (!current.inPanel && (performance.now() - current.at >= 350 || x > 0)) { gesture.current = null; return; }
      if (Math.abs(y) > 12 && Math.abs(y) > Math.abs(x)) { gesture.current = null; return; }
      if (Math.abs(x) < 12 || Math.abs(x) < Math.abs(y) * 1.5) return;
      suppressClick.current = true; suppressUntil.current = performance.now() + 400;
      event.preventDefault(); event.stopPropagation();
      if (!current.dragging) { current.dragging = true; callbacks.current.onSwipe(); }
      if (Math.abs(x) < 40) return;
      current.applied = true;
      callbacks.current.setCollapsed(x > 0);
    };
    const end = (event: PointerEvent) => {
      if (gesture.current?.id !== event.pointerId) return;
      if (gesture.current.dragging) { suppressUntil.current = performance.now() + 400; event.preventDefault(); event.stopPropagation(); }
      gesture.current = null;
    };
    const click = (event: MouseEvent) => {
      if (!suppressClick.current) return;
      if (event.detail === 0 || performance.now() > suppressUntil.current) { suppressClick.current = false; return; }
      suppressClick.current = false; event.preventDefault(); event.stopPropagation();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointermove", move, { capture: true, passive: false });
    document.addEventListener("pointerup", end, true);
    document.addEventListener("pointercancel", end, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", end, true);
      document.removeEventListener("pointercancel", end, true);
      document.removeEventListener("click", click, true);
    };
  }, [panel, collapsed]);
}
