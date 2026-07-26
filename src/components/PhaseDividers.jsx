import React from 'react';
import { useViewport } from '@xyflow/react';

// X-coordinates for the 3 phase transition boundaries in clear gap space
const DIVIDER_X_POSITIONS = [2470, 5080, 7550];

export default function PhaseDividers({ theme, orientation }) {
  const { x, y, zoom } = useViewport();

  if (orientation === 'vertical') return null;

  const strokeColor =
    theme === 'light' ? 'rgba(0, 0, 0, 0.20)' : 'rgba(255, 255, 255, 0.20)';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {DIVIDER_X_POSITIONS.map((xPos, idx) => (
          <line
            key={idx}
            x1={xPos}
            y1={-120}
            x2={xPos}
            y2={920}
            stroke={strokeColor}
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
        ))}
      </g>
    </svg>
  );
}
