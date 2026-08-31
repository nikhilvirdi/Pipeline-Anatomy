import React from 'react';
import { getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

import { useEdgeHighlight } from '../../context/DiagramInteractionContext';

function getOrthogonalPath(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition) {
  // Pure straight lines when aligned on axis (within 4px subpixel/text-wrapping variance)
  if (sourcePosition === 'bottom' && targetPosition === 'top' && Math.abs(sourceX - targetX) < 4) {
    return { path: `M ${sourceX} ${sourceY} V ${targetY}`, labelX: sourceX, labelY: (sourceY + targetY) / 2 };
  }
  if (sourcePosition === 'top' && targetPosition === 'bottom' && Math.abs(sourceX - targetX) < 4) {
    return { path: `M ${sourceX} ${sourceY} V ${targetY}`, labelX: sourceX, labelY: (sourceY + targetY) / 2 };
  }
  if (sourcePosition === 'right' && targetPosition === 'left' && Math.abs(sourceY - targetY) < 4) {
    return { path: `M ${sourceX} ${sourceY} H ${targetX}`, labelX: (sourceX + targetX) / 2, labelY: sourceY };
  }
  if (sourcePosition === 'left' && targetPosition === 'right' && Math.abs(sourceY - targetY) < 4) {
    return { path: `M ${sourceX} ${sourceY} H ${targetX}`, labelX: (sourceX + targetX) / 2, labelY: sourceY };
  }

  // Pure single 90-degree corners
  if (sourcePosition === 'right' && targetPosition === 'top') {
    return { path: `M ${sourceX} ${sourceY} H ${targetX} V ${targetY}`, labelX: (sourceX + targetX) / 2, labelY: sourceY - 12 };
  }
  if (sourcePosition === 'top' && targetPosition === 'left') {
    return { path: `M ${sourceX} ${sourceY} V ${targetY} H ${targetX}`, labelX: sourceX + 12, labelY: (sourceY + targetY) / 2 };
  }
  if (sourcePosition === 'bottom' && targetPosition === 'left') {
    return { path: `M ${sourceX} ${sourceY} V ${targetY} H ${targetX}`, labelX: (sourceX + targetX) / 2, labelY: targetY };
  }
  if (sourcePosition === 'bottom' && targetPosition === 'right') {
    return { path: `M ${sourceX} ${sourceY} V ${targetY} H ${targetX}`, labelX: (sourceX + targetX) / 2, labelY: targetY };
  }
  if (sourcePosition === 'top' && targetPosition === 'right') {
    return { path: `M ${sourceX} ${sourceY} V ${targetY} H ${targetX}`, labelX: (sourceX + targetX) / 2, labelY: targetY };
  }
  if (sourcePosition === 'left' && targetPosition === 'bottom') {
    return { path: `M ${sourceX} ${sourceY} H ${targetX} V ${targetY}`, labelX: (sourceX + targetX) / 2, labelY: sourceY };
  }
  if (sourcePosition === 'right' && targetPosition === 'bottom') {
    return { path: `M ${sourceX} ${sourceY} H ${targetX} V ${targetY}`, labelX: (sourceX + targetX) / 2, labelY: sourceY };
  }
  if (sourcePosition === 'left' && targetPosition === 'top') {
    return { path: `M ${sourceX} ${sourceY} H ${targetX} V ${targetY}`, labelX: (sourceX + targetX) / 2, labelY: sourceY };
  }

  // Clean mid-point step for same-axis offsets
  if ((sourcePosition === 'right' && targetPosition === 'left') || (sourcePosition === 'left' && targetPosition === 'right')) {
    const midX = (sourceX + targetX) / 2;
    return { path: `M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`, labelX: midX, labelY: (sourceY + targetY) / 2 };
  }
  if ((sourcePosition === 'bottom' && targetPosition === 'top') || (sourcePosition === 'top' && targetPosition === 'bottom')) {
    const midY = (sourceY + targetY) / 2;
    return { path: `M ${sourceX} ${sourceY} V ${midY} H ${targetX} V ${targetY}`, labelX: (sourceX + targetX) / 2, labelY: midY };
  }

  // Fallback to React Flow smoothstep with offset: 0, borderRadius: 0
  const [stepPath, sX, sY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
    offset: 0,
  });
  return { path: stepPath, labelX: sX, labelY: sY };
}

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

  let edgePath = '';
  let labelX = (sourceX + targetX) / 2;
  let labelY = (sourceY + targetY) / 2;

  const hasWaypoints = data?.waypoints && Array.isArray(data.waypoints) && data.waypoints.length > 0;

  if (hasWaypoints) {
    let path = `M ${sourceX} ${sourceY}`;
    for (const pt of data.waypoints) {
      path += ` L ${pt.x} ${pt.y}`;
    }
    path += ` L ${targetX} ${targetY}`;
    edgePath = path;

    const midPoint = data.waypoints[Math.floor(data.waypoints.length / 2)];
    labelX = midPoint ? midPoint.x : (sourceX + targetX) / 2;
    labelY = midPoint ? midPoint.y - 12 : (sourceY + targetY) / 2;
  } else if (isLoopback) {
    if (id.includes('developer-fixes-ci') && id.includes('commit-push-code')) {
      const marginY = -140;
      edgePath = `M ${sourceX} ${sourceY} V ${marginY} H ${targetX} V ${targetY}`;
      labelX = (sourceX + targetX) / 2;
      labelY = marginY - 12;
    } else if (id.includes('developer-fixes-cd') && id.includes('cd-system')) {
      const marginY = 30;
      edgePath = `M ${sourceX} ${sourceY} V ${marginY} H ${targetX} V ${targetY}`;
      labelX = (sourceX + targetX) / 2;
      labelY = marginY - 12;
    } else {
      const result = getOrthogonalPath(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition);
      edgePath = result.path;
      labelX = result.labelX;
      labelY = result.labelY;
    }
  } else {
    const result = getOrthogonalPath(sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition);
    edgePath = result.path;
    labelX = result.labelX;
    labelY = result.labelY;
  }

  const upperLabel = (label || '').toUpperCase().trim();
  const isPassBranch = ['YES', 'PASS', 'APPROVED'].includes(upperLabel);
  const isFailBranch = ['NO', 'FAIL', 'REJECTED'].includes(upperLabel);

  // Base style & markers per color-coding rules:
  // - Loopback: yellow dashed
  // - No / Fail / Rejected: red dashed
  // - Yes / Pass / Approved: green dashed
  // - Default flow: neutral solid
  let style = { stroke: 'var(--connector-line)', strokeWidth: 1.5 };
  let markerId = 'pa-arrow-default';

  if (isLoopback) {
    style = { stroke: 'var(--accent-warning)', strokeWidth: 1.5, strokeDasharray: '6 4' };
    markerId = 'pa-arrow-loopback';
  } else if (isFailBranch) {
    style = { stroke: 'var(--accent-error)', strokeWidth: 1.5, strokeDasharray: '6 4' };
    markerId = 'pa-arrow-error';
  } else if (isPassBranch) {
    style = { stroke: 'var(--accent-success)', strokeWidth: 1.5, strokeDasharray: '6 4' };
    markerId = 'pa-arrow-success';
  }

  style.transition = 'opacity 300ms ease-out, stroke 200ms ease-out';

  // Highlight state overrides
  switch (highlight) {
    case 'dimmed':
      style.opacity = 0.12;
      break;
    case 'downstream':
    case 'direct':
      if (!isLoopback && !isFailBranch && !isPassBranch) {
        style.stroke = 'var(--connector-active)';
        markerId = 'pa-arrow-accent';
      }
      break;
    case 'upstream':
      if (!isLoopback && !isFailBranch && !isPassBranch) {
        style.stroke = 'var(--connector-active)';
        markerId = 'pa-arrow-accent';
      }
      style.opacity = 0.55;
      break;
    default:
      break;
  }

  // Determine Label Text Color
  let labelColorClass = 'text-primary';
  if (isPassBranch) {
    labelColorClass = 'text-accent-success font-semibold';
  } else if (isFailBranch) {
    labelColorClass = 'text-accent-error font-semibold';
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
