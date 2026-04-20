import React from 'react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useStore();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 bottom-0 z-[70] w-[420px] max-w-full bg-white flex flex-col shadow-2xl transition-transform duration-350 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-zinc-100">
          <h2 className="font-serif text-2xl font-bold text-zinc-950">Carrito</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-300">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-sm text-zinc-400">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-7 py-4 flex flex-col gap-5">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 items-start pb-5 border-b border-zinc-50 last:border-0">
                  <img src={product.image} alt={product.name} className="w-[72px] h-[72px] object-cover rounded-lg flex-shrink-0 bg-zinc-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-950 mb-1 truncate">{product.name}</h4>
                    <p className="text-sm text-zinc-500 mb-2">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-base text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all leading-none"
                      >−</button>
                      <span className="text-sm font-semibold text-zinc-950 min-w-[20px] text-center">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-base text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all leading-none"
                      >+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-zinc-300 hover:text-zinc-950 transition-colors mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-zinc-100 flex flex-col gap-3">
              <div className="flex justify-between text-base font-bold text-zinc-950">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="w-full py-3.5 bg-zinc-950 text-white text-xs font-semibold tracking-widest uppercase rounded hover:bg-zinc-700 transition-colors">
                Proceder al Pago
              </button>
              <button onClick={clearCart} className="w-full py-3 border border-zinc-200 text-zinc-400 text-xs font-medium tracking-widest uppercase rounded hover:border-zinc-950 hover:text-zinc-950 transition-all">
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
