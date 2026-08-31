import React from 'react';
import { useViewport } from '@xyflow/react';

// X-coordinates for the 3 phase transition boundaries in clear gap space
const DIVIDER_X_POSITIONS = [2190, 4110, 5900];

export default function PhaseDividers({ theme }) {
  const { x, y, zoom } = useViewport();

  const isLight = theme === 'light';
  const strokeColor = isLight ? '#8c8c8c' : '#787878';

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
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={isLight ? 0.65 : 0.8}
          />
        ))}
      </g>
    </svg>
  );
}
