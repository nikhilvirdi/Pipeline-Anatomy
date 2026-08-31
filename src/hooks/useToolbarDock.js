import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Dock edges in clockwise order — the dock button cycles through them in this order.
export const DOCK_EDGES = ['left', 'top', 'right', 'bottom'];

const EDGE_MARGIN = 16;
// Movement (px) before a pointer-down turns into a drag instead of a button press.
const DRAG_THRESHOLD = 4;

export function isVerticalEdge(edge) {
  return edge === 'left' || edge === 'right';
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function nearestEdge(pos, size) {
  const centerX = pos.x + size.width / 2;
  const centerY = pos.y + size.height / 2;

  const distances = {
    left: centerX,
    top: centerY,
    right: window.innerWidth - centerX,
    bottom: window.innerHeight - centerY,
  };

  return DOCK_EDGES.reduce((closest, edge) =>
    distances[edge] < distances[closest] ? edge : closest
  );
}

/**
 * Owns the floating toolbar's docked edge and screen position.
 *
 * Position is always driven through left/top pixel values (never a mix of
 * left/right/transform) so a dock change animates as a single smooth move
 * between two coordinates, per the 200ms snap in THEME_TOKENS.md.
 */
export function useToolbarDock(initialEdge = 'left') {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  const [edge, setEdge] = useState(initialEdge);
  const [position, setPosition] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [snapTick, setSnapTick] = useState(0);

  const positionRef = useRef(null);
  const applyPosition = useCallback((next) => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return { width: 48, height: 48 };
    return { width: el.offsetWidth, height: el.offsetHeight };
  }, []);

  const dockedPosition = useCallback((targetEdge, size) => {
    const { innerWidth: vw, innerHeight: vh } = window;
    const centeredX = (vw - size.width) / 2;
    const centeredY = (vh - size.height) / 2;

    switch (targetEdge) {
      case 'top':
        return { x: centeredX, y: EDGE_MARGIN };
      case 'right':
        return { x: vw - size.width - EDGE_MARGIN, y: centeredY };
      case 'bottom':
        return { x: centeredX, y: vh - size.height - EDGE_MARGIN };
      case 'left':
      default:
        return { x: EDGE_MARGIN, y: centeredY };
    }
  }, []);

  useLayoutEffect(() => {
    if (dragging) return undefined;

    const snap = () => applyPosition(dockedPosition(edge, measure()));
    snap();

    window.addEventListener('resize', snap);
    return () => window.removeEventListener('resize', snap);
  }, [applyPosition, dockedPosition, dragging, edge, measure, snapTick]);

  const onPointerDown = useCallback(
    (event) => {
      if (event.button !== 0) return;

      const origin = positionRef.current ?? dockedPosition(edge, measure());
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: origin.x,
        originY: origin.y,
        moved: false,
        target: event.currentTarget,
      };

      event.stopPropagation();
    },
    [dockedPosition, edge, measure]
  );

  const onPointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (!drag.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        drag.moved = true;
        setDragging(true);

        try {
          drag.target.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture unavailable
        }
      }

      const size = measure();
      applyPosition({
        x: clamp(drag.originX + dx, 0, window.innerWidth - size.width),
        y: clamp(drag.originY + dy, 0, window.innerHeight - size.height),
      });
    },
    [applyPosition, measure]
  );

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;

    if (!drag.moved) return;

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);

    const dropped = positionRef.current;
    if (dropped) setEdge(nearestEdge(dropped, measure()));
    setDragging(false);
    setSnapTick((tick) => tick + 1);
  }, [measure]);

  const onPointerUp = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (drag && event.pointerId !== drag.pointerId) return;
      endDrag();
    },
    [endDrag]
  );

  const onClickCapture = useCallback((event) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const cycleEdge = useCallback(() => {
    setEdge((prev) => {
      const next = (DOCK_EDGES.indexOf(prev) + 1) % DOCK_EDGES.length;
      return DOCK_EDGES[next];
    });
  }, []);

  return {
    ref,
    edge,
    position,
    dragging,
    vertical: isVerticalEdge(edge),
    cycleEdge,
    dockTo: setEdge,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onLostPointerCapture: endDrag,
      onClickCapture,
    },
  };
}
