import React from 'react';
import type { Producto } from '../../types';

interface Props {
  productos: Producto[];
  onDelete: (p: Producto) => void;
}

export default function InventoryTable({ productos, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Producto</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Categoría</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Proveedor</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Compra</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Venta</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Margen</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr
                key={p.IdNegocioProducto}
                className={`border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors ${i % 2 !== 0 ? 'bg-zinc-50/30' : ''}`}
              >
                {/* Nombre + imagen */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {p.Imagen_url
                        ? <img src={p.Imagen_url} alt={p.Nombre} className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        : <span className="text-zinc-300 text-base">📦</span>
                      }
                    </div>
                    <div>
                      <p className="font-medium text-zinc-950 leading-tight max-w-[180px] truncate">{p.Nombre}</p>
                      {p.Descripcion && (
                        <p className="text-[11px] text-zinc-400 truncate max-w-[180px]">{p.Descripcion}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Categoría */}
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs rounded-full">
                    {p.NombreCategoria ?? '—'}
                  </span>
                </td>

                {/* Proveedor */}
                <td className="px-5 py-3.5 text-zinc-500 text-xs">
                  {p.NombreProveedor ?? '—'}
                </td>

                {/* Precio compra */}
                <td className="px-5 py-3.5 text-right text-zinc-500">
                  S/ {(p.PrecioCompra ?? 0).toFixed(2)}
                </td>

                {/* Precio venta */}
                <td className="px-5 py-3.5 text-right font-bold text-zinc-950">
                  S/ {(p.PrecioVenta ?? 0).toFixed(2)}
                </td>

                {/* Margen */}
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-semibold text-sm ${Number(p.MargenGanancia) > 0 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                    {p.MargenGanancia != null ? `S/ ${Number(p.MargenGanancia).toFixed(2)}` : '—'}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(p)}
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
            ))}
          </tbody>
        </table>
      </div>

      {productos.length === 0 && (
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
