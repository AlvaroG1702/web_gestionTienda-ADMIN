import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProveedoresPage from './pages/ProveedoresPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InventoryPage from './pages/InventoryPage';
import './index.css';

type Page = 'dashboard' | 'products' | 'proveedores' | 'orders' | 'analytics' | 'settings' | 'inventory';

// ── App protegida (solo se monta si hay sesión) ────────────────────────────────
function AdminApp() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <DashboardPage />;
      case 'products':     return <ProductsPage />;
      case 'inventory':    return <InventoryPage />;
      case 'proveedores':  return <ProveedoresPage />;
      case 'orders':       return <OrdersPage />;
      case 'analytics':    return <AnalyticsPage />;
      case 'settings':     return <SettingsPage />;
      default:             return <DashboardPage />;
    }
  };

  const sidebarWidth = sidebarCollapsed ? 70 : 240;

  return (
    <StoreProvider>
      <div className="min-h-screen bg-zinc-50">
        <Sidebar
          activeView={activePage}
          onNavigate={(v) => setActivePage(v as Page)}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(prev => !prev)}
        />
        <div
          className="flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          <TopBar
            activeView={activePage}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
          />
          <main className="flex-1 pt-[64px]">
            <div className="p-6 lg:p-8 max-w-[1400px]">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}

// ── Root: decide qué mostrar según la sesión ───────────────────────────────────
function RootApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <AdminApp /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}
