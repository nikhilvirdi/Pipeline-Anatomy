import React, { useCallback, useEffect, useState } from 'react';

import { useTheme } from '../../context/ThemeContext';
import { useToolbarDock } from '../../hooks/useToolbarDock';
import PhaseFilterPanel from './PhaseFilterPanel';
import SearchPanel from './SearchPanel';
import ExportMenu from './ExportMenu';
import ToolbarButton from './ToolbarButton';
import {
  DockIcon,
  ExportIcon,
  MoonIcon,
  PhaseFilterIcon,
  ResetLayoutIcon,
  ResetViewIcon,
  SearchIcon,
  SunIcon,
} from './ToolbarIcons';

/**
 * Floating glass pill toolbar (UI_SPEC.md "Floating Toolbar").
 * Docks to any of the 4 viewport edges — via the dock button (tap to cycle)
 * or by dragging the pill and releasing near an edge. Left/right dock keeps
 * the vertical layout, top/bottom switches to horizontal.
 */
export default function Toolbar({
  onResetView,
  onResetLayout,
  onExportPng,
  onExportSvg,
  phases = [],
  phaseCounts = {},
  hiddenPhases,
  onTogglePhase,
  onShowAllPhases,
  searchNodes = [],
  onJumpToNode,
}) {
  const { theme, toggleTheme } = useTheme();
  const { ref, edge, position, dragging, vertical, handlers, cycleEdge } =
    useToolbarDock('left');
  const [openPanel, setOpenPanel] = useState(null);

  const closePanel = useCallback(() => setOpenPanel(null), []);

  const togglePanel = useCallback(
    (panel) => setOpenPanel((current) => (current === panel ? null : panel)),
    []
  );

  // Dismiss on a click anywhere outside the pill. The panels render inside the
  // toolbar element, so a single containment check covers both.
  useEffect(() => {
    if (!openPanel) return undefined;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) closePanel();
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePanel();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closePanel, openPanel, ref]);

  const handleJump = useCallback(
    (nodeId) => {
      onJumpToNode?.(nodeId);
      closePanel();
    },
    [closePanel, onJumpToNode]
  );

  const handleResetView = useCallback(() => {
    closePanel();
    onResetView?.();
  }, [closePanel, onResetView]);

  const isLight = theme === 'light';
  const glassClass = isLight ? 'glass-toolbar-light' : 'glass-toolbar-dark';
  const dividerClass = `${vertical ? 'w-5 h-px' : 'h-5 w-px'} shrink-0 ${
    isLight ? 'bg-black/10' : 'bg-white/10'
  }`;

  return (
    <div
      ref={ref}
      {...handlers}
      role="toolbar"
      aria-label="Diagram controls"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      data-dock-edge={edge}
      className={`fixed z-50 flex items-center gap-2 p-1.5 select-none
        ${vertical ? 'flex-col w-12' : 'flex-row h-12'} ${glassClass}`}
      style={{
        left: position ? position.x : 0,
        top: position ? position.y : 0,
        opacity: position ? 1 : 0,
        touchAction: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        // Dock snap: 200ms ease-in-out (THEME_TOKENS.md). Instant follow while dragging.
        transition: dragging
          ? 'none'
          : 'left 200ms ease-in-out, top 200ms ease-in-out',
      }}
    >
      <ToolbarButton
        label="Search nodes"
        icon={<SearchIcon />}
        theme={theme}
        active={openPanel === 'search'}
        pressed={openPanel === 'search'}
        onClick={() => togglePanel('search')}
      />

      <ToolbarButton
        label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        icon={isLight ? <MoonIcon /> : <SunIcon />}
        theme={theme}
        onClick={toggleTheme}
      />

      <ToolbarButton
        label="Reset view"
        icon={<ResetViewIcon />}
        theme={theme}
        onClick={handleResetView}
      />

      <ToolbarButton
        label="Reset layout"
        icon={<ResetLayoutIcon />}
        theme={theme}
        onClick={onResetLayout}
      />

      <ToolbarButton
        label="Filter phases"
        icon={<PhaseFilterIcon />}
        theme={theme}
        active={openPanel === 'phases' || hiddenPhases?.size > 0}
        pressed={openPanel === 'phases'}
        onClick={() => togglePanel('phases')}
      />

      <div className="relative">
        <ToolbarButton
          label="Export diagram"
          icon={<ExportIcon />}
          theme={theme}
          active={openPanel === 'export'}
          pressed={openPanel === 'export'}
          onClick={() => togglePanel('export')}
        />

        {openPanel === 'export' && (
          <ExportMenu
            edge={edge}
            theme={theme}
            onExportPng={onExportPng}
            onExportSvg={onExportSvg}
            onClose={closePanel}
          />
        )}
      </div>

      <div className={dividerClass} />

      <ToolbarButton
        label={`Move toolbar (docked ${edge})`}
        icon={<DockIcon />}
        theme={theme}
        onClick={cycleEdge}
      />

      {openPanel === 'search' && (
        <SearchPanel
          edge={edge}
          theme={theme}
          nodes={searchNodes}
          onJump={handleJump}
          onClose={closePanel}
        />
      )}

      {openPanel === 'phases' && (
        <PhaseFilterPanel
          edge={edge}
          theme={theme}
          phases={phases}
          phaseCounts={phaseCounts}
          hiddenPhases={hiddenPhases}
          onTogglePhase={onTogglePhase}
          onShowAll={onShowAllPhases}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
