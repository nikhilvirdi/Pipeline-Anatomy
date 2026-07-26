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
      className={`px-5 py-3 rounded-xl border-2 border-emerald-400 text-center shadow-lg flex flex-col items-center gap-1.5 min-w-[130px] transition-all ${
        isLight ? 'bg-emerald-50/80 text-emerald-950 backdrop-blur-md' : 'bg-slate-900/80 text-emerald-200 backdrop-blur-md'
      } ${dimClass} ${accentClass}`}
    >
      {icons && icons.length > 0 ? (
        <img src={icons[0]} alt="actor" className="w-8 h-8 object-contain" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold">
          👤
        </div>
      )}
      <div className="text-xs font-bold select-none">{label}</div>
      <Handle type="source" position={handles.source} isConnectable={false} className="!bg-emerald-400 w-2.5 h-2.5 cursor-default" />
    </div>
  );
}
