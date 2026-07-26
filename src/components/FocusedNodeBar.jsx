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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-md transition-all ${
        isLight
          ? 'bg-white/90 border-slate-200 shadow-slate-300/60'
          : 'bg-slate-900/90 border-slate-700 shadow-black/70'
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Focused indicator dot */}
      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />

      {/* Node label */}
      <span
        className={`text-xs font-semibold truncate max-w-[220px] ${
          isLight ? 'text-slate-700' : 'text-slate-200'
        }`}
      >
        {label}
      </span>

      {/* Divider */}
      <span
        className={`w-px h-4 ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}
      />

      {/* Copy-link button */}
      <button
        type="button"
        id="copy-node-link-btn"
        aria-label="Copy link to this node"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 ${
          copied
            ? 'text-accent'
            : isLight
            ? 'text-slate-500 hover:text-slate-800'
            : 'text-slate-400 hover:text-slate-100'
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
