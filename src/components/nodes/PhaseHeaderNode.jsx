import React from 'react';

export default function PhaseHeaderNode({ data }) {
  const { label } = data;

  return (
    <div className="w-[2800px] select-none pointer-events-auto mb-4">
      <div className="flex items-center gap-3 cursor-pointer inline-flex">
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
