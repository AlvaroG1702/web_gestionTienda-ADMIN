import React from 'react';
import { useProveedores } from '../hooks/useProveedores';
import ProveedorModal from '../components/proveedores/ProveedorModal';

export default function ProveedoresPage() {
  const {
    filtered, loading, error, reload,
    search, setSearch,
    modalOpen, editing,
    handleAdd, handleEdit, handleClose, handleSave, handleDelete,
    total,
  } = useProveedores();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <svg className="animate-spin w-7 h-7 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Cargando proveedores...
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-zinc-500">{error}</p>
        <button onClick={reload} className="px-5 py-2 bg-zinc-950 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Buscador */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus-within:border-zinc-950 focus-within:shadow-sm transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="outline-none bg-transparent text-sm text-zinc-950 placeholder:text-zinc-300 w-48 font-sans"
            />
          </div>
          <span className="text-xs text-zinc-400">{filtered.length} de {total}</span>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Nombre</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Teléfono</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400">Correo</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.IdProveedor}
                  className={`border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors ${i % 2 !== 0 ? 'bg-zinc-50/30' : ''}`}
                >
                  {/* Nombre */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-zinc-500">
                          {p.Nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-zinc-950">{p.Nombre}</span>
                    </div>
                  </td>

                  {/* Teléfono */}
                  <td className="px-5 py-3.5 text-zinc-500">
                    {p.Telefono
                      ? <span className="flex items-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.22 10.09 19.79 19.79 0 01.15 1.45 2 2 0 012.13 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                          {p.Telefono}
                        </span>
                      : <span className="text-zinc-300">—</span>
                    }
                  </td>

                  {/* Correo */}
                  <td className="px-5 py-3.5 text-zinc-500">
                    {p.Correo
                      ? <a href={`mailto:${p.Correo}`} className="flex items-center gap-1.5 hover:text-zinc-950 transition-colors">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          {p.Correo}
                        </a>
                      : <span className="text-zinc-300">—</span>
                    }
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                        title="Editar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vacío */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <p className="text-sm mt-3">No hay proveedores registrados</p>
            <button onClick={handleAdd} className="mt-4 px-4 py-2 text-xs bg-zinc-950 text-white rounded-lg hover:bg-zinc-700 transition-colors">
              + Agregar primero
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProveedorModal
          proveedor={editing}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </>
  );
}
