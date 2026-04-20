import React from 'react';
import { useStore } from '../context/StoreContext';

interface TopBarProps {
  activeView: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const viewLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Gestión de Productos',
  inventory: 'Control de Inventario',
  orders: 'Pedidos',
  analytics: 'Analíticas',
  settings: 'Ajustes',
};

export default function TopBar({ activeView, sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const { products } = useStore();
  const lowStock = products.filter(p => p.stock <= 5).length;

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
            Panel Administrativo
          </p>
          <h1 className="text-base font-semibold text-zinc-950 leading-tight">
            {viewLabels[activeView] || activeView}
          </h1>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Low stock alert */}
        {lowStock > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {lowStock} con stock bajo
          </div>
        )}

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {lowStock > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-zinc-950 leading-tight">Admin</p>
            <p className="text-[10px] text-zinc-400">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
