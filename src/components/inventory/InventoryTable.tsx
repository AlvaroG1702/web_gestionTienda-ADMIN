import React from 'react';
import type { Product } from '../../types';
import type { StockStatus } from '../../hooks/useInventory';

interface Props {
  products: Product[];
  stockStatus: (stock: number) => StockStatus;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function InventoryTable({ products, stockStatus, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Producto</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Categoría</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Precio</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Stock</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Estado</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Destacado</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const status = stockStatus(product.stock);
              return (
                <tr
                  key={product.id}
                  className={`border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-50/30'}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-zinc-950 leading-tight max-w-[160px] truncate">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">{product.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-zinc-950">
                    ${product.price.toLocaleString('es')}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-zinc-700">{product.stock}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${status.cls}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {product.featured ? (
                      <span className="text-amber-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-zinc-200">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-300">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-sm mt-3">Sin resultados</p>
        </div>
      )}
    </div>
  );
}
