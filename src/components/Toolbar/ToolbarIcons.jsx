import React from 'react';

// Inline stroke icons so the toolbar inherits currentColor for hover/active
// accent states without shipping an icon dependency.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export function SearchIcon() {
  return (
    <svg {...base}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.4" y1="16.4" x2="21" y2="21" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="5" y1="5" x2="6.8" y2="6.8" />
      <line x1="17.2" y1="17.2" x2="19" y2="19" />
      <line x1="5" y1="19" x2="6.8" y2="17.2" />
      <line x1="17.2" y1="6.8" x2="19" y2="5" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...base}>
      <path d="M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a6.6 6.6 0 0 0 11.3 11.3Z" />
    </svg>
  );
}

export function ResetViewIcon() {
  return (
    <svg {...base}>
      <path d="M4 9V6a2 2 0 0 1 2-2h3" />
      <path d="M15 4h3a2 2 0 0 1 2 2v3" />
      <path d="M20 15v3a2 2 0 0 1-2 2h-3" />
      <path d="M9 20H6a2 2 0 0 1-2-2v-3" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  );
}

export function ResetLayoutIcon() {
  return (
    <svg {...base}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}


export function PhaseFilterIcon() {
  return (
    <svg {...base}>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5 9-4.5" />
    </svg>
  );
}

export function ExportIcon() {
  return (
    <svg {...base}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function DockIcon() {


  return (
    <svg {...base}>
      <path d="M12 3v18M3 12h18" />
      <path d="m9.2 6 2.8-3 2.8 3" />
      <path d="m9.2 18 2.8 3 2.8-3" />
      <path d="m6 9.2-3 2.8 3 2.8" />
      <path d="m18 9.2 3 2.8-3 2.8" />
    </svg>
  );
}
