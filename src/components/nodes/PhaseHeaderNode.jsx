import React from 'react';

export default function PhaseHeaderNode({ data }) {
  const { label, step, orientation } = data;

  return (
    <div className={`${orientation === 'vertical' ? 'w-[320px]' : 'w-[2800px]'} select-none pointer-events-auto mb-4`}>
      <div className="flex items-center gap-3 cursor-pointer inline-flex">
        <span
          className="px-4 py-1.5 rounded-[3px] text-lg font-serif font-semibold tracking-widest uppercase border shadow-sm bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] border-[color-mix(in_srgb,var(--accent-primary)_30%,transparent)] text-accent-primary"
        >
          {step || 'PHASE'}
        </span>
        <h2
          className="text-3xl font-serif font-semibold tracking-wider uppercase text-primary"
        >
          {label}
        </h2>
        <div
          className="flex-1 h-[2px] rounded-full bg-gradient-to-r from-[color-mix(in_srgb,var(--accent-primary)_40%,transparent)] via-border-node to-transparent"
        />
      </div>
    </div>
  );
}

