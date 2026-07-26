import React from 'react';

/**
 * Arrowhead definitions for every edge (EDGE_RULES.md "Arrowheads").
 *
 * Defined once here rather than via React Flow's per-edge `markerEnd` object,
 * because the arrow has to recolour with the edge: highlighted paths turn
 * accent green, and loop-backs must stay `loopback.DEFAULT` red in every state
 * so "retrying" never reads as "active". `CurvedEdge` picks the id per state.
 * Marker ids resolve document-wide, so this can live outside the flow's SVG.
 */

const MARKERS = [
  { id: 'pa-arrow-dark', color: '#e2e8f0' },
  { id: 'pa-arrow-light', color: '#334155' },
  { id: 'pa-arrow-accent', color: '#22c55e' },
  { id: 'pa-arrow-loopback', color: '#f87171' },
];

export default function EdgeMarkers() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {MARKERS.map(({ id, color }) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={color} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}
