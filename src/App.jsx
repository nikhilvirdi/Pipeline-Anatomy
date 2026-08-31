import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  getNodesBounds,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';

import '@xyflow/react/dist/style.css';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DiagramInteractionProvider } from './context/DiagramInteractionContext';
import { getTransformedDiagramData } from './utils/transformDiagramData';
import { computeHighlight } from './utils/highlightState';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useNodeUrl } from './hooks/useNodeUrl';
import {
  SMALL_SCREEN_QUERY,
  TOUCH_QUERY,
  useMediaQuery,
} from './hooks/useMediaQuery';
import DepthOfField from './components/DepthOfField';

import ProcessNode from './components/nodes/ProcessNode';
import DecisionNode from './components/nodes/DecisionNode';
import TerminalNode from './components/nodes/TerminalNode';
import ActorNode from './components/nodes/ActorNode';
import PhaseHeaderNode from './components/nodes/PhaseHeaderNode';
import CurvedEdge from './components/edges/CurvedEdge';
import EdgeMarkers from './components/EdgeMarkers';
import NodeTooltip from './components/NodeTooltip';
import FocusedNodeBar from './components/FocusedNodeBar';
import PhaseDividers from './components/PhaseDividers';
import Toolbar from './components/Toolbar/Toolbar';

const nodeTypes = {
  rect: ProcessNode,
  decision: DecisionNode,
  stadium: TerminalNode,
  actor: ActorNode,
  phaseHeader: PhaseHeaderNode,
};

const edgeTypes = {
  curved: CurvedEdge,
};

// Default landing viewport matching Phase 01 framing with breathing room
const DEFAULT_VIEWPORT = { x: 150, y: 200, zoom: 0.78 };
// On narrow/mobile viewports, start slightly zoomed out so Phase 01 is immediately readable
const MOBILE_DEFAULT_VIEWPORT = { x: 40, y: 150, zoom: 0.52 };

const FIT_VIEW_OPTIONS = { padding: 0.1, minZoom: 0.2 };
// Zoom transition: 300–400ms ease-out per THEME_TOKENS.md
const TRANSITION_MS = 350;
// Focusing one node: maxZoom is what stops fitView from zooming to a wall of
// pixels, since a single node's bounds would otherwise fill the viewport.
const FOCUS_VIEW_OPTIONS = { padding: 0.2, minZoom: 0.4, maxZoom: 1.5 };

