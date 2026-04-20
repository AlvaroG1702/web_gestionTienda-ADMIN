import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/products';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductsSection() {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="products" className="py-24 px-[5%] bg-zinc-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="block text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 mb-2">
              Catálogo
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold text-zinc-950 tracking-tight m-0">
              Nuestros Productos
            </h2>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-zinc-200 rounded-full px-4 py-2 focus-within:border-zinc-950 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="outline-none border-none bg-transparent text-sm text-zinc-950 placeholder:text-zinc-300 w-52 font-sans"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide border-[1.5px] transition-all duration-200 cursor-pointer
                ${activeCategory === cat
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-300">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sm text-zinc-400">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {editingProduct && (
        <ProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}
    </section>
  );
}
