import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
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

const FIT_VIEW_OPTIONS = { padding: 0.1, minZoom: 0.5 };
// Zoom transition: 300–400ms ease-out per THEME_TOKENS.md
const TRANSITION_MS = 350;
// Focusing one node: maxZoom is what stops fitView from zooming to a wall of
// pixels, since a single node's bounds would otherwise fill the viewport.
const FOCUS_VIEW_OPTIONS = { padding: 0.2, minZoom: 0.4, maxZoom: 1.5 };

function DiagramCanvas() {
  const { theme } = useTheme();
  const { fitView, getNodes } = useReactFlow();
  const canvasRef = useRef(null);

  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const isTouch = useMediaQuery(TOUCH_QUERY);
  const orientation = isSmallScreen ? 'vertical' : 'horizontal';

  const base = useMemo(
    () => getTransformedDiagramData(theme, orientation),
    [orientation, theme]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(base.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(base.edges);

  const [tooltip, setTooltip] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [keyboardNodeId, setKeyboardNodeId] = useState(null);
  const [hiddenPhases, setHiddenPhases] = useState(() => new Set());
  // The minimap costs ~17% of a phone screen and sits exactly where the
  // small-screen tooltip is anchored, so it starts hidden there. The toolbar
  // toggle still brings it back.
  const [minimapVisible, setMinimapVisible] = useState(!isSmallScreen);

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
  // the live nodes rather than replacing them, so positions from Phase 5's
  // drag interaction survive a theme toggle or a phase filter change.
  //
  // Both effects return the previous array untouched when nothing differs, so
  // a mount or an unrelated re-render doesn't hand React Flow a fresh array and
  // make it re-adopt and re-measure all 46 nodes for no reason.
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
        const staleLayout =
          source && source.data.orientation !== node.data.orientation;
        if (!staleTheme && !staleLayout && Boolean(node.hidden) === hidden) {
          return node;
        }

        changed = true;
        return {
          ...node,
          hidden,
          // Switching layout direction re-lays out the diagram, so dragged
          // positions are intentionally replaced here; a theme change or a
          // phase filter must leave them alone.
          ...(staleLayout
            ? {
                position: source.position,
                sourcePosition: source.sourcePosition,
                targetPosition: source.targetPosition,
              }
            : null),
          data:
            staleTheme || staleLayout
              ? { ...node.data, ...source.data }
              : node.data,
        };
      });

      return changed ? next : current;
    });
  }, [baseNodeById, hiddenNodeIds, setNodes]);

  useEffect(() => {
    setEdges((current) => {
      let changed = false;

      const next = current.map((edge) => {
        const source = baseEdgeById.get(edge.id);
        // An edge with either endpoint filtered out has nothing to connect.
        const hidden =
          hiddenNodeIds.has(edge.source) || hiddenNodeIds.has(edge.target);
        const staleData = source && source.data.theme !== edge.data?.theme;
        if (!staleData && Boolean(edge.hidden) === hidden) return edge;

        changed = true;
        return {
          ...edge,
          hidden,
          data: staleData ? { ...edge.data, ...source.data } : edge.data,
        };
      });

      return changed ? next : current;
    });
  }, [baseEdgeById, hiddenNodeIds, setEdges]);

  // Filtering away the current selection would otherwise leave the whole
  // diagram dimmed against a node nobody can see.
  useEffect(() => {
    setFocusedNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setKeyboardNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setHoveredNodeId((id) => (id && hiddenNodeIds.has(id) ? null : id));
    setTooltip((current) =>
      current && hiddenNodeIds.has(current.id) ? null : current
    );
  }, [hiddenNodeIds]);

  // Re-fit after a layout-direction switch: the previous viewport was framing a
  // diagram that is now 6120 units wide instead of ~1310, or the reverse.
  const previousOrientation = useRef(orientation);
  useEffect(() => {
    if (previousOrientation.current === orientation) return undefined;
    previousOrientation.current = orientation;

    setFocusedNodeId(null);
    setKeyboardNodeId(null);
    setHoveredNodeId(null);
    setTooltip(null);
    setMinimapVisible(!isSmallScreen);

    // One tick, so the new positions are in the store before it measures them.
    const timer = window.setTimeout(
      () => fitView({ ...FIT_VIEW_OPTIONS, duration: TRANSITION_MS }),
      60
    );
    return () => window.clearTimeout(timer);
  }, [fitView, isSmallScreen, orientation]);

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

  /* ---------------------------------------------------------------- focus */

  const centreOnNode = useCallback(
    (nodeId) => {
      fitView({ ...FOCUS_VIEW_OPTIONS, duration: TRANSITION_MS, nodes: [{ id: nodeId }] });
    },
    [fitView]
  );

  const focusNode = useCallback(
    (nodeId) => {
      if (!nodeId || hiddenNodeIds.has(nodeId)) return;
      setFocusedNodeId(nodeId);
      centreOnNode(nodeId);
    },
    [centreOnNode, hiddenNodeIds]
  );

  const clearFocus = useCallback(() => {
    setFocusedNodeId(null);
    setKeyboardNodeId(null);
    setTooltip(null);
  }, []);

  /* ------------------------------------------------------------ URL sync */

  // Set of all valid node ids — used to validate the ?node= startup param.
  const validNodeIds = useMemo(
    () => new Set(base.nodes.map((n) => n.id)),
    [base.nodes]
  );

  // Syncs focusedNodeId <-> ?node= query param via history.pushState.
  const { startupNodeId } = useNodeUrl(focusedNodeId, validNodeIds);

  // On first render, if a valid ?node= param was present, focus that node.
  const startupAppliedRef = useRef(false);
  useEffect(() => {
    if (startupAppliedRef.current) return;
    if (!startupNodeId) {
      startupAppliedRef.current = true;
      return;
    }
    // Nodes are not measured until after the first layout pass, so we wait
    // one animation frame before calling fitView on the specific node.
    const id = window.requestAnimationFrame(() => {
      startupAppliedRef.current = true;
      focusNode(startupNodeId);
    });
    return () => window.cancelAnimationFrame(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupNodeId]);

  /* -------------------------------------------------------- pointer input */

  // Touch devices emulate mouseover/mouseleave on tap, which would fight the
  // tap handling below — so on a coarse pointer these stay switched off and
  // `handleNodeClick` does all the work.
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

  // React Flow fires the click after a drag finishes. `nodeClickDistance` gives
  // touch taps room for finger jitter, but that same tolerance means a small
  // *mouse* drag lands inside it — so the node would move and click-to-focus
  // would zoom the canvas at the same time, which reads as dragging being
  // broken. A real drag always sets this first, so the click can be dropped.
  const draggedRef = useRef(false);

  const handleNodeDragStart = useCallback(() => {
    draggedRef.current = true;
  }, []);

  const handleNodeClick = useCallback(
    (event, node) => {
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }

      setTooltip({ id: node.id, x: event.clientX, y: event.clientY });
      setKeyboardNodeId(null);
      canvasRef.current?.focus();

      // On touch there is no hover, so a tap has to stand in for it —
      // EDGE_RULES.md asks for the full upstream/downstream chain on tap.
      // Without this, path highlighting would be desktop-only.
      if (isTouch) setHoveredNodeId(node.id);

      // Clicking the already-focused node releases the focus rather than
      // leaving the user with no way back other than the reset button.
      if (focusedNodeId === node.id) {
        setFocusedNodeId(null);
        // On desktop the pointer is still over the node, so the tooltip stays
        // by hover. On touch nothing would re-show it, and leaving it up with
        // no highlight behind it reads as a stuck popup.
        if (isTouch) {
          setHoveredNodeId(null);
          setTooltip(null);
        }
        return;
      }
      focusNode(node.id);
    },
    [focusNode, focusedNodeId, isTouch]
  );

  // Clearing focus also removes the ?node= param (handled inside useNodeUrl).
  // We re-use the existing clearFocus; URL cleanup is automatic via the effect.

  // Tap/click anywhere off a node dismisses the tooltip and the highlight.
  const handlePaneClick = useCallback(() => {
    draggedRef.current = false;
    clearFocus();
    setHoveredNodeId(null);
    canvasRef.current?.focus();
  }, [clearFocus]);

  /* ------------------------------------------------------- keyboard input */

  const handleKeyboardNavigate = useCallback(
    (nodeId) => {
      setKeyboardNodeId(nodeId);
      setTooltip(null);
      focusNode(nodeId);
    },
    [focusNode]
  );

  // Keyboard focus centres the node, so anchoring the tooltip just off the
  // canvas centre lands it beside whatever the user just navigated to.
  const handleKeyboardActivate = useCallback((nodeId) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      id: nodeId,
      x: rect.left + rect.width / 2 + 70,
      y: rect.top + rect.height / 2 + 30,
    });
  }, []);

  const handleKeyDown = useKeyboardNav({
    activeNodeId: keyboardNodeId || focusedNodeId,
    isVisible,
    getNodes,
    onNavigate: handleKeyboardNavigate,
    onActivate: handleKeyboardActivate,
    onClear: clearFocus,
  });

  // Focus the canvas on load so arrow-key navigation works without a click.
  useEffect(() => {
    canvasRef.current?.focus({ preventScroll: true });
  }, []);

  /* -------------------------------------------------------------- toolbar */

  const handleResetView = useCallback(() => {
    clearFocus();
    setHoveredNodeId(null);
    fitView({ ...FIT_VIEW_OPTIONS, duration: TRANSITION_MS });
  }, [clearFocus, fitView]);

  const handleToggleMinimap = useCallback(() => {
    setMinimapVisible((visible) => !visible);
  }, []);

  const handleTogglePhase = useCallback((phaseId) => {
    setHiddenPhases((current) => {
      const next = new Set(current);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }, []);

  const handleShowAllPhases = useCallback(() => setHiddenPhases(new Set()), []);

  const phaseCounts = useMemo(() => {
    const counts = {};
    for (const node of base.nodes) {
      counts[node.data.phase] = (counts[node.data.phase] || 0) + 1;
    }
    return counts;
  }, [base.nodes]);

  // Search only ever sees what the phase filter leaves on the canvas.
  const searchNodes = useMemo(
    () =>
      base.nodes
        .filter((node) => !hiddenNodeIds.has(node.id))
        .map((node) => ({
          id: node.id,
          label: node.data.label,
          phase: node.data.phase,
        })),
    [base.nodes, hiddenNodeIds]
  );

  const handleJumpToNode = useCallback(
    (nodeId) => {
      setKeyboardNodeId(null);
      focusNode(nodeId);
      canvasRef.current?.focus();
    },
    [focusNode]
  );

  /* --------------------------------------------------------------- render */

  const isLight = theme === 'light';
  const canvasClass = isLight ? 'canvas-dot-grid-light' : 'canvas-dot-grid-dark';

  const minimapNodeColor = useCallback(
    (node) => {
      const state = interaction.nodeStates.get(node.id);
      if (state === 'focused') return '#22c55e';
      if (state === 'neighbor' || state === 'related') return '#86efac';
      return isLight ? '#94a3b8' : '#475569';
    },
    [interaction.nodeStates, isLight]
  );

  const focusedLabel = focusedNodeId
    ? baseNodeById.get(focusedNodeId)?.data.label
    : null;

  return (
    <div className={`w-screen h-screen relative ${canvasClass}`}>
      {/* Floating Tooltip Popup. On small screens it sits at the bottom of the
          viewport instead of chasing the pointer — a 320px card offset from a
          tap point has nowhere to go on a 375px-wide screen, and anchoring it
          keeps it clear of the finger that opened it. */}
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

      {/* Focused-node action bar: copy-link, only visible in click-focus state */}
      {focusedNodeId && (
        <FocusedNodeBar
          label={focusedLabel}
          theme={theme}
        />
      )}

      {/* Floating Toolbar (Phase 6) */}
      <Toolbar
        onResetView={handleResetView}
        minimapVisible={minimapVisible}
        onToggleMinimap={handleToggleMinimap}
        phases={base.phases}
        phaseCounts={phaseCounts}
        hiddenPhases={hiddenPhases}
        onTogglePhase={handleTogglePhase}
        onShowAllPhases={handleShowAllPhases}
        searchNodes={searchNodes}
        onJumpToNode={handleJumpToNode}
        isSmallScreen={isSmallScreen}
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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={FIT_VIEW_OPTIONS}
            // The diagram spans ~6350 units, so fitting it needs roughly 0.21
            // zoom — React Flow's default minZoom of 0.5 clamps fitView and
            // leaves both ends of the pipeline off-screen.
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={true}
            edgesReconnectable={false}
            edgesFocusable={false}
            connectOnClick={false}
            deleteKeyCode={null}
            // A finger never taps perfectly still. With the default of 0 any
            // jitter cancels the click and the tooltip never opens; 8px is well
            // under what an intentional node drag covers.
            nodeClickDistance={8}
            // React Flow's built-in arrow keys move the selected node; Phase 7
            // uses them to move between nodes instead (useKeyboardNav).
            disableKeyboardA11y
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseMove={handleNodeMouseMove}
            onNodeMouseLeave={handleNodeMouseLeave}
            onNodeDragStart={handleNodeDragStart}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
          >
            <DepthOfField containerRef={canvasRef} />
            <EdgeMarkers />
            <Background color="transparent" />
            <Controls className={isLight ? 'rf-controls-light' : 'rf-controls-dark'} />
            {minimapVisible && (
              <MiniMap
                pannable
                zoomable
                className={isLight ? 'rf-minimap-light' : 'rf-minimap-dark'}
                bgColor="transparent"
                nodeColor={minimapNodeColor}
                nodeStrokeColor={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}
                maskColor={
                  isLight ? 'rgba(245, 245, 245, 0.7)' : 'rgba(10, 10, 10, 0.7)'
                }
              />
            )}
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
