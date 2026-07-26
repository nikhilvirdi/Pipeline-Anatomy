import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function ProcessNode({ id, data }) {
  const { label, icons, mirroredStyle, theme } = data;
  const glassClass = theme === 'light' ? 'glass-card-light' : 'glass-card-dark';
  const { dimClass, accentClass } = useNodeHighlight(id);

  const handleBg = data?.isLoopback ? '!bg-[#f87171]' : '!bg-accent';

  return (
    <div
      className={`px-5 py-4 min-w-[190px] max-w-[280px] text-center transition-all ${
        mirroredStyle || glassClass
      } ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position={Position.Left} id="left" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default`} />
      <Handle type="target" position={Position.Top} id="top" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default ${id === 'monitoring-observability' ? '' : 'opacity-0 pointer-events-none'}`} />
      <Handle type="target" position={Position.Bottom} id="bottom" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default ${id === 'cd-system' || id === 'commit-push-code' || id === 'local-testing' ? '' : 'opacity-0 pointer-events-none'}`} />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1.5">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="node-icon" className="w-6 h-6 object-contain" />
          ))}
        </div>
      )}
      <div className="text-[15px] font-bold leading-snug select-none">{label}</div>
      <Handle type="source" position={Position.Right} id="right" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default`} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default ${id === 'end-users' ? '' : 'opacity-0 pointer-events-none'}`} />
    </div>
  );
}
