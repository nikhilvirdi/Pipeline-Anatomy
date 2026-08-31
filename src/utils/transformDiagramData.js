import { Position } from '@xyflow/react';

import diagramData from '../../diagram/diagram-data.json';
import nodeCards from '../../node-cards.json';
import phaseCards from '../../phase-cards.json';
import { getNodeIcons } from './iconMap';

const DECISION_NODE_IDS = new Set([
  'fail',
  'task-failed',
  'manual-approval-gate',
  'all-checks-pass',
  'post-production-health-check',
]);

/**
 * Canonical React Flow edge id for a diagram-data edge. Shared so graph
 * traversal can name the same edges the transform produces, rather than
 * re-deriving the format in a second place.
 */
export function edgeId(from, to) {
  return `e-${from}-${to}`;
}

/**
 * Transforms diagram data into React Flow nodes and edges using the
 * authored horizontal left-to-right layout.
 */
export function getTransformedDiagramData(theme = 'dark') {
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
      position: { x: node.x, y: node.y },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: node.label,
        phase: node.phase,
        shape: node.shape,
        source: node.source,
        note: node.note,
        icons,
        theme,
        orientation: 'horizontal',
        isLoopback: isLoopbackNode,
        cardText: nodeCards[node.id] || '',
      },
    };
  });

  const headerNodes = diagramData.phases.map((phase, idx) => {
    const headerDefs = {
      'local-development': { x: 532, y: -37, step: 'PHASE 01' },
      'continuous-integration': { x: 2456, y: -25, step: 'PHASE 02' },
      'continuous-delivery-deployment': { x: 4572, y: -103, step: 'PHASE 03' },
      'production': { x: 6046, y: -105, step: 'PHASE 04' },
    };
    const def = headerDefs[phase.id] || { x: 0, y: idx * 400, step: `PHASE 0${idx + 1}` };
    const phaseCard = phaseCards[phase.id];
    return {
      id: `header-${phase.id}`,
      type: 'phaseHeader',
      position: { x: def.x, y: def.y },
      selectable: false,
      draggable: false,
      data: {
        label: phaseCard?.title || phase.label,
        phase: phase.id,
        step: def.step,
        theme,
        orientation: 'horizontal',
        title: phaseCard?.title || phase.label,
        bullets: phaseCard?.bullets || [],
      },
    };
  });

  const usedHandlesByNode = {};
  const recordHandle = (nodeId, handleId) => {
    if (!nodeId || !handleId) return;
    if (!usedHandlesByNode[nodeId]) {
      usedHandlesByNode[nodeId] = {};
    }
    usedHandlesByNode[nodeId][handleId] = true;
  };

  const edges = diagramData.edges.map((edge) => {
    const isLoopback =
      (edge.from === 'developer-fixes-ci' && edge.to === 'commit-push-code') ||
      (edge.from === 'rollback' && edge.to === 'notify-developer-team') ||
      (edge.from === 'developer-fixes-cd' && edge.to === 'cd-system') ||
      (edge.from === 'debug-fix-code' && edge.to === 'local-testing') ||
      (edge.from === 'pipeline-stops-ci' && edge.to === 'developer-fixes-ci');

    const isBidirectional =
      (edge.from === 'monitoring-observability' && edge.to === 'end-users') ||
      (edge.from === 'end-users' && edge.to === 'monitoring-observability');

    let sourceHandle = undefined;
    let targetHandle = undefined;

    // Phase 01: Local Development
    if (edge.from === 'developer' && edge.to === 'ideation') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'ideation' && edge.to === 'architecture') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'architecture' && edge.to === 'tech-stack-locked-in') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'tech-stack-locked-in' && edge.to === 'writing-the-code') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'writing-the-code' && edge.to === 'local-testing') {
      sourceHandle = 'source-bottom';
      targetHandle = 'top';
    } else if (edge.from === 'local-testing' && edge.to === 'fail') {
      sourceHandle = 'right';
      targetHandle = 'target-top';
    } else if (edge.from === 'fail' && edge.to === 'debug-fix-code') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'debug-fix-code' && edge.to === 'local-testing') {
      sourceHandle = 'source-top';
      targetHandle = 'left';
    } else if (edge.from === 'fail' && edge.to === 'commit-push-code') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'commit-push-code' && edge.to === 'github') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'github' && edge.to === 'open-pull-request') {
      sourceHandle = 'source-bottom';
      targetHandle = 'top';
    } else if (edge.from === 'developer-fixes-ci' && edge.to === 'commit-push-code') {
      sourceHandle = 'source-top';
      targetHandle = 'top';
    }

    // Phase 02: Continuous Integration
    else if (edge.from === 'ci-system' && edge.to === 'install-dependencies') {
      sourceHandle = 'source-bottom';
      targetHandle = 'top';
    } else if (edge.from === 'install-dependencies' && edge.to === 'build-the-application') {
      sourceHandle = 'source-bottom';
      targetHandle = 'top';
    } else if (edge.from === 'run-unit-tests' && edge.to === 'run-integration-tests') {
      sourceHandle = 'right';
      targetHandle = 'bottom';
    } else if (edge.from === 'run-integration-tests' && edge.to === 'code-coverage-check') {
      sourceHandle = 'source-top';
      targetHandle = 'bottom';
    } else if (edge.from === 'code-coverage-check' && edge.to === 'store-artifact-in-registry') {
      sourceHandle = 'source-top';
      targetHandle = 'bottom';
    } else if (edge.from === 'store-artifact-in-registry' && edge.to === 'task-failed') {
      sourceHandle = 'source-top';
      targetHandle = 'target-bottom';
    } else if (edge.from === 'task-failed' && edge.to === 'pipeline-stops-ci') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'pipeline-stops-ci' && edge.to === 'developer-fixes-ci') {
      sourceHandle = 'source-left';
      targetHandle = 'bottom';
    } else if (edge.from === 'task-failed' && edge.to === 'cd-system') {
      sourceHandle = 'right';
      targetHandle = 'left';
    }

    // Phase 03: Continuous Delivery / Deployment
    else if (edge.from === 'cd-system' && edge.to === 'manual-approval-gate') {
      sourceHandle = 'source-bottom';
      targetHandle = 'target-top';
    } else if (edge.from === 'manual-approval-gate' && edge.to === 'pipeline-stops-cd') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'manual-approval-gate' && edge.to === 'fetch-build-artifacts') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'fetch-build-artifacts' && edge.to === 'inject-config-secrets') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'inject-config-secrets' && edge.to === 'package-container-image') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'package-container-image' && edge.to === 'push-image-docker-hub') {
      sourceHandle = 'right';
      targetHandle = 'top';
    } else if (edge.from === 'push-image-docker-hub' && edge.to === 'pull-image-and-deploy') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'developer-fixes-cd' && edge.to === 'cd-system') {
      sourceHandle = 'source-top';
      targetHandle = 'top';
    }

    // Phase 04: Production
    else if (edge.from === 'run-health-check' && edge.to === 'all-checks-pass') {
      sourceHandle = 'right';
      targetHandle = 'target-bottom';
    } else if (edge.from === 'all-checks-pass' && edge.to === 'notify-developer-team') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'notify-developer-team' && edge.to === 'developer-fixes-cd') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'all-checks-pass' && edge.to === 'deployment-strategy') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'automated-manual-deployment-production' && edge.to === 'post-production-health-check') {
      sourceHandle = 'right';
      targetHandle = 'target-bottom';
    } else if (edge.from === 'post-production-health-check' && edge.to === 'rollback') {
      sourceHandle = 'source-left';
      targetHandle = 'target-right';
    } else if (edge.from === 'rollback' && edge.to === 'notify-developer-team') {
      sourceHandle = 'source-left';
      targetHandle = 'top';
    } else if (edge.from === 'post-production-health-check' && edge.to === 'end-users') {
      sourceHandle = 'right';
      targetHandle = 'left';
    } else if (edge.from === 'end-users' && edge.to === 'monitoring-observability') {
      sourceHandle = 'source-bottom';
      targetHandle = 'top';
    } else if (edge.from === 'monitoring-observability' && edge.to === 'end-users') {
      sourceHandle = 'source-top';
      targetHandle = 'bottom';
    }

    const sHandle = sourceHandle || 'right';
    const tHandle = targetHandle || 'left';

    recordHandle(edge.from, sHandle);
    recordHandle(edge.to, tHandle);

    return {
      id: edgeId(edge.from, edge.to),
      type: 'curved',
      source: edge.from,
      target: edge.to,
      sourceHandle: sHandle,
      targetHandle: tHandle,
      label: edge.label || undefined,
      data: {
        note: edge.note,
        isLoopback,
        isBidirectional,
        theme,
        orientation: 'horizontal',
        waypoints: edge.waypoints,
      },
    };
  });

  nodes.forEach((n) => {
    n.data.usedHandles = usedHandlesByNode[n.id] || {};
  });

  return { nodes: [...headerNodes, ...nodes], edges, phases: diagramData.phases };
}
