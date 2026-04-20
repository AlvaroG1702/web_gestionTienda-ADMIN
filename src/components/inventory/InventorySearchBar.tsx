import React from 'react';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  count: number;
}

export default function InventorySearchBar({ search, onSearch, count }: Props) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus-within:border-zinc-950 transition-all flex-1 max-w-xs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar en inventario..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="outline-none bg-transparent text-sm text-zinc-950 placeholder:text-zinc-300 w-full font-sans"
        />
      </div>
      <span className="text-xs text-zinc-400 ml-2">{count} productos</span>
    </div>
  );
}