function DiagramCanvas() {
  const { theme } = useTheme();
  const { fitView, setViewport, getNodes } = useReactFlow();
  const canvasRef = useRef(null);

  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const isTouch = useMediaQuery(TOUCH_QUERY);

  const initialViewport = isSmallScreen ? MOBILE_DEFAULT_VIEWPORT : DEFAULT_VIEWPORT;

  const base = useMemo(
    () => getTransformedDiagramData(theme),
    [theme]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(base.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(base.edges);

  const [tooltip, setTooltip] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [keyboardNodeId, setKeyboardNodeId] = useState(null);
  const [hiddenPhases, setHiddenPhases] = useState(() => new Set());
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const hiddenNodeIds = useMemo(() => {
    const hidden = new Set();
    if (hiddenPhases.size === 0) return hidden;
    for (const node of base.nodes) {
      if (hiddenPhases.has(node.data.phase)) hidden.add(node.id);
    }
    return hidden;
  }, [base.nodes, hiddenPhases]);

  const isVisible = useCallback((id) => !hiddenNodeIds.has(id), [hiddenNodeIds]);

  const baseNodeById = useMemo(
    () => new Map(base.nodes.map((node) => [node.id, node])),
    [base.nodes]
  );
  const baseEdgeById = useMemo(
    () => new Map(base.edges.map((edge) => [edge.id, edge])),
    [base.edges]
  );

  // Theme-dependent data (icons, palette) and phase visibility are merged into
  // the live nodes rather than replacing them, so positions from user drag
  // interaction survive a theme toggle or a phase filter change.
  useEffect(() => {
    setNodes((current) => {
      let changed = false;

      const next = current.map((node) => {
        const source = baseNodeById.get(node.id);
        const hidden = hiddenNodeIds.has(node.id);
        const staleTheme =
          source &&
          (source.data.theme !== node.data.theme ||
            source.data.icons !== node.data.icons);
        if (!staleTheme && Boolean(node.hidden) === hidden) {
          return node;
        }

        changed = true;
        return {
          ...node,
          hidden,
          data: {
            ...node.data,
            theme,
            icons: source?.data.icons ?? node.data.icons,
          },
        };
      });

      return changed ? next : current;
    });
  }, [baseNodeById, hiddenNodeIds, setNodes, theme]);

  useEffect(() => {
    setEdges((current) => {
      let changed = false;

      const next = current.map((edge) => {
        const source = baseEdgeById.get(edge.id);
        const hidden =
          hiddenNodeIds.has(edge.source) || hiddenNodeIds.has(edge.target);
        const staleTheme = source && source.data.theme !== edge.data.theme;
        if (!staleTheme && Boolean(edge.hidden) === hidden) {
          return edge;
        }

        changed = true;
        return {
          ...edge,
          hidden,
          data: {
            ...edge.data,
            theme,
          },
        };
      });

      return changed ? next : current;
    });
  }, [baseEdgeById, hiddenNodeIds, setEdges, theme]);

  // Clean dismiss when a hovered/focused node gets hidden
  useEffect(() => {
    setFocusedNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setKeyboardNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setHoveredNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setTooltip((current) =>
      current && hiddenNodeIds.has(current.id) ? null : current
    );
  }, [hiddenNodeIds]);

  const interaction = useMemo(
    () => ({
      ...computeHighlight({ hoveredNodeId, focusedNodeId, isVisible }),
      keyboardNodeId,
    }),
    [focusedNodeId, hoveredNodeId, isVisible, keyboardNodeId]
  );

  const tooltipNode = useMemo(
    () => (tooltip ? nodes.find((node) => node.id === tooltip.id) : null),
    [nodes, tooltip]
  );

  const clearFocus = useCallback(() => {
    setFocusedNodeId(null);
    setKeyboardNodeId(null);
  }, []);

  /* ------------------------------------------------------------- pointers */

  const handleNodeMouseEnter = useCallback(
    (event, node) => {
      if (isTouch) return;
      setHoveredNodeId(node.id);
      setTooltip({ id: node.id, x: event.clientX, y: event.clientY });
    },
    [isTouch]
  );

  const handleNodeMouseMove = useCallback(
    (event) => {
      if (isTouch) return;
      setTooltip((current) =>
        current ? { ...current, x: event.clientX, y: event.clientY } : null
      );
    },
    [isTouch]
  );

  const handleNodeMouseLeave = useCallback(() => {
    if (isTouch) return;
    setHoveredNodeId(null);
    setTooltip(null);
  }, [isTouch]);

  const handleNodeClick = useCallback(
    (event, node) => {
      event.stopPropagation();

      if (focusedNodeId === node.id) {
        clearFocus();
        if (isTouch) setTooltip(null);
        return;
      }

      setFocusedNodeId(node.id);
      setKeyboardNodeId(node.id);
      if (isTouch) {
        setTooltip({ id: node.id, x: event.clientX, y: event.clientY });
      }
    },
    [clearFocus, focusedNodeId, isTouch]
  );

  const handlePaneClick = useCallback(() => {
    clearFocus();
    setHoveredNodeId(null);
    setTooltip(null);
  }, [clearFocus]);

  const handleNodeDragStart = useCallback(() => {
    setTooltip(null);
  }, []);

  /* ------------------------------------------------------------- keyboard */

  const handleKeyboardSelect = useCallback(
    (nodeId) => {
      if (!nodeId) {
        clearFocus();
        return;
      }
      setKeyboardNodeId(nodeId);
      setFocusedNodeId(nodeId);

      const target = nodes.find((n) => n.id === nodeId);
      if (target) {
        fitView({
          nodes: [target],
          duration: TRANSITION_MS,
          ...FOCUS_VIEW_OPTIONS,
        });
      }
    },
    [clearFocus, fitView, nodes]
  );

  const handleKeyboardOpenCard = useCallback((nodeId) => {
    if (!nodeId) return;
    setTooltip({
      id: nodeId,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
  }, []);

  const handleKeyboardCloseCard = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleKeyDown = useKeyboardNav({
    keyboardNodeId,
    nodes,
    edges,
    onSelectNode: handleKeyboardSelect,
    onOpenCard: handleKeyboardOpenCard,
    onCloseCard: handleKeyboardCloseCard,
    onClearFocus: clearFocus,
  });

  /* ---------------------------------------------------------- deep-linking */

  const jumpToNode = useCallback(
    (nodeId, { openCard = false } = {}) => {
      const target = nodes.find((n) => n.id === nodeId);
      if (!target) return;

      if (hiddenPhases.has(target.data.phase)) {
        setHiddenPhases((current) => {
          const next = new Set(current);
          next.delete(target.data.phase);
          return next;
        });
      }

      setFocusedNodeId(nodeId);
      setKeyboardNodeId(nodeId);

      fitView({
        nodes: [target],
        duration: TRANSITION_MS,
        ...FOCUS_VIEW_OPTIONS,
      });

      if (openCard) {
        setTooltip({
          id: nodeId,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }
    },
    [fitView, hiddenPhases, nodes]
  );

  const validNodeIds = useMemo(
    () => new Set(base.nodes.map((n) => n.id)),
    [base.nodes]
  );
  const { startupNodeId } = useNodeUrl(focusedNodeId, validNodeIds);

  const startupHandledRef = useRef(false);
  useEffect(() => {
    if (!startupNodeId || startupHandledRef.current) return;
    startupHandledRef.current = true;
    jumpToNode(startupNodeId, { openCard: true });
  }, [jumpToNode, startupNodeId]);

  /* --------------------------------------------------- search & filtering */

  const phaseCounts = useMemo(() => {
    const counts = {};
    for (const node of base.nodes) {
      const p = node.data.phase;
      counts[p] = (counts[p] || 0) + 1;
    }
    return counts;
  }, [base.nodes]);

  const searchNodes = useMemo(
    () =>
      base.nodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        phase: node.data.phase,
        icons: node.data.icons,
      })),
    [base.nodes]
  );

  const handleJumpToNode = useCallback(
    (nodeId) => {
      jumpToNode(nodeId, { openCard: true });
    },
    [jumpToNode]
  );

  /* -------------------------------------------------------------- exports */

  const handleExportDiagram = useCallback(
    async (format = 'png') => {
      const el = canvasRef.current?.querySelector('.react-flow__viewport');
      if (!el) return;

      const activeNodes = nodes.filter((n) => !hiddenNodeIds.has(n.id));
      if (activeNodes.length === 0) return;

      const bounds = getNodesBounds(activeNodes);
      const padding = 60;
      const exportWidth = bounds.width + padding * 2;
      const exportHeight = bounds.height + padding * 2;

      const isLight = theme === 'light';
      const backgroundColor = isLight ? '#ffffff' : '#000000';

      const options = {
        backgroundColor,
        width: exportWidth,
        height: exportHeight,
        style: {
          width: `${exportWidth}px`,
          height: `${exportHeight}px`,
          transform: `translate(${-(bounds.x - padding)}px, ${-(bounds.y - padding)}px) scale(1)`,
        },
        pixelRatio: 2,
      };

      try {
        const dataUrl =
          format === 'svg' ? await toSvg(el, options) : await toPng(el, options);

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `pipeline-anatomy-${theme}.${format}`;
        a.click();
      } catch (err) {
        console.error('Export failed', err);
      }
    },
    [hiddenNodeIds, nodes, theme]
  );

  const handleExportPng = useCallback(() => handleExportDiagram('png'), [handleExportDiagram]);
  const handleExportSvg = useCallback(() => handleExportDiagram('svg'), [handleExportDiagram]);

  /* -------------------------------------------------------------- toolbar */

  const handleResetView = useCallback(() => {
    clearFocus();
    setHoveredNodeId(null);
    setViewport(initialViewport, { duration: TRANSITION_MS });
  }, [clearFocus, initialViewport, setViewport]);

  const handleResetLayout = useCallback(() => {
    // Reset all node positions back to original authored layout
    setNodes((current) =>
      current.map((node) => {
        const source = baseNodeById.get(node.id);
        if (!source) return node;
        return {
          ...node,
          position: { ...source.position },
        };
      })
    );

    // Reset viewport back to default landing view
    clearFocus();
    setHoveredNodeId(null);
    setViewport(initialViewport, { duration: TRANSITION_MS });

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage('Layout reset to default');
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, [baseNodeById, clearFocus, initialViewport, setNodes, setViewport]);

  const handleTogglePhase = useCallback((phaseId) => {
    setHiddenPhases((current) => {
      const next = new Set(current);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }, []);

  const handleShowAllPhases = useCallback(() => {
    setHiddenPhases(new Set());
  }, []);

  /* --------------------------------------------------------------- render */

  const isLight = theme === 'light';

  const focusedLabel = focusedNodeId
    ? baseNodeById.get(focusedNodeId)?.data.label
    : null;

  return (
    <div className="w-screen h-screen relative bg-canvas">
      {/* Floating Tooltip Popup. On small screens it sits at the bottom of the
          viewport instead of chasing the pointer. */}
      {tooltipNode && (
        <div
          className={
            isSmallScreen
              ? 'fixed z-50 pointer-events-none left-3 right-3 bottom-4 flex justify-center'
              : 'fixed z-50 pointer-events-none transition-all duration-75'
          }
          style={
            isSmallScreen
              ? undefined
              : {
                  left: Math.min(tooltip.x + 15, window.innerWidth - 340),
                  top: Math.min(tooltip.y + 15, window.innerHeight - 200),
                }
          }
        >
          <NodeTooltip node={tooltipNode} theme={theme} />
        </div>
      )}

      {/* Focused-node action bar */}
      {focusedNodeId && (
        <FocusedNodeBar
          label={focusedLabel}
          theme={theme}
        />
      )}

      {/* Toast confirmation for layout reset */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border shadow-lg backdrop-blur-md transition-all select-none pointer-events-none ${
            isLight
              ? 'bg-white/95 border-[#d0d0d0] text-[#1a1a1a] shadow-black/10'
              : 'bg-[#161616]/95 border-[#3a3a3a] text-[#f0f0f0] shadow-black/60'
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Floating Toolbar */}
      <Toolbar
        onResetView={handleResetView}
        onResetLayout={handleResetLayout}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        phases={base.phases}
        phaseCounts={phaseCounts}
        hiddenPhases={hiddenPhases}
        onTogglePhase={handleTogglePhase}
        onShowAllPhases={handleShowAllPhases}
        searchNodes={searchNodes}
        onJumpToNode={handleJumpToNode}
      />

      {/* Announces keyboard navigation for screen readers */}
      <div className="sr-only" aria-live="polite">
        {focusedLabel ? `${focusedLabel} focused` : ''}
      </div>

      <div
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="CI/CD pipeline diagram. Use arrow keys to move between connected nodes, Tab to cycle a node's connections, Enter for details, Escape to clear."
        onKeyDown={handleKeyDown}
        className="w-full h-full outline-none"
      >
        <DiagramInteractionProvider value={interaction}>
          <ReactFlow
            colorMode={theme}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={initialViewport}
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={true}
            panOnDrag={true}
            zoomOnPinch={true}
            panOnScroll={false}
            zoomOnScroll={true}
            edgesReconnectable={false}
            edgesFocusable={false}
            connectOnClick={false}
            deleteKeyCode={null}
            nodeClickDistance={8}
            disableKeyboardA11y
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseMove={handleNodeMouseMove}
            onNodeMouseLeave={handleNodeMouseLeave}
            onNodeDragStart={handleNodeDragStart}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
          >
            <PhaseDividers theme={theme} />
            <DepthOfField containerRef={canvasRef} />
            <EdgeMarkers />
            <Controls className={isLight ? 'rf-controls-light' : 'rf-controls-dark'} />
          </ReactFlow>
        </DiagramInteractionProvider>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <DiagramCanvas />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
