import React from 'react';
import OrdersTable from '../components/orders/OrdersTable';

export default function OrdersPage() {
  return (
    <>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700 text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Esta sección mostrará los pedidos reales cuando se integre el backend.</span>
      </div>

      <OrdersTable />
    </>
  );
}
