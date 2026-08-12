import React from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

import { useEdgeHighlight } from '../../context/DiagramInteractionContext';

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
  const highlight = useEdgeHighlight(id);

  const isLongLoopback = isLoopback && sourceX - targetX > 300;

  let edgePath = '';
  let labelX = (sourceX + targetX) / 2;
  let labelY = (sourceY + targetY) / 2;

  if (isLongLoopback) {
    let marginY = 820;
    if (id.includes('rollback')) {
      marginY = 760;
    } else if (id.includes('developer-fixes-cd')) {
      marginY = 810;
    } else if (id.includes('developer-fixes-ci')) {
      marginY = 860;
    }

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

  // Base style
  const style = isLoopback
    ? { stroke: 'var(--accent-error)', strokeWidth: 1.5, strokeDasharray: '6 4' }
    : { stroke: 'var(--connector-line)', strokeWidth: 1.5 };

  style.transition = 'opacity 300ms ease-out, stroke 200ms ease-out';

  // Highlight state overrides
  switch (highlight) {
    case 'dimmed':
      style.opacity = 0.12;
      break;
    case 'downstream':
    case 'direct':
      if (!isLoopback) style.stroke = 'var(--connector-active)';
      break;
    case 'upstream':
      if (!isLoopback) style.stroke = 'var(--connector-active)';
      style.opacity = 0.55;
      break;
    default:
      break;
  }

  // Determine Label Text Color
  let labelColorClass = 'text-primary';
  if (label) {
    const upperLabel = label.toUpperCase();
    if (['YES', 'PASS', 'APPROVED'].includes(upperLabel)) {
      labelColorClass = 'text-accent-success';
    } else if (['NO', 'REJECTED'].includes(upperLabel)) {
      labelColorClass = 'text-accent-error';
    }
  }

  // Select arrowhead marker ID matching the edge state
  let markerId = 'pa-arrow-default';
  if (isLoopback) {
    markerId = 'pa-arrow-loopback';
  } else if (
    highlight === 'downstream' ||
    highlight === 'direct' ||
    highlight === 'upstream'
  ) {
    markerId = 'pa-arrow-accent';
  }

  const markerEndUrl = `url(#${markerId})`;

  const isHorizontal = sourcePosition === 'left' || sourcePosition === 'right';
  const labelOffsetX = isHorizontal ? 0 : 12;
  const labelOffsetY = isHorizontal ? -12 : 0;

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
              transform: `translate(-50%, -50%) translate(${labelX + labelOffsetX}px,${labelY + labelOffsetY}px)`,
              pointerEvents: highlight === 'dimmed' ? 'none' : 'all',
              opacity: highlight === 'dimmed' ? 0.15 : 1,
              transition: 'opacity 300ms ease-out',
            }}
            className={`edge-label ${labelColorClass}`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
