import React from 'react';
import { Handle } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';
import { getHandlePositions } from '../../utils/handlePositions';

export default function ActorNode({ id, data }) {
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
      className={`px-6 py-4 rounded-[6px] border text-center flex flex-col items-center gap-1.5 min-w-[160px] transition-all bg-node border-node text-primary ${dimClass} ${accentClass}`}
    >
      {icons && icons.length > 0 ? (
        <img src={icons[0]} alt="actor" className="w-10 h-10 object-contain" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_20%,transparent)] flex items-center justify-center text-accent-primary font-bold text-xl">
          👤
        </div>
      )}
      <div className="text-[15px] font-sans font-medium select-none">{label}</div>
      <Handle type="source" position="right" id="right" isConnectable={false} className={getHandleClass('right')} />
      <Handle type="source" position="bottom" id="source-bottom" isConnectable={false} className={getHandleClass('source-bottom')} />
    </div>
  );

}
