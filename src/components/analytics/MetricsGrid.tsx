import React from 'react';
import type { Metric } from '../../hooks/useAnalytics';

interface Props {
  metrics: Metric[];
}

export default function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map(m => (
        <div key={m.label} className="bg-white rounded-2xl border border-zinc-100 p-5">
          <p className="text-2xl font-bold text-zinc-950 font-serif">{m.value}</p>
          <p className="text-xs text-zinc-400 mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
