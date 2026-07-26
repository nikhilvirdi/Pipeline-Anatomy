import { useCallback, useRef } from 'react';

import { getNeighbourIds } from '../utils/graphTraversal';

// Flow coordinates grow downward, so ArrowDown is +y.
const DIRECTIONS = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
};

// cos(~75°) — a candidate more than this far off-axis isn't "in that direction".
const MIN_ALIGNMENT = 0.25;

function centreOf(node) {
  const width = node.measured?.width ?? node.width ?? 0;
  const height = node.measured?.height ?? node.height ?? 0;
  return { x: node.position.x + width / 2, y: node.position.y + height / 2 };
}

/**
 * Arrow-key / Tab navigation across connected nodes (UI_SPEC.md "Keyboard nav").
 *
 * Arrows walk to the connected node lying in that direction, using live node
 * positions so navigation still makes sense after nodes have been dragged.
 * Tab cycles the connections of an anchor node, so repeated presses walk around
 * one node's neighbours instead of ping-ponging between two nodes.
 *
 * React Flow's own arrow-key handling moves the selected node; the caller
 * disables it via `disableKeyboardA11y` so these keys navigate instead.
 */
export function useKeyboardNav({
  activeNodeId,
  isVisible,
  getNodes,
  onNavigate,
  onActivate,
  onClear,
}) {
  const anchorRef = useRef({ id: null, index: -1 });
  const lastTabTargetRef = useRef(null);

  const visibleCentres = useCallback(() => {
    const centres = new Map();
    for (const node of getNodes()) {
      if (node.hidden || !isVisible(node.id)) continue;
      centres.set(node.id, centreOf(node));
    }
    return centres;
  }, [getNodes, isVisible]);

  // Entry point when nothing is selected yet: the leftmost node, i.e. the start
  // of a left-to-right pipeline.
  const firstNode = useCallback(() => {
    let best = null;
    for (const [id, centre] of visibleCentres()) {
      if (!best || centre.x < best.x) best = { id, x: centre.x };
    }
    return best?.id ?? null;
  }, [visibleCentres]);

  const neighboursInAngularOrder = useCallback(
    (nodeId, centres) => {
      const from = centres.get(nodeId);
      if (!from) return [];

      return getNeighbourIds(nodeId, isVisible)
        .filter((id) => centres.has(id))
        .sort((a, b) => {
          const ca = centres.get(a);
          const cb = centres.get(b);
          return (
            Math.atan2(ca.y - from.y, ca.x - from.x) -
            Math.atan2(cb.y - from.y, cb.x - from.x)
          );
        });
    },
    [isVisible]
  );

  const stepDirection = useCallback(
    (nodeId, direction, centres) => {
      const from = centres.get(nodeId);
      if (!from) return null;

      let best = null;
      for (const id of getNeighbourIds(nodeId, isVisible)) {
        const to = centres.get(id);
        if (!to) continue;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy) || 1;
        const alignment = (dx * direction[0] + dy * direction[1]) / distance;
        if (alignment < MIN_ALIGNMENT) continue;

        // Alignment first, distance only as a tie-breaker between similarly
        // aligned candidates.
        const score = alignment - distance / 20000;
        if (!best || score > best.score) best = { id, score };
      }

      return best?.id ?? null;
    },
    [isVisible]
  );

  return useCallback(
    (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const current = activeNodeId && isVisible(activeNodeId) ? activeNodeId : null;

      if (event.key === 'Escape') {
        if (!current) return;
        event.preventDefault();
        anchorRef.current = { id: null, index: -1 };
        onClear();
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (!current) return;
        event.preventDefault();
        onActivate(current);
        return;
      }

      if (event.key === 'Tab') {
        // Nothing selected: let Tab leave the canvas rather than trapping focus.
        if (!current) return;

        const centres = visibleCentres();
        const anchor = anchorRef.current;
        // The anchor is stale if focus moved by any means other than Tab.
        const anchorId =
          anchor.id && lastTabTargetRef.current === current && isVisible(anchor.id)
            ? anchor.id
            : current;
        if (anchorId !== anchor.id) anchorRef.current = { id: anchorId, index: -1 };

        const neighbours = neighboursInAngularOrder(anchorId, centres);
        if (neighbours.length === 0) return;

        event.preventDefault();
        const { index } = anchorRef.current;
        const next = event.shiftKey
          ? (index - 1 + neighbours.length) % neighbours.length
          : (index + 1) % neighbours.length;

        anchorRef.current = { id: anchorId, index: next };
        lastTabTargetRef.current = neighbours[next];
        onNavigate(neighbours[next]);
        return;
      }

      const direction = DIRECTIONS[event.key];
      if (!direction) return;

      event.preventDefault();

      if (!current) {
        const start = firstNode();
        if (!start) return;
        anchorRef.current = { id: start, index: -1 };
        lastTabTargetRef.current = null;
        onNavigate(start);
        return;
      }

      const next = stepDirection(current, direction, visibleCentres());
      if (!next) return;

      anchorRef.current = { id: next, index: -1 };
      lastTabTargetRef.current = null;
      onNavigate(next);
    },
    [
      activeNodeId,
      firstNode,
      isVisible,
      neighboursInAngularOrder,
      onActivate,
      onClear,
      onNavigate,
      stepDirection,
      visibleCentres,
    ]
  );
}
