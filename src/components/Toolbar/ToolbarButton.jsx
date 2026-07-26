import React from 'react';

/**
 * Icon-only toolbar button — 36px hit target, 8px radius per THEME_TOKENS.md.
 * `active` renders the accent state; `stub` dims icons whose feature isn't wired yet.
 */
export default function ToolbarButton({
  label,
  icon,
  onClick,
  active = false,
  stub = false,
  theme = 'dark',
  pressed,
}) {
  const isLight = theme === 'light';

  const idle = isLight
    ? 'text-slate-600 hover:bg-accent/10 hover:text-accent-hover'
    : 'text-slate-300 hover:bg-accent/10 hover:text-accent';

  const activeClasses = 'bg-accent/20 text-accent ring-1 ring-accent/40';

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg
        transition-colors duration-150 cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-accent/60
        ${active ? activeClasses : idle} ${stub && !active ? 'opacity-50' : ''}`}
    >
      {icon}
    </button>
  );
}
