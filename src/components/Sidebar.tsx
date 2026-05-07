import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // Si no se especifica, todos los roles lo ven
}

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventario',
    roles: ['super admin', 'admin'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <path d="M12 11h4"/>
        <path d="M12 16h4"/>
        <path d="M8 11h.01"/>
        <path d="M8 16h.01"/>
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Productos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },

  {
    id: 'orders',
    label: 'Pedidos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analíticas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Ajustes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeView, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();

  const initials = user?.Nombre
    ? user.Nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-zinc-950 text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[70px]' : 'w-[240px]'}
        `}
      >
        {/* Logo / Header */}
        <div className="h-[64px] flex items-center px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
              <span className="text-zinc-950 font-serif font-bold text-sm">O</span>
            </div>
            {!collapsed && (
              <span className="font-serif font-bold tracking-[0.12em] text-base whitespace-nowrap">
                ORUEL
              </span>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <div className="px-2 space-y-0.5">
            {navItems.map((item) => {
              // Validar roles
              if (item.roles && user?.NombreRol) {
                const userRole = user.NombreRol.toLowerCase();
                if (!item.roles.some(r => r.toLowerCase() === userRole)) {
                  return null;
                }
              }

              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-150 cursor-pointer group relative
                    ${isActive
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {collapsed && (
                    <span className="
                      absolute left-full ml-3 px-2 py-1 text-xs font-medium
                      bg-zinc-800 text-white rounded-md whitespace-nowrap
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-150 shadow-xl
                    ">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Toggle collapse button */}
        <div className="px-2 py-2 border-t border-white/10">
          <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-150 cursor-pointer"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <span className="shrink-0">
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">Colapsar</span>
            )}
          </button>
        </div>

        {/* User info + logout */}
        <div className={`px-2 py-3 border-t border-white/10 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {/* Info del usuario */}
          <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs font-bold text-white">
              {initials}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-medium text-white leading-tight truncate">{user?.Nombre ?? 'Usuario'}</p>
                <p className="text-[11px] text-zinc-500 truncate">{user?.Email ?? ''}</p>
              </div>
            )}
          </div>

          {/* Botón logout */}
          <button
            id="sidebar-logout"
            onClick={logout}
            title="Cerrar sesión"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg
              text-zinc-500 hover:bg-red-500/10 hover:text-red-400
              transition-all duration-150 cursor-pointer w-full
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
            )}
            {collapsed && (
              <span className="
                absolute left-full ml-3 px-2 py-1 text-xs font-medium
                bg-zinc-800 text-white rounded-md whitespace-nowrap
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-150 shadow-xl
              ">
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
