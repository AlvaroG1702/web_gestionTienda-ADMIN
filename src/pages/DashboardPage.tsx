import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatsGrid from '../components/dashboard/StatsGrid';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import LowStockAlerts from '../components/dashboard/LowStockAlerts';

export default function DashboardPage() {
  const { stats, byCategory, lowStockProducts, products } = useDashboard();

  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown byCategory={byCategory} totalProducts={products.length} />
        <LowStockAlerts products={lowStockProducts} />
      </div>
    </div>
  );
}
