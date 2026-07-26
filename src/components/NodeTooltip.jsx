import React from 'react';

export default function NodeTooltip({ node, theme }) {
  if (!node || !node.data) return null;

  const { label, phase, cardText } = node.data;
  const isLight = theme === 'light';

  // Format phase label cleanly (e.g. local-development -> Local Development)
  const formattedPhase = phase
    ? phase.replace(/-/g, ' ').toUpperCase()
    : 'PIPELINE STEP';

  return (
    <div
      className={`max-w-xs p-4 rounded-xl shadow-2xl transition-all border pointer-events-none z-50 ${
        isLight
          ? 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md shadow-slate-300/50'
          : 'bg-slate-900/90 border-slate-700 text-slate-100 backdrop-blur-md shadow-black/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/40">
        <span className="font-bold text-xs tracking-tight">{label}</span>
        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
          {formattedPhase}
        </span>
      </div>
      <p className="text-xs leading-relaxed opacity-90">{cardText || 'No description available for this step.'}</p>
    </div>
  );
}
