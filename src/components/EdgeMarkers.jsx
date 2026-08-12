import React from 'react';

/**
 * Arrowhead definitions for every edge (EDGE_RULES.md "Arrowheads").
 */

const MARKERS = [
  { id: 'pa-arrow-default', color: 'var(--connector-line)' },
  { id: 'pa-arrow-accent', color: 'var(--connector-active)' },
  { id: 'pa-arrow-loopback', color: 'var(--accent-error)' },
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
