/**
 * FocusedNodeBar
 *
 * A small floating bar that appears at the bottom-centre of the screen when
 * a node is click-focused. Houses the copy-link action so it never appears
 * on passive hover — only when the user has explicitly clicked a node.
 */
import React, { useState, useCallback } from 'react';

export default function FocusedNodeBar({ label, theme }) {
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all ${
        isLight
          ? 'bg-white/95 border-[#d0d0d0] text-[#1a1a1a] shadow-black/10'
          : 'bg-[#161616]/95 border-[#3a3a3a] text-[#f0f0f0] shadow-black/60'
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Focused indicator dot */}
      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />

      {/* Node label */}
      <span
        className={`text-xs font-sans font-semibold truncate max-w-[220px] ${
          isLight ? 'text-[#1a1a1a]' : 'text-[#f0f0f0]'
        }`}
      >
        {label}
      </span>

      {/* Divider */}
      <span
        className={`w-px h-4 ${isLight ? 'bg-[#d0d0d0]' : 'bg-[#3a3a3a]'}`}
      />

      {/* Copy-link button */}
      <button
        type="button"
        id="copy-node-link-btn"
        aria-label="Copy link to this node"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 text-xs font-sans font-semibold transition-colors duration-150 ${
          copied
            ? 'text-accent'
            : isLight
            ? 'text-[#6a6a6a] hover:text-[#1a1a1a]'
            : 'text-[#8a8a8a] hover:text-[#f0f0f0]'
        }`}
      >

        {copied ? (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.5 6L4.5 9L10.5 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 6.5a3 3 0 0 0 4.243 0l1.5-1.5a3 3 0 0 0-4.243-4.243L5.75 2M7 5.5a3 3 0 0 0-4.243 0l-1.5 1.5a3 3 0 0 0 4.243 4.243L6.25 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
