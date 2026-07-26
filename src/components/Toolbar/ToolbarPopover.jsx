import React from 'react';

// Anchored to the pill's docked edge so the panel always opens into the canvas
// rather than off-screen. Positions are relative to the toolbar container.
const PLACEMENT = {
  left: 'left-full top-0 ml-3',
  right: 'right-full top-0 mr-3',
  top: 'top-full left-0 mt-3',
  bottom: 'bottom-full left-0 mb-3',
};

/**
 * Glass popover rendered inside the toolbar. Pointer events are stopped at the
 * panel boundary: the toolbar container owns a drag-to-dock handler, and
 * without this, clicking a checkbox would start dragging the toolbar.
 */
export default function ToolbarPopover({ edge, theme, title, children, onClose }) {
  const isLight = theme === 'light';

  return (
    <div
      className={`absolute z-10 select-text ${PLACEMENT[edge] || PLACEMENT.left} w-64 max-w-[80vw] p-3
        ${isLight ? 'glass-panel-light' : 'glass-panel-dark'}`}
      style={{ cursor: 'default' }}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
          {title}
        </h2>
        <button
          type="button"
          aria-label={`Close ${title.toLowerCase()}`}
          onClick={onClose}
          className={`w-5 h-5 flex items-center justify-center rounded text-base leading-none
            ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  );
}
