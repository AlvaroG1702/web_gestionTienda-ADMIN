import React, { useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  adminMode?: boolean;
}

export default function ProductCard({ product, onEdit, adminMode }: ProductCardProps) {
  const { addToCart, deleteProduct } = useStore();
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-zinc-100 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        {discount && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-zinc-950 text-white text-[10px] font-bold tracking-widest rounded-sm">
            -{discount}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-white text-red-600 text-[10px] font-bold border border-red-200 rounded-sm">
            Solo {product.stock} quedan
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-zinc-400 text-white text-[10px] font-bold rounded-sm">
            Agotado
          </span>
        )}

        <img
          src={imgErr ? 'https://via.placeholder.com/600x600/f0f0f0/aaa?text=Oruel' : product.image}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-end justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!adminMode ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 rounded-md text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200
                ${added
                  ? 'bg-zinc-950 text-white'
                  : 'bg-white text-zinc-950 hover:bg-zinc-950 hover:text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Agregado
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Agregar al carrito
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                onClick={() => onEdit?.(product)}
                className="flex-1 py-2.5 bg-white text-zinc-950 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-100 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="flex-1 py-2.5 bg-zinc-950 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1 px-5 py-4">
        <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-zinc-400">{product.category}</span>
        <h3 className="text-sm font-bold text-zinc-950 leading-snug mt-0.5">{product.name}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed flex-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-zinc-950">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-zinc-300 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
