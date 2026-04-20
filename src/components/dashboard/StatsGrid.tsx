import React from 'react';

interface StatItem {
  key: string;
  value: string | number;
  label: string;
  sub: string;
  color: string;
}

interface Props {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(stat => (
        <div
          key={stat.key}
          className="bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
            <StatIcon statKey={stat.key} />
          </div>
          <p className="text-2xl font-bold text-zinc-950 font-serif leading-none mb-1">{stat.value}</p>
          <p className="text-sm font-semibold text-zinc-700">{stat.label}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}

function StatIcon({ statKey }: { statKey: string }) {
  switch (statKey) {
    case 'productos':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
      );
    case 'destacados':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'stockBajo':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'valor':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      );
  }
}
