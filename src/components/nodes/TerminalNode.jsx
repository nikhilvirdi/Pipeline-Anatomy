import React from 'react';
import { Handle } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';
import { getHandlePositions } from '../../utils/handlePositions';

export default function TerminalNode({ id, data }) {
  const { label, icons, orientation } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);
  const handles = getHandlePositions(orientation);

  const isSuccess = id === 'notify-team-success';
  const isFail = id === 'notify-developer-team';
  
  const bgClass = isSuccess ? 'bg-[color-mix(in_srgb,var(--accent-success)_15%,transparent)] border-[color-mix(in_srgb,var(--accent-success)_30%,transparent)]' : 'bg-node border-node';
  const textClass = 'text-primary';

  const handleBg = isSuccess ? '!bg-accent-success' : isFail ? '!bg-accent-error' : '!bg-text-muted';

  return (
    <div
      className={`px-8 py-3.5 rounded-full border text-center transition-all ${
        bgClass
      } ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position={handles.target} isConnectable={false} className={`${handleBg} border-none w-3 h-3 cursor-default`} />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="terminal-icon" className="w-6 h-6 object-contain" />
          ))}
        </div>
      )}
      <div className={`text-[15px] font-sans font-medium select-none leading-tight ${textClass}`}>{label}</div>
      <Handle type="source" position={handles.source} isConnectable={false} className={`${handleBg} border-none w-3 h-3 cursor-default`} />
    </div>
  );
}
