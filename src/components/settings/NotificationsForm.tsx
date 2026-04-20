import React from 'react';

const options = [
  { label: 'Alertas de stock bajo', desc: 'Notificar cuando el stock sea ≤ 5 unidades' },
  { label: 'Nuevos pedidos',         desc: 'Recibir alerta por cada nuevo pedido' },
  { label: 'Resumen semanal',        desc: 'Informe semanal de ventas por email' },
];

export default function NotificationsForm() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <h2 className="text-sm font-semibold text-zinc-950 mb-4">Notificaciones</h2>
      <div className="space-y-3">
        {options.map(opt => (
          <label key={opt.label} className="flex items-center justify-between cursor-pointer py-2 border-b border-zinc-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-zinc-950">{opt.label}</p>
              <p className="text-xs text-zinc-400">{opt.desc}</p>
            </div>
            <div className="relative">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-zinc-200 rounded-full peer-checked:bg-zinc-950 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
