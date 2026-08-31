import React, { useState } from 'react';

const PLACEMENT = {
  left: 'left-full top-0 ml-2.5',
  right: 'right-full top-0 mr-2.5',
  top: 'top-full left-0 mt-2.5',
  bottom: 'bottom-full left-0 mb-2.5',
};

/**
 * Compact dropdown popover menu for PNG and SVG exports.
 * Anchored directly to the export toolbar button for exact alignment.
 * For SVG export, provides a follow-up background choice (theme match vs transparent).
 */
export default function ExportMenu({
  edge = 'left',
  theme,
  onExportPng,
  onExportSvg,
  onClose,
}) {
  const [step, setStep] = useState('format'); // 'format' | 'svg-bg'
  const isLight = theme === 'light';

  const handleSelectPng = (e) => {
    e.stopPropagation();
    onExportPng?.();
    onClose?.();
  };

  const handleSelectSvgFormat = (e) => {
    e.stopPropagation();
    setStep('svg-bg');
  };

  const handleSelectSvgThemeBg = (e) => {
    e.stopPropagation();
    onExportSvg?.('theme');
    onClose?.();
  };

  const handleSelectSvgTransparentBg = (e) => {
    e.stopPropagation();
    onExportSvg?.('transparent');
    onClose?.();
  };

  return (
    <div
      className={`absolute z-50 whitespace-nowrap min-w-[145px] p-1 rounded-lg select-none shadow-xl border backdrop-blur-md transition-all
        ${PLACEMENT[edge] || PLACEMENT.left}
        ${
          isLight
            ? 'bg-white/95 border-[#d0d0d0] text-[#1a1a1a] shadow-black/10'
            : 'bg-[#161616]/95 border-[#3a3a3a] text-[#f0f0f0] shadow-black/60'
        }`}
      style={{ cursor: 'default' }}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-col gap-0.5">
        {step === 'format' ? (
          <>
            <button
              type="button"
              onClick={handleSelectPng}
              className={`flex items-center w-full px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors text-left cursor-pointer
                ${isLight ? 'hover:bg-black/5 text-[#1a1a1a]' : 'hover:bg-white/10 text-[#f0f0f0]'}`}
            >
              Export as PNG
            </button>

            <button
              type="button"
              onClick={handleSelectSvgFormat}
              className={`flex items-center justify-between w-full px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors text-left cursor-pointer
                ${isLight ? 'hover:bg-black/5 text-[#1a1a1a]' : 'hover:bg-white/10 text-[#f0f0f0]'}`}
            >
              <span>Export as SVG</span>
              <span className="text-[10px] opacity-60 ml-1.5">›</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSelectSvgThemeBg}
              className={`flex items-center w-full px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors text-left cursor-pointer
                ${isLight ? 'hover:bg-black/5 text-[#1a1a1a]' : 'hover:bg-white/10 text-[#f0f0f0]'}`}
            >
              Match current theme
            </button>

            <button
              type="button"
              onClick={handleSelectSvgTransparentBg}
              className={`flex items-center w-full px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors text-left cursor-pointer
                ${isLight ? 'hover:bg-black/5 text-[#1a1a1a]' : 'hover:bg-white/10 text-[#f0f0f0]'}`}
            >
              Transparent
            </button>
          </>
        )}
      </div>
    </div>
  );
}
