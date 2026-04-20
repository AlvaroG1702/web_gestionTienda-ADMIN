import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/products';

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
}

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  description: '',
  category: categories[1],
  image: '',
  stock: '',
  featured: false,
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addProduct, editProduct } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        description: product.description,
        category: product.category,
        image: product.image,
        stock: String(product.stock),
        featured: product.featured ?? false,
      });
    }
  }, [product]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Ingresa un precio válido';
    if (!form.description.trim()) e.description = 'La descripción es requerida';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Ingresa un stock válido';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      description: form.description.trim(),
      category: form.category,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      stock: Number(form.stock),
      featured: form.featured,
    };

    if (product) editProduct(product.id, data);
    else addProduct(data);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputClass = (field?: string) =>
    `w-full px-3.5 py-2.5 border-[1.5px] rounded-md text-sm text-zinc-950 bg-zinc-50 outline-none font-sans transition-colors focus:border-zinc-950 focus:bg-white ${errors[field ?? ''] ? 'border-red-400' : 'border-zinc-200'}`;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.2)] animate-fade-up">

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-8 py-5 border-b border-zinc-100 z-10">
          <h2 className="font-serif text-2xl font-bold text-zinc-950 m-0">
            {product ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

          {/* Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Nombre *</label>
              <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Ej: Reloj Minimalista" className={inputClass('name')} />
              {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Categoría</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={inputClass()}>
                {categories.filter(c => c !== 'Todos').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Precio *</label>
              <div className={`flex items-center border-[1.5px] rounded-md overflow-hidden transition-colors focus-within:border-zinc-950 focus-within:bg-white ${errors.price ? 'border-red-400' : 'border-zinc-200'} bg-zinc-50`}>
                <span className="px-3 py-2.5 text-sm font-semibold text-zinc-500 bg-zinc-100 border-r border-zinc-200">$</span>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-zinc-950" />
              </div>
              {errors.price && <span className="text-[11px] text-red-500">{errors.price}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Precio Original</label>
              <div className="flex items-center border-[1.5px] border-zinc-200 rounded-md overflow-hidden bg-zinc-50 focus-within:border-zinc-950 focus-within:bg-white transition-colors">
                <span className="px-3 py-2.5 text-sm font-semibold text-zinc-500 bg-zinc-100 border-r border-zinc-200">$</span>
                <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => handleChange('originalPrice', e.target.value)} placeholder="0.00" className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-zinc-950" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Stock *</label>
              <input type="number" min="0" value={form.stock} onChange={e => handleChange('stock', e.target.value)} placeholder="0" className={inputClass('stock')} />
              {errors.stock && <span className="text-[11px] text-red-500">{errors.stock}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">Descripción *</label>
            <textarea rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Describe el producto brevemente..." className={`${inputClass('description')} resize-y`} />
            {errors.description && <span className="text-[11px] text-red-500">{errors.description}</span>}
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">URL de Imagen</label>
            <input type="url" value={form.image} onChange={e => handleChange('image', e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" className={inputClass()} />
            <span className="text-[11px] text-zinc-400">Deja en blanco para usar imagen por defecto</span>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2.5">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)} className="w-4 h-4 cursor-pointer accent-zinc-950" />
            <label htmlFor="featured" className="text-sm text-zinc-600 cursor-pointer">Producto destacado</label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-medium border-[1.5px] border-zinc-200 text-zinc-500 rounded-md hover:border-zinc-950 hover:text-zinc-950 transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-7 py-2.5 text-xs font-semibold tracking-wider bg-zinc-950 text-white rounded-md hover:bg-zinc-700 hover:-translate-y-0.5 transition-all cursor-pointer">
              {product ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
