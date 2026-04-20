import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { cartCount } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '#hero', label: 'Inicio' },
    { href: '#products', label: 'Productos' },
    { href: '#about', label: 'Nosotros' },
    { href: '#contact', label: 'Contacto' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[70px] flex items-center justify-between gap-8">

          {/* Logo */}
          <a href="#hero" className="font-serif text-2xl font-bold tracking-[0.15em] text-zinc-950 no-underline hover:opacity-70 transition-opacity">
            ORUEL
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex list-none gap-10 m-0 p-0">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="nav-link">{label}</a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrito"
              className="relative p-2 rounded-full text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="animate-pop absolute top-0.5 right-0.5 w-4 h-4 bg-zinc-950 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 flex flex-col gap-1.5 items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60' : 'max-h-0'} border-t border-zinc-100`}>
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3.5 text-sm font-medium text-zinc-700 border-b border-zinc-50 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
