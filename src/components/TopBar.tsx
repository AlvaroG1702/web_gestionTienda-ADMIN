import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import PrintDrawer from './PrintDrawer';

interface TopBarProps {
  activeView: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const viewLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Gestión de Productos',
  inventory: 'Gestión de Inventario',
  proveedores: 'Proveedores',
  orders: 'Pedidos',
  analytics: 'Analíticas',
  settings: 'Ajustes',
};

export default function TopBar({ activeView, sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const { user, logout } = useAuth();
  const { productos, printQueueCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user?.Nombre
    ? user.Nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-[64px]
        bg-white border-b border-zinc-100
        flex items-center justify-between px-6 gap-4
        transition-all duration-300
        ${sidebarCollapsed ? 'left-[70px]' : 'left-[240px]'}
      `}
    >
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-400">
            {user?.NombreNegocio ?? 'Panel Administrativo'}
          </p>
          <h1 className="text-base font-semibold text-zinc-950 leading-tight">
            {viewLabels[activeView] || activeView}
          </h1>
        </div>
      </div>

      {/* Right: badge negocio + avatar dropdown */}
      <div className="flex items-center gap-2">

        {/* Badge rol */}
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500 tracking-wide uppercase">
          {user?.NombreRol ?? '—'}
        </span>

        {/* Total productos badge */}
        {productos.length > 0 && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {productos.length} productos
          </span>
        )}

        {/* Botón de Impresión */}
        <button
          onClick={() => setPrintOpen(true)}
          className="relative p-2 text-zinc-400 hover:text-zinc-950 transition-colors ml-1"
          aria-label="Imprimir etiquetas"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          {printQueueCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
              {printQueueCount}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2.5 cursor-pointer group"
            aria-label="Menú de usuario"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-zinc-300 transition-all">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-zinc-950 leading-tight">{user?.Nombre ?? 'Usuario'}</p>
              <p className="text-[10px] text-zinc-400">{user?.Email ?? ''}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`text-zinc-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Info */}
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-sm font-semibold text-zinc-900">{user?.Nombre}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{user?.Email}</p>
                {user?.NombreNegocio && (
                  <p className="text-xs text-zinc-400 mt-0.5">🏪 {user.NombreNegocio}</p>
                )}
              </div>

              {/* Acciones */}
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors text-left">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  Mi perfil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors text-left">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                  </svg>
                  Ajustes
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-zinc-100 py-1">
                <button
                  id="logout-button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-medium"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer de Impresión */}
      <PrintDrawer open={printOpen} onClose={() => setPrintOpen(false)} />
    </header>
  );
}
