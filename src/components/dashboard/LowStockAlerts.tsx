import React from 'react';
import type { Product } from '../../types';

interface Props {
  products: Product[];
}

export default function LowStockAlerts({ products }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <h2 className="text-sm font-semibold text-zinc-950 mb-1">Alertas de Stock</h2>
      <p className="text-xs text-zinc-400 mb-4">Productos con 5 o menos unidades disponibles</p>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-sm mt-2">Todo el stock está en buen nivel</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map(p => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-950 leading-tight">{p.name}</p>
                  <p className="text-[11px] text-zinc-400">{p.category}</p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {p.stock === 0 ? 'Sin stock' : `${p.stock} uds.`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
