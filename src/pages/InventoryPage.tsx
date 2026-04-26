import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useStore } from '../context/StoreContext';
import ProductsToolbar from '../components/products/ProductsToolbar';
import ProductoModal from '../components/products/ProductoModal';
import type { Producto } from '../types';

export default function InventoryPage() {
  const {
    filtered,
    search,
    setSearch,
    sortBy,
    setSortBy,
    modalOpen,
    editingProduct,
    handleEdit,
    handleAdd,
    handleClose,
  } = useProducts();

  const { editProducto, loadingProductos, errorProductos, reloadProductos } = useStore();

  const handleToggleEstado = async (p: Producto) => {
    const nuevoEstado = !p.Estado;
    await editProducto(p.IdNegocioProducto, {
      ...p,
      IdNegocio: 1, // ID_NEGOCIO por defecto
      PrecioCompra: p.PrecioCompra ?? 0,
      PrecioVenta: p.PrecioVenta ?? 0,
      Estado: nuevoEstado,
    });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingProductos) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <svg className="animate-spin w-7 h-7 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Cargando inventario...
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (errorProductos) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-zinc-500">{errorProductos}</p>
        <button onClick={reloadProductos} className="px-5 py-2 bg-zinc-950 text-white text-sm rounded-lg">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductsToolbar
        search={search}
        onSearch={setSearch}
        sortBy={sortBy}
        onSort={setSortBy}
        count={filtered.length}
        onAdd={handleAdd}
      />

      {/* Tabla de inventario */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        {/* Header tabla */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center px-5 py-3 bg-zinc-50 border-b border-zinc-100 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          <span>Producto</span>
          <span>Categoría</span>
          <span className="text-right">Compra</span>
          <span className="text-right">Venta</span>
          <span className="text-right">Margen</span>
          <span />
        </div>

        {/* Filas */}
        {filtered.map((p, i) => (
          <div
            key={p.IdNegocioProducto}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center px-5 py-3.5 gap-4 hover:bg-zinc-50 transition-colors ${
              i < filtered.length - 1 ? 'border-b border-zinc-50' : ''
            }`}
          >
            {/* Nombre + imagen */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden">
                {p.Imagen_url
                  ? <img src={p.Imagen_url} alt={p.Nombre} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=?'; }} />
                  : <span className="w-full h-full flex items-center justify-center text-zinc-300 text-lg">📦</span>
                }
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 text-sm truncate">{p.Nombre}</p>
                {p.NombreProveedor && (
                  <p className="text-[11px] text-zinc-400 truncate">🚛 {p.NombreProveedor}</p>
                )}
              </div>
            </div>

            {/* Categoría */}
            <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs rounded-full truncate max-w-[120px]">
              {p.NombreCategoria ?? '—'}
            </span>

            {/* Precio compra */}
            <span className="text-right text-sm text-zinc-500">
              S/ {(p.PrecioCompra ?? 0).toFixed(2)}
            </span>

            {/* Precio venta */}
            <span className="text-right text-sm font-bold text-zinc-950">
              S/ {(p.PrecioVenta ?? 0).toFixed(2)}
            </span>

            {/* Margen */}
            <span className={`text-right text-sm font-semibold ${
              Number(p.MargenGanancia) > 0 ? 'text-emerald-600' : 'text-zinc-400'
            }`}>
              {p.MargenGanancia != null ? `S/ ${Number(p.MargenGanancia).toFixed(2)}` : '—'}
            </span>

            {/* Acciones */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleEdit(p)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                title="Editar"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                onClick={() => handleToggleEstado(p)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none ml-2 ${
                  p.Estado ? 'bg-emerald-500' : 'bg-zinc-200 hover:bg-zinc-300'
                }`}
                title={p.Estado ? 'Desactivar producto' : 'Activar producto'}
              >
                <span className="sr-only">Activar/Desactivar producto</span>
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    p.Estado ? 'translate-x-2' : '-translate-x-2'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}

        {/* Vacío */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sm mt-3">No se encontró inventario</p>
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <ProductoModal
          producto={editingProduct}
          onClose={handleClose}
        />
      )}
    </>
  );
}
