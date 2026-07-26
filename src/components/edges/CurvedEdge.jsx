import React from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

import { useEdgeHighlight } from '../../context/DiagramInteractionContext';

const ACCENT = '#22c55e';
const LOOPBACK = '#f87171';
const ACCENT_GLOW = 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.55))';

export default function CurvedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}) {
  const isLoopback = data?.isLoopback;
  const isBidirectional = data?.isBidirectional;
  const isLight = data?.theme === 'light';
  const highlight = useEdgeHighlight(id);

  const isLongLoopback = isLoopback && sourceX - targetX > 300;

  let edgePath = '';
  let labelX = (sourceX + targetX) / 2;
  let labelY = (sourceY + targetY) / 2;

  if (isLongLoopback) {
    const marginY = 820;
    const r = 20;
    edgePath =
      `M ${sourceX} ${sourceY} ` +
      `V ${marginY - r} ` +
      `Q ${sourceX} ${marginY} ${sourceX - r} ${marginY} ` +
      `H ${targetX + r} ` +
      `Q ${targetX} ${marginY} ${targetX} ${marginY - r} ` +
      `V ${targetY}`;
    labelX = (sourceX + targetX) / 2;
    labelY = marginY;
  } else {
    const [bezierPath, bX, bY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    edgePath = bezierPath;
    labelX = bX;
    labelY = bY;
  }

  const defaultEdgeColor = isLight ? '#9ca3af' : '#6b7280';
  const labelBg = isLight
    ? 'bg-white/90 border-slate-300 text-amber-900 shadow-sm'
    : 'bg-slate-900/90 border-slate-700 text-amber-300 shadow-md';

  // Base style first, then the highlight overlay. Loop-back edges keep their
  // red dash in every state: THEME_TOKENS.md reserves accent green for
  // active/success, so a highlighted failure path must not turn green.
  const style = isLoopback
    ? { stroke: LOOPBACK, strokeWidth: 2, strokeDasharray: '6 4' }
    : { stroke: defaultEdgeColor, strokeWidth: 2 };

  style.transition = 'opacity 300ms ease-out, stroke 200ms ease-out';

  // Select arrowhead marker ID matching the edge state
  let markerId = isLight ? 'pa-arrow-light' : 'pa-arrow-dark';
  if (isLoopback) {
    markerId = 'pa-arrow-loopback';
  } else if (
    highlight === 'downstream' ||
    highlight === 'direct' ||
    highlight === 'upstream'
  ) {
    markerId = 'pa-arrow-accent';
  }

  switch (highlight) {
    case 'dimmed':
      style.opacity = 0.12;
      break;
    case 'downstream':
    case 'direct':
      if (!isLoopback) style.stroke = ACCENT;
      style.strokeWidth = 2.5;
      style.filter = ACCENT_GLOW;
      break;
    case 'upstream':
      if (!isLoopback) style.stroke = ACCENT;
      style.strokeWidth = 2.5;
      style.opacity = 0.55;
      break;
    default:
      break;
  }

  const markerEndUrl = `url(#${markerId})`;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        markerEnd={markerEndUrl}
        markerStart={isBidirectional ? markerEndUrl : undefined}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: highlight === 'dimmed' ? 'none' : 'all',
              opacity: highlight === 'dimmed' ? 0.15 : 1,
              transition: 'opacity 300ms ease-out',
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border z-10 ${labelBg}`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
