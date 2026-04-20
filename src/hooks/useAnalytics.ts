import { useStore } from '../context/StoreContext';

export type Metric = {
  label: string;
  value: string | number;
};

export function useAnalytics() {
  const { products } = useStore();

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgPrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length
    : 0;

  const topProducts = [...products]
    .sort((a, b) => b.price * b.stock - a.price * a.stock)
    .slice(0, 5)
    .map(p => ({
      ...p,
      inventoryValue: p.price * p.stock,
    }));

  const maxInventoryValue = topProducts[0]?.inventoryValue ?? 0;

  const metrics: Metric[] = [
    { label: 'Productos activos',     value: products.length },
    { label: 'Precio promedio',       value: `$${avgPrice.toFixed(2)}` },
    { label: 'Valor total inventario', value: `$${totalValue.toLocaleString('es', { maximumFractionDigits: 0 })}` },
    { label: 'Productos destacados',  value: products.filter(p => p.featured).length },
  ];

  return {
    metrics,
    topProducts,
    maxInventoryValue,
  };
}
