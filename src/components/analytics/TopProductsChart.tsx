import React from 'react';

interface TopProduct {
  id: string;
  name: string;
  inventoryValue: number;
}

interface Props {
  products: TopProduct[];
  maxInventoryValue: number;
}

export default function TopProductsChart({ products, maxInventoryValue }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <h2 className="text-sm font-semibold text-zinc-950 mb-4">Top Productos por Valor de Inventario</h2>
      <div className="space-y-3">
        {products.map((p, i) => {
          const pct = maxInventoryValue > 0 ? (p.inventoryValue / maxInventoryValue) * 100 : 0;
          return (
            <div key={p.id} className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-300 w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-950 truncate">{p.name}</span>
                  <span className="text-xs font-semibold text-zinc-600 ml-2 shrink-0">
                    ${p.inventoryValue.toLocaleString('es', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
