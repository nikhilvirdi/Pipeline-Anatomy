import React from 'react';
import { Handle } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';
import { getHandlePositions } from '../../utils/handlePositions';

export default function TerminalNode({ id, data }) {
  const { label, icons, mirroredStyle, theme, orientation } = data;
  const isLight = theme === 'light';
  const { dimClass, accentClass } = useNodeHighlight(id);
  const handles = getHandlePositions(orientation);

  const defaultStyle = isLight
    ? 'bg-emerald-100/70 border-emerald-500 text-emerald-950 backdrop-blur-md'
    : 'bg-emerald-950/60 border-emerald-400 text-emerald-200 backdrop-blur-md';

  const handleBg = data?.isLoopback ? '!bg-[#f87171]' : '!bg-accent';

  return (
    <div
      className={`px-8 py-3.5 rounded-full border-2 text-center shadow-md transition-all ${
        mirroredStyle || defaultStyle
      } ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position={handles.target} isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default`} />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="terminal-icon" className="w-6 h-6 object-contain" />
          ))}
        </div>
      )}
      <div className="text-[15px] font-bold select-none leading-tight">{label}</div>
      <Handle type="source" position={handles.source} isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default`} />
    </div>
  );
}
