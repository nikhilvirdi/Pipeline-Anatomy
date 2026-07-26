import { Position } from '@xyflow/react';

import diagramData from '../../diagram/diagram-data.json';
import nodeCards from '../../node-cards.json';
import phaseCards from '../../phase-cards.json';
import { getNodeIcons } from './iconMap';
import { getVerticalPositions } from './verticalLayout';

const DECISION_NODE_IDS = new Set([
  'fail',
  'task-failed',
  'manual-approval-gate',
  'all-checks-pass',
  'post-production-health-check',
]);

const MIRRORED_PAIR_STYLES = {
  // Neutral slate/charcoal for pipeline stops (distinct from loopback red #f87171)
  'pipeline-stops-ci': {
    dark: 'bg-slate-900/80 border-slate-500 text-slate-300',
    light: 'bg-slate-100/90 border-slate-400 text-slate-800',
  },
  'pipeline-stops-cd': {
    dark: 'bg-slate-900/80 border-slate-500 text-slate-300',
    light: 'bg-slate-100/90 border-slate-400 text-slate-800',
  },
  // Amber theme for developer fixes
  'developer-fixes-ci': {
    dark: 'bg-amber-950/60 border-amber-500 text-amber-200',
    light: 'bg-amber-100/80 border-amber-500 text-amber-900',
  },
  'developer-fixes-cd': {
    dark: 'bg-amber-950/60 border-amber-500 text-amber-200',
    light: 'bg-amber-100/80 border-amber-500 text-amber-900',
  },
  // Cyan/sky theme for notification nodes
  'notify-team-success': {
    dark: 'bg-cyan-950/60 border-cyan-400 text-cyan-200',
    light: 'bg-cyan-100/80 border-cyan-500 text-cyan-900',
  },
  'notify-developer-team': {
    dark: 'bg-cyan-950/60 border-cyan-400 text-cyan-200',
    light: 'bg-cyan-100/80 border-cyan-500 text-cyan-900',
  },
};

/**
 * Canonical React Flow edge id for a diagram-data edge. Shared so graph
 * traversal can name the same edges the transform produces, rather than
 * re-deriving the format in a second place.
 */
export function edgeId(from, to) {
  return `e-${from}-${to}`;
}

/**
 * `horizontal` is the authored desktop layout; `vertical` is the top-to-bottom
 * layout small screens switch to (see `verticalLayout.js`).
 */
