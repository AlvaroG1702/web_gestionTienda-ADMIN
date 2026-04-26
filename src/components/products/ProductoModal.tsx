import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { getProveedores } from '../../services/proveedoresService';
import { getCategorias } from '../../services/categoriasService';
import type { Producto, Proveedor, Categoria } from '../../types';

interface Props {
  producto?: Producto;
  onClose:   () => void;
}

interface Form {
  Nombre:             string;
  Descripcion:        string;
  Codigo_barras:      string;
  Imagen_url:         string;
  PrecioCompra:       string;
  PrecioVenta:        string;
  PrecioPaquete:      string;
  CantidadPorPaquete: string;
  IdCategoria:        string;
  IdProveedor:        string;
}

const EMPTY: Form = {
  Nombre: '', Descripcion: '', Codigo_barras: '', Imagen_url: '',
  PrecioCompra: '', PrecioVenta: '',
  PrecioPaquete: '', CantidadPorPaquete: '',
  IdCategoria: '', IdProveedor: '',
};

export default function ProductoModal({ producto, onClose }: Props) {
  const { user }                                    = useAuth();
  const { addProducto, editProducto, reloadProductos } = useStore();
  const idNegocio = user?.IdNegocio ?? 1;

  const [form,        setForm]        = useState<Form>(EMPTY);
  const [categorias,  setCategorias]  = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const isEdit = !!producto;

  // ── Pre-rellenar si estamos editando ────────────────────────────────────────
  useEffect(() => {
    if (producto) {
      setForm({
        Nombre:             producto.Nombre,
        Descripcion:        producto.Descripcion        ?? '',
        Codigo_barras:      producto.Codigo_barras      ?? '',
        Imagen_url:         producto.Imagen_url         ?? '',
        PrecioCompra:       String(producto.PrecioCompra       ?? ''),
        PrecioVenta:        String(producto.PrecioVenta        ?? ''),
        PrecioPaquete:      String(producto.PrecioPaquete      ?? ''),
        CantidadPorPaquete: String(producto.CantidadPorPaquete ?? ''),
        IdCategoria:        String(producto.IdCategoria        ?? ''),
        IdProveedor:        String(producto.IdProveedor        ?? ''),
      });
    }
  }, [producto]);

  // ── Auto-calcular PrecioCompra en base al paquete ───────────────────────────
  useEffect(() => {
    const paquete = Number(form.PrecioPaquete);
    const cantidad = Number(form.CantidadPorPaquete);
    if (paquete > 0 && cantidad > 0) {
      const unitario = (paquete / cantidad).toFixed(2);
      if (form.PrecioCompra !== unitario) {
        setForm(f => ({ ...f, PrecioCompra: unitario }));
      }
    }
  }, [form.PrecioPaquete, form.CantidadPorPaquete]);

  // ── Cargar categorías y proveedores ─────────────────────────────────────────
  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {});
    getProveedores(idNegocio).then(setProveedores).catch(() => {});
  }, [idNegocio]);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Nombre.trim())  { setError('El nombre es requerido'); return; }
    if (!form.PrecioVenta)    { setError('El precio de venta es requerido'); return; }

    setLoading(true);
    setError('');
    try {
      const payload = {
        IdNegocio:          idNegocio,
        IdUsuario:          user?.IdUsuario,
        Nombre:             form.Nombre.trim(),
        Descripcion:        form.Descripcion        || undefined,
        Codigo_barras:      form.Codigo_barras      || undefined,
        Imagen_url:         form.Imagen_url         || undefined,
        PrecioCompra:       Number(form.PrecioCompra) || 0,
        PrecioVenta:        Number(form.PrecioVenta),
        PrecioPaquete:      form.PrecioPaquete      ? Number(form.PrecioPaquete)      : undefined,
        CantidadPorPaquete: form.CantidadPorPaquete ? Number(form.CantidadPorPaquete) : undefined,
        IdCategoria:        form.IdCategoria        ? Number(form.IdCategoria)        : undefined,
        IdProveedor:        form.IdProveedor        ? Number(form.IdProveedor)        : undefined,
      };

      if (isEdit) {
        await editProducto(producto!.IdNegocioProducto, payload);
      } else {
        await addProducto(payload);
      }

      await reloadProductos();
      onClose();
    } catch {
      setError('Error al guardar el producto');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-zinc-950 text-base">
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit ? producto?.Nombre : 'Completa los datos del producto'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text" value={form.Nombre} onChange={set('Nombre')}
              placeholder="Nombre del producto"
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Descripción</label>
            <textarea
              value={form.Descripcion} onChange={set('Descripcion')}
              placeholder="Descripción opcional..."
              rows={2}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300 resize-none"
            />
          </div>

          {/* Precios base */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Precio compra</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">S/</span>
                <input
                  type="number" step="0.01" min="0" value={form.PrecioCompra} onChange={set('PrecioCompra')}
                  placeholder="0.00"
                  className="w-full border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Precio venta <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">S/</span>
                <input
                  type="number" step="0.01" min="0" value={form.PrecioVenta} onChange={set('PrecioVenta')}
                  placeholder="0.00"
                  className="w-full border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300"
                />
              </div>
            </div>
          </div>

          {/* Compra por paquete */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 space-y-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Compra por paquete <span className="font-normal text-zinc-400">(opcional)</span></p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-500">Precio del paquete</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">S/</span>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.PrecioPaquete} onChange={set('PrecioPaquete')}
                    placeholder="0.00"
                    className="w-full border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300 bg-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-500">Unidades por paquete</label>
                <input
                  type="number" step="1" min="1"
                  value={form.CantidadPorPaquete} onChange={set('CantidadPorPaquete')}
                  placeholder="ej: 24"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300 bg-white"
                />
              </div>
            </div>
            {/* Precio unitario calculado */}
            {form.PrecioPaquete && form.CantidadPorPaquete && Number(form.CantidadPorPaquete) > 0 && (
              <div className="flex items-center gap-2 text-xs text-zinc-600 bg-white border border-zinc-200 rounded-lg px-3 py-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Precio unitario calculado: <strong className="text-zinc-900">S/ {(Number(form.PrecioPaquete) / Number(form.CantidadPorPaquete)).toFixed(2)}</strong></span>
              </div>
            )}
          </div>

          {/* Categoría y Proveedor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categoría</label>
              <select value={form.IdCategoria} onChange={set('IdCategoria')}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all text-zinc-700 bg-white"
              >
                <option value="">Sin categoría</option>
                {categorias.map(c => (
                  <option key={c.IdCategoria} value={c.IdCategoria}>{c.Nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Proveedor</label>
              <select value={form.IdProveedor} onChange={set('IdProveedor')}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all text-zinc-700 bg-white"
              >
                <option value="">Sin proveedor</option>
                {proveedores.map(p => (
                  <option key={p.IdProveedor} value={p.IdProveedor}>{p.Nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Código de barras */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Código de barras</label>
            <input
              type="text" value={form.Codigo_barras} onChange={set('Codigo_barras')}
              placeholder="EAN, UPC..."
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300"
            />
          </div>

          {/* URL de imagen */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">URL de imagen</label>
            <input
              type="url" value={form.Imagen_url} onChange={set('Imagen_url')}
              placeholder="https://..."
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all placeholder:text-zinc-300"
            />
            {form.Imagen_url && (
              <img src={form.Imagen_url} alt="preview"
                className="mt-2 w-16 h-16 rounded-lg object-cover border border-zinc-100"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Guardando...
                </>
              ) : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
