import React from 'react';
import { Handle } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';
import { getHandlePositions } from '../../utils/handlePositions';

export default function TerminalNode({ id, data }) {
  const { label, icons, orientation } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);
  const handles = getHandlePositions(orientation);

  const getHandleClass = (handleId) => {
    const isUsed = data?.usedHandles?.[handleId];
    return isUsed
      ? '!bg-text-muted border-none w-2.5 h-2.5 cursor-default'
      : '!opacity-0 !w-0 !h-0 !border-none !p-0 pointer-events-none';
  };

  return (
    <div
      className={`px-8 py-3.5 rounded-full border text-center transition-all bg-node border-node ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position="left" id="left" isConnectable={false} className={getHandleClass('left')} />
      <Handle type="target" position="top" id="top" isConnectable={false} className={getHandleClass('top')} />
      <Handle type="target" position="bottom" id="bottom" isConnectable={false} className={getHandleClass('bottom')} />
      <Handle type="target" position="right" id="target-right" isConnectable={false} className={getHandleClass('target-right')} />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="terminal-icon" className="w-6 h-6 object-contain" />
          ))}
        </div>
      )}
      <div className="text-[15px] font-sans font-medium select-none leading-tight text-primary">{label}</div>
      <Handle type="source" position="right" id="right" isConnectable={false} className={getHandleClass('right')} />
      <Handle type="source" position="top" id="source-top" isConnectable={false} className={getHandleClass('source-top')} />
      <Handle type="source" position="bottom" id="source-bottom" isConnectable={false} className={getHandleClass('source-bottom')} />
      <Handle type="source" position="left" id="source-left" isConnectable={false} className={getHandleClass('source-left')} />
    </div>
  );

}

