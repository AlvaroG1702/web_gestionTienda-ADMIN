import React from 'react';

type SortBy = 'name' | 'price' | 'stock';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  sortBy: SortBy;
  onSort: (value: SortBy) => void;
  count: number;
  onAdd: () => void;
}

export default function ProductsToolbar({ search, onSearch, sortBy, onSort, count, onAdd }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus-within:border-zinc-950 focus-within:shadow-sm transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="outline-none bg-transparent text-sm text-zinc-950 placeholder:text-zinc-300 w-48 font-sans"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => onSort(e.target.value as SortBy)}
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-700 outline-none cursor-pointer hover:border-zinc-950 transition-colors"
        >
          <option value="name">Nombre A–Z</option>
          <option value="price">Mayor precio</option>
          <option value="stock">Menor stock</option>
        </select>

        <span className="text-xs text-zinc-400">
          {count} producto{count !== 1 ? 's' : ''}
        </span>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo Producto
      </button>
    </div>
  );
}
