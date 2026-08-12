import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function ProcessNode({ id, data }) {
  const { label, icons } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);

  // Default node handles are muted text gray
  const handleBg = '!bg-text-muted border-none';

  return (
    <div
      className={`px-5 py-4 min-w-[190px] max-w-[280px] text-center transition-all bg-node border border-node ${dimClass} ${accentClass}`}
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
      <div className="text-[15px] font-sans font-medium leading-snug select-none">{label}</div>
      <Handle type="source" position={Position.Right} id="right" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default`} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={false} className={`${handleBg} w-3 h-3 cursor-default ${id === 'end-users' ? '' : 'opacity-0 pointer-events-none'}`} />
    </div>
  );
}
