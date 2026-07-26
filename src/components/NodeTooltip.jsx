import React from 'react';

export default function NodeTooltip({ node, theme }) {
  if (!node || !node.data) return null;

  const { label, title, phase, cardText, bullets } = node.data;
  const isLight = theme === 'light';

  // Format phase label cleanly (e.g. local-development -> LOCAL DEVELOPMENT)
  const formattedPhase = phase
    ? phase.replace(/-/g, ' ').toUpperCase()
    : 'PIPELINE STEP';

  const cardTitle = title || label;
  const isPhaseCard = bullets && bullets.length > 0;

  return (
    <div
      className={`max-w-md p-4 rounded-xl shadow-2xl transition-all border pointer-events-none z-50 ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md shadow-slate-300/50'
          : 'bg-slate-900/95 border-slate-700 text-slate-100 backdrop-blur-md shadow-black/80'
      }`}
    >
      {/* Header row: title + phase badge */}
      <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-700/40">
        <span className="font-bold text-sm tracking-tight">{cardTitle}</span>
        {/* Phase badge — hidden on phase cards (title is self-describing) */}
        {!isPhaseCard && (
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 shrink-0">
            {formattedPhase}
          </span>
        )}
      </div>

      {/* Body: bulleted list for phase cards, paragraph for node cards */}
      {isPhaseCard ? (
        <ul className="text-xs leading-relaxed space-y-1.5 list-disc pl-4 opacity-90">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="leading-normal">
              {bullet}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs leading-relaxed opacity-90">
          {cardText || 'No description available for this step.'}
        </p>
      )}
    </div>
  );
}
