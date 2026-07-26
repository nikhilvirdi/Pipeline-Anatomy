import React, { useEffect, useMemo, useRef, useState } from 'react';

import ToolbarPopover from './ToolbarPopover';

const MAX_RESULTS = 8;

/**
 * Type a node name to jump to it. `nodes` is already filtered to what the phase
 * filter leaves visible, so search can never jump to a hidden node.
 */
export default function SearchPanel({ edge, theme, nodes, onJump, onClose }) {
  const isLight = theme === 'light';
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return nodes
      .filter(
        (node) =>
          node.label.toLowerCase().includes(term) ||
          node.id.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        // Prefix matches first — typing "run" should surface "Run Unit Tests"
        // ahead of nodes that merely contain the word.
        const aStarts = a.label.toLowerCase().startsWith(term) ? 0 : 1;
        const bStarts = b.label.toLowerCase().startsWith(term) ? 0 : 1;
        return aStarts - bStarts || a.label.localeCompare(b.label);
      })
      .slice(0, MAX_RESULTS);
  }, [nodes, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const jumpTo = (node) => {
    if (!node) return;
    onJump(node.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      jumpTo(results[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  const inputClass = isLight
    ? 'bg-black/5 border-black/10 placeholder:text-slate-500'
    : 'bg-white/5 border-white/10 placeholder:text-slate-400';

  return (
    <ToolbarPopover edge={edge} theme={theme} title="Search" onClose={onClose}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-label="Search nodes by name"
        value={query}
        placeholder="Node name…"
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none
          focus:border-accent/60 focus:ring-1 focus:ring-accent/40 ${inputClass}`}
      />

      {query.trim() && results.length === 0 && (
        <p className="mt-2 px-1 text-[11px] opacity-60">No matching nodes.</p>
      )}

      {results.length > 0 && (
        <ul role="listbox" className="mt-2 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
          {results.map((node, index) => (
            <li key={node.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => jumpTo(node)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors
                  ${index === activeIndex
                    ? 'bg-accent/20 text-accent'
                    : isLight
                      ? 'hover:bg-black/5'
                      : 'hover:bg-white/5'}`}
              >
                <span className="block text-xs leading-snug">{node.label}</span>
                <span className="block text-[10px] opacity-50 mt-0.5">
                  {node.phase.replace(/-/g, ' ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </ToolbarPopover>
  );
}
