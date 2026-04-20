import { useStore } from '../context/StoreContext';

export function useDashboard() {
  const { products } = useStore();

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    {
      key: 'productos',
      value: products.length,
      label: 'Total Productos',
      sub: 'en catálogo',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'destacados',
      value: products.filter(p => p.featured).length,
      label: 'Destacados',
      sub: 'productos activos',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      key: 'stockBajo',
      value: products.filter(p => p.stock <= 5).length,
      label: 'Stock Bajo',
      sub: '≤ 5 unidades',
      color: 'bg-red-50 text-red-500',
    },
    {
      key: 'valor',
      value: `$${totalValue.toLocaleString('es', { maximumFractionDigits: 0 })}`,
      label: 'Valor Inventario',
      sub: 'total en stock',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const lowStockProducts = products
    .filter(p => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  return {
    products,
    stats,
    byCategory,
    lowStockProducts,
  };
}
