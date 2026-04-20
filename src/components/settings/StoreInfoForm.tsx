import React from 'react';

const fields = [
  { label: 'Nombre',           value: 'Oruel' },
  { label: 'Email de contacto', value: 'admin@oruel.com' },
  { label: 'Moneda',           value: 'USD ($)' },
];

export default function StoreInfoForm() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <h2 className="text-sm font-semibold text-zinc-950 mb-4">Información de la Tienda</h2>
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
              {field.label}
            </label>
            <input
              defaultValue={field.value}
              className="px-4 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-950 bg-zinc-50 outline-none focus:border-zinc-950 focus:bg-white transition-colors font-sans"
            />
          </div>
        ))}
        <button className="px-5 py-2.5 bg-zinc-950 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors cursor-pointer">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
