import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Producto } from '../types';

export default function AdminPanel() {
  const { productos, loadingProductos, errorProductos, reloadProductos, removeProducto } = useStore();
  const [search, setSearch] = useState('');

  const filtered = productos.filter(p =>
    p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.NombreCategoria ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = productos.reduce((sum, p) => sum + (p.PrecioVenta ?? 0), 0);

  const stats = [
    { icon: '📦', value: productos.length,                                   label: 'Total Productos' },
    { icon: '🏷️', value: new Set(productos.map(p => p.NombreCategoria)).size, label: 'Categorías' },
    { icon: '🏪', value: new Set(productos.map(p => p.NombreProveedor)).size, label: 'Proveedores' },
    {
      icon: '💰',
      value: `S/ ${totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      label: 'Valor Inventario',
    },
  ];

  const handleDelete = async (p: Producto) => {
    if (confirm(`¿Eliminar "${p.Nombre}"?`)) {
      await removeProducto(p.IdNegocioProducto);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingProductos) {
    return (
      <section className="py-24 px-[5%] flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <p className="text-sm font-medium">Cargando productos...</p>
        </div>
      </section>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (errorProductos) {
    return (
      <section className="py-24 px-[5%] flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-zinc-600 font-medium">{errorProductos}</p>
          <button
            onClick={reloadProductos}
            className="px-5 py-2 bg-zinc-950 text-white text-sm rounded-md hover:bg-zinc-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="py-24 px-[5%] bg-zinc-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="block text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 mb-2">Panel</span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold text-zinc-950 tracking-tight m-0">
              Administración
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={reloadProductos}
              title="Recargar"
              className="p-2 rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:shadow transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-sm font-semibold tracking-wide rounded-md hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl px-5 py-4 flex items-center gap-4 border border-zinc-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="font-serif text-2xl font-bold text-zinc-950 m-0 leading-tight">{stat.value}</p>
                <p className="text-[11px] text-zinc-400 tracking-widest uppercase m-0 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-zinc-200 rounded-full px-4 py-2 focus-within:border-zinc-950 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar en inventario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="outline-none border-none bg-transparent text-sm text-zinc-950 placeholder:text-zinc-300 w-52 font-sans"
            />
          </div>
          <span className="text-xs text-zinc-400 italic">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {filtered.map(p => (
            <div key={p.IdNegocioProducto} className="bg-white rounded-xl border border-zinc-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group">
              {/* Imagen */}
              <div className="h-44 bg-zinc-50 flex items-center justify-center overflow-hidden">
                {p.Imagen_url
                  ? <img src={p.Imagen_url} alt={p.Nombre} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/260x176?text=Sin+imagen'; }} />
                  : <span className="text-zinc-200 text-4xl">📦</span>
                }
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-900 text-sm leading-snug line-clamp-2">{p.Nombre}</h3>
                  <span className="shrink-0 text-xs bg-zinc-100 text-zinc-500 rounded-full px-2 py-0.5">
                    {p.NombreCategoria ?? '—'}
                  </span>
                </div>

                {p.Descripcion && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{p.Descripcion}</p>
                )}

                {/* Precios */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-400">Venta</p>
                    <p className="font-bold text-zinc-950">
                      S/ {(p.PrecioVenta ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Compra</p>
                    <p className="text-sm text-zinc-500">S/ {(p.PrecioCompra ?? 0).toFixed(2)}</p>
                  </div>
                  {p.MargenGanancia != null && (
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Margen</p>
                      <p className="text-sm font-semibold text-emerald-600">S/ {Number(p.MargenGanancia).toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {p.NombreProveedor && (
                  <p className="text-[11px] text-zinc-300 mt-2 truncate">🚛 {p.NombreProveedor}</p>
                )}

                {/* Acciones */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 text-xs py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="flex-1 text-xs py-1.5 rounded-md border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>
    </section>
  );
}
