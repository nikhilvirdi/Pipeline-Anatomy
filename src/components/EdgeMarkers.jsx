import React from 'react';

/**
 * Arrowhead definitions for every edge (EDGE_RULES.md "Arrowheads").
 */

const MARKERS = [
  { id: 'pa-arrow-default', color: 'var(--connector-line)' },
  { id: 'pa-arrow-accent', color: 'var(--connector-active)' },
  { id: 'pa-arrow-loopback', color: 'var(--accent-warning)' },
  { id: 'pa-arrow-error', color: 'var(--accent-error)' },
  { id: 'pa-arrow-success', color: 'var(--accent-success)' },
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
            refX="7"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

