import React from 'react';
import { Handle } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';
import { getHandlePositions } from '../../utils/handlePositions';

export default function ActorNode({ id, data }) {
  const { label, icons, theme, orientation } = data;
  const isLight = theme === 'light';
  const { dimClass, accentClass } = useNodeHighlight(id);
  const handles = getHandlePositions(orientation);

  return (
    <div
      className={`px-6 py-4 rounded-xl border-2 border-emerald-400 text-center shadow-lg flex flex-col items-center gap-1.5 min-w-[160px] transition-all ${
        isLight ? 'bg-emerald-50/80 text-emerald-950 backdrop-blur-md' : 'bg-slate-900/80 text-emerald-200 backdrop-blur-md'
      } ${dimClass} ${accentClass}`}
    >
      {icons && icons.length > 0 ? (
        <img src={icons[0]} alt="actor" className="w-10 h-10 object-contain" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold text-xl">
          👤
        </div>
      )}
      <div className="text-[15px] font-extrabold select-none">{label}</div>
      <Handle type="source" position={handles.source} isConnectable={false} className="!bg-emerald-400 w-3 h-3 cursor-default" />
    </div>
  );
}