export function getTransformedDiagramData(theme = 'dark', orientation = 'horizontal') {
  const isVertical = orientation === 'vertical';
  const verticalPositions = isVertical ? getVerticalPositions() : null;

  const nodes = diagramData.nodes.map((node) => {
    let type = 'rect';
    if (DECISION_NODE_IDS.has(node.id) || node.shape === 'decision') {
      type = 'decision';
    } else if (node.shape === 'circle' || node.shape === 'stadium') {
      type = 'stadium';
    } else if (node.shape === 'actor') {
      type = 'actor';
    }

    const icons = getNodeIcons(node.id, theme);
    const pairStyleObj = MIRRORED_PAIR_STYLES[node.id];
    const mirroredStyle = pairStyleObj ? pairStyleObj[theme] : null;

    // Handle sides must match these, or edges detach from the dots they point
    // at — the node components read `data.orientation` to stay in sync.
    const isLoopbackNode =
      node.id === 'pipeline-stops-ci' ||
      node.id === 'developer-fixes-ci' ||
      node.id === 'pipeline-stops-cd' ||
      node.id === 'developer-fixes-cd' ||
      node.id === 'notify-developer-team' ||
      node.id === 'debug-fix-code' ||
      node.id === 'rollback';

    return {
      id: node.id,
      type,
      position:
        (isVertical && verticalPositions.get(node.id)) || { x: node.x, y: node.y },
      sourcePosition: isVertical ? Position.Bottom : Position.Right,
      targetPosition: isVertical ? Position.Top : Position.Left,
      data: {
        label: node.label,
        phase: node.phase,
        shape: node.shape,
        source: node.source,
        note: node.note,
        icons,
        mirroredStyle,
        theme,
        orientation,
        isLoopback: isLoopbackNode,
        cardText: nodeCards[node.id] || '',
      },
    };
  });

  const headerNodes = diagramData.phases.map((phase, idx) => {
    const headerDefs = {
      'local-development': { x: -20, y: -70, step: 'PHASE 01' },
      'continuous-integration': { x: 2130, y: -70, step: 'PHASE 02' },
      'continuous-delivery-deployment': { x: 4430, y: -70, step: 'PHASE 03' },
      'production': { x: 7580, y: -70, step: 'PHASE 04' },
    };
    const def = headerDefs[phase.id] || { x: 0, y: idx * 400, step: `PHASE 0${idx + 1}` };
    const phaseCard = phaseCards[phase.id];
    return {
      id: `header-${phase.id}`,
      type: 'phaseHeader',
      position: isVertical ? { x: -100, y: idx * 900 - 60 } : { x: def.x, y: def.y },
      selectable: false,
      draggable: false,
      data: {
        label: phaseCard?.title || phase.label,
        phase: phase.id,
        step: def.step,
        theme,
        orientation,
        title: phaseCard?.title || phase.label,
        bullets: phaseCard?.bullets || [],
      },
    };
  });

  const edges = diagramData.edges.map((edge) => {
    const isLoopback =
      (edge.from === 'developer-fixes-ci' && edge.to === 'commit-push-code') ||
      (edge.from === 'rollback' && edge.to === 'notify-developer-team') ||
      (edge.from === 'developer-fixes-cd' && edge.to === 'cd-system') ||
      (edge.from === 'notify-developer-team' && edge.to === 'developer-fixes-cd') ||
      (edge.from === 'pipeline-stops-ci' && edge.to === 'developer-fixes-ci') ||
      (edge.from === 'debug-fix-code' && edge.to === 'local-testing');

    const isBidirectional =
      (edge.from === 'monitoring-observability' && edge.to === 'end-users') ||
      (edge.from === 'end-users' && edge.to === 'monitoring-observability');

    let sourceHandle = undefined;
    let targetHandle = undefined;

    if (DECISION_NODE_IDS.has(edge.from)) {
      if (edge.from === 'post-production-health-check') {
        if (edge.to === 'notify-team-success') {
          sourceHandle = 'top';
        } else if (edge.to === 'end-users') {
          sourceHandle = 'right';
        } else if (edge.to === 'rollback') {
          sourceHandle = 'bottom';
        }
      } else if (
        (edge.from === 'fail' && edge.label === 'Yes') ||
        (edge.from === 'task-failed' && edge.label === 'Yes') ||
        (edge.from === 'manual-approval-gate' && edge.label === 'Rejected') ||
        (edge.from === 'all-checks-pass' && edge.label === 'No')
      ) {
        sourceHandle = 'bottom';
      } else if (
        (edge.from === 'fail' && edge.label === 'No') ||
        (edge.from === 'task-failed' && edge.label === 'No') ||
        (edge.from === 'manual-approval-gate' && edge.label === 'Approved') ||
        (edge.from === 'all-checks-pass' && edge.label === 'Yes')
      ) {
        sourceHandle = 'top';
      }
    }

    if (
      (edge.to === 'local-testing' && edge.from === 'debug-fix-code') ||
      (edge.to === 'commit-push-code' && edge.from === 'developer-fixes-ci') ||
      (edge.to === 'cd-system' && edge.from === 'developer-fixes-cd')
    ) {
      targetHandle = 'bottom';
    }

    return {
      id: edgeId(edge.from, edge.to),
      type: 'curved',
      source: edge.from,
      target: edge.to,
      sourceHandle,
      targetHandle,
      label: edge.label || undefined,
      data: {
        note: edge.note,
        isLoopback,
        isBidirectional,
        theme,
      },
    };
  });

  return { nodes: [...headerNodes, ...nodes], edges, phases: diagramData.phases };
}
