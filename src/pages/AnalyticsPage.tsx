import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import MetricsGrid from '../components/analytics/MetricsGrid';
import TopProductsChart from '../components/analytics/TopProductsChart';

export default function AnalyticsPage() {
  const { metrics, topProducts, maxInventoryValue } = useAnalytics();

  return (
    <div className="space-y-6">
      <MetricsGrid metrics={metrics} />

      <TopProductsChart
        products={topProducts}
        maxInventoryValue={maxInventoryValue}
      />

      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3 text-zinc-500 text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Las gráficas de ventas y tendencias estarán disponibles al integrarse con el backend.</span>
      </div>
    </div>
  );
}
