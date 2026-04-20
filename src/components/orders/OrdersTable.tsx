import React from 'react';

const placeholderOrders = [
  { id: '#0045', customer: 'María García',  items: 3, total: 189.99, status: 'Entregado',  date: '2026-04-14' },
  { id: '#0044', customer: 'Carlos López',  items: 1, total: 59.99,  status: 'En camino',  date: '2026-04-13' },
  { id: '#0043', customer: 'Ana Martínez',  items: 5, total: 320.00, status: 'Procesando', date: '2026-04-12' },
  { id: '#0042', customer: 'Luis Pérez',    items: 2, total: 140.50, status: 'Entregado',  date: '2026-04-11' },
  { id: '#0041', customer: 'Sofía Ruiz',    items: 4, total: 215.00, status: 'Cancelado',  date: '2026-04-10' },
];

const statusStyle: Record<string, string> = {
  'Entregado':  'bg-emerald-100 text-emerald-700',
  'En camino':  'bg-blue-100 text-blue-700',
  'Procesando': 'bg-amber-100 text-amber-700',
  'Cancelado':  'bg-red-100 text-red-500',
};

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Pedido</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Cliente</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Artículos</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Total</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Estado</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {placeholderOrders.map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-50/30'}`}
              >
                <td className="px-5 py-3.5 font-mono font-semibold text-zinc-950">{order.id}</td>
                <td className="px-5 py-3.5 text-zinc-700">{order.customer}</td>
                <td className="px-5 py-3.5 text-zinc-500">{order.items} productos</td>
                <td className="px-5 py-3.5 font-semibold text-zinc-950">${order.total.toFixed(2)}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-zinc-400 text-xs">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
