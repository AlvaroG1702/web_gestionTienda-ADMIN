import React from 'react';

interface Props {
  byCategory: Record<string, number>;
  totalProducts: number;
}

export default function CategoryBreakdown({ byCategory, totalProducts }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <h2 className="text-sm font-semibold text-zinc-950 mb-4">Productos por Categoría</h2>
      <div className="space-y-3">
        {Object.entries(byCategory).map(([cat, count]) => {
          const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
          return (
            <div key={cat}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-zinc-700">{cat}</span>
                <span className="text-xs font-semibold text-zinc-950">{count} productos</span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
