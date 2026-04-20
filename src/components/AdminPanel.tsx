import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function AdminPanel() {
  const { products } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    { icon: '📦', value: products.length, label: 'Total Productos' },
    { icon: '⭐', value: products.filter(p => p.featured).length, label: 'Destacados' },
    { icon: '⚠️', value: products.filter(p => p.stock <= 5).length, label: 'Stock Bajo' },
    { icon: '💰', value: `$${totalValue.toLocaleString('es', { maximumFractionDigits: 0 })}`, label: 'Valor Inventario' },
  ];

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
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-sm font-semibold tracking-wide rounded-md hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar Producto
          </button>
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
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} adminMode />
          ))}
        </div>
      </div>

      {modalOpen && <ProductModal product={editingProduct} onClose={handleClose} />}
    </section>
  );
}
