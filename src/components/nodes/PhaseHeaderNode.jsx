import React from 'react';

export default function PhaseHeaderNode({ data }) {
  const { label, step, theme } = data;
  const isLight = theme === 'light';

  return (
    <div className="w-[2800px] select-none pointer-events-auto mb-4">
      <div className="flex items-center gap-3 cursor-pointer inline-flex">
        <span
          className={`px-4 py-1.5 rounded-md text-lg font-black tracking-widest uppercase border shadow-md ${
            isLight
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
          }`}
        >
          {step || 'PHASE'}
        </span>
        <h2
          className={`text-3xl font-black tracking-wider uppercase ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}
        >
          {label}
        </h2>
        <div
          className={`flex-1 h-[2px] rounded-full ${
            isLight
              ? 'bg-gradient-to-r from-emerald-400/50 via-slate-300 to-transparent'
              : 'bg-gradient-to-r from-emerald-500/40 via-slate-700 to-transparent'
          }`}
        />
      </div>
    </div>
  );
}
