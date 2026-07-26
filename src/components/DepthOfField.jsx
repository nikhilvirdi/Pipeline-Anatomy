import { useEffect } from 'react';
import { useStoreApi } from '@xyflow/react';

/**
 * Depth-of-field on zoom (UI_SPEC.md "Zoom transition"): as the user zooms in,
 * nodes away from the focal area progressively blur and fade, drawing attention
 * to the region being explored. Strength is tied to the zoom level, not to a
 * timer, so it tracks a pinch or a wheel continuously instead of snapping.
 *
 * Written imperatively against the DOM rather than through node state: the
 * viewport changes every frame while zooming, and pushing that through React
 * would rebuild all 46 nodes per frame. Values land on the React Flow node
 * wrapper, so the wrapper's opacity multiplies with the highlight system's
 * opacity on the inner card instead of fighting it.
 */

// Below ZOOM_START the whole diagram is meant to be readable at once, so the
// effect stays off; by ZOOM_FULL it is at full strength.
const ZOOM_START = 0.9;
const ZOOM_FULL = 1.8;

// THEME_TOKENS.md: "opacity 0.3–1, blur 0–4px".
const MAX_BLUR = 4;
const MIN_OPACITY = 0.3;

// Nodes within the focal radius stay sharp; the effect ramps in over another
// radius beyond it.
const FOCAL_RATIO = 0.5;
const FALLOFF_SPAN = 1;

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

export default function DepthOfField({ enabled = true, containerRef }) {
  const store = useStoreApi();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const clear = () => {
      container.classList.remove('rf-dof-active');
      container.querySelectorAll('.react-flow__node').forEach((element) => {
        element.style.removeProperty('--dof-blur');
        element.style.removeProperty('--dof-opacity');
      });
    };

    if (!enabled) {
      clear();
      return undefined;
    }

    let frame = 0;
    let wasActive = false;

    const apply = () => {
      frame = 0;

      const { transform, nodeLookup, width, height } = store.getState();
      const [translateX, translateY, zoom] = transform;

      const strength = clamp01((zoom - ZOOM_START) / (ZOOM_FULL - ZOOM_START));

      if (strength === 0) {
        if (wasActive) {
          clear();
          wasActive = false;
        }
        return;
      }

      wasActive = true;
      container.classList.add('rf-dof-active');

      // Viewport centre and focal radius, both in flow coordinates.
      const centreX = (width / 2 - translateX) / zoom;
      const centreY = (height / 2 - translateY) / zoom;
      const focalRadius = (Math.min(width, height) / zoom) * FOCAL_RATIO;

      // Past this the node is well off-screen. It is already at full blur, so
      // dropping the filter there costs nothing visually and saves compositing
      // a blur layer for every node outside the viewport — at high zoom on this
      // diagram that is most of the 46.
      const blurCutoff = (Math.hypot(width, height) / zoom) * 0.75;

      container.querySelectorAll('.react-flow__node').forEach((element) => {
        const node = nodeLookup.get(element.getAttribute('data-id'));
        if (!node) return;

        const nodeWidth = node.measured?.width ?? 0;
        const nodeHeight = node.measured?.height ?? 0;
        const distance = Math.hypot(
          node.position.x + nodeWidth / 2 - centreX,
          node.position.y + nodeHeight / 2 - centreY
        );

        const falloff = clamp01((distance / focalRadius - 1) / FALLOFF_SPAN);
        const amount = strength * falloff;

        if (distance > blurCutoff) {
          element.style.removeProperty('--dof-blur');
        } else {
          element.style.setProperty('--dof-blur', `${(amount * MAX_BLUR).toFixed(2)}px`);
        }

        element.style.setProperty(
          '--dof-opacity',
          (1 - amount * (1 - MIN_OPACITY)).toFixed(3)
        );
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    // Run once synchronously so the first paint is already correct, then follow
    // the store — which covers panning and dragging as well as zooming.
    apply();
    const unsubscribe = store.subscribe(schedule);

    return () => {
      unsubscribe();
      if (frame) window.cancelAnimationFrame(frame);
      clear();
    };
  }, [containerRef, enabled, store]);

  return null;
}
