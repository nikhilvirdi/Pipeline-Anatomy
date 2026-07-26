import React from 'react';

import ToolbarPopover from './ToolbarPopover';

/**
 * Show/hide a pipeline phase. Phases and their labels come from
 * `diagram-data.json`'s `phases` array — nothing is hardcoded here.
 */
export default function PhaseFilterPanel({
  edge,
  theme,
  phases,
  phaseCounts,
  hiddenPhases,
  onTogglePhase,
  onShowAll,
  onClose,
}) {
  const isLight = theme === 'light';
  const allVisible = hiddenPhases.size === 0;

  return (
    <ToolbarPopover edge={edge} theme={theme} title="Phases" onClose={onClose}>
      <ul className="flex flex-col gap-0.5">
        {phases.map((phase) => {
          const hidden = hiddenPhases.has(phase.id);
          return (
            <li key={phase.id}>
              <label
                className={`flex items-start gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer
                  ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
              >
                <input
                  type="checkbox"
                  checked={!hidden}
                  onChange={() => onTogglePhase(phase.id)}
                  className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-accent cursor-pointer"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-xs leading-snug ${hidden ? 'opacity-45' : ''}`}
                  >
                    {phase.label}
                  </span>
                  <span className="block text-[10px] opacity-50 mt-0.5">
                    {phaseCounts[phase.id] || 0} nodes
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onShowAll}
        disabled={allVisible}
        className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-medium transition-colors
          disabled:opacity-40 disabled:cursor-default
          ${isLight
            ? 'bg-black/5 hover:enabled:bg-accent/15 hover:enabled:text-accent-hover'
            : 'bg-white/5 hover:enabled:bg-accent/15 hover:enabled:text-accent'}`}
      >
        Show all phases
      </button>
    </ToolbarPopover>
  );
}
