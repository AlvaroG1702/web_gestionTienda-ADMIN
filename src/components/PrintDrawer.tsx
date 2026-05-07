import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { EscPos } from "../utils/escpos";

interface PrintDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function PrintDrawer({ open, onClose }: PrintDrawerProps) {
  const { printQueue, removeFromPrintQueue, updatePrintQuantity, clearPrintQueue } = useStore();
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printSpeed, setPrintSpeed] = useState<'rapido' | 'lento'>('rapido');

  const handlePrint = async () => {
    if (printQueue.length === 0) return;
    setIsPrinting(true);
    setError(null);

    const SERVER_URL = 'http://localhost:4000/print';

    const buildLabel = (item: any, builder: EscPos) => {
      builder
        // PRECIO — lo más grande
        .align("center")
        .bold(true)
        .size(3, 3)   // ← más grande que xl
        .println(`S/. ${(item.producto.PrecioVenta ?? 0).toFixed(2)}`)

        /* Volver a tamaño normal
        .bold(false)
        .size(1, 1)
        .println('')
        /*
        // SKU
        .fontSize("normal")
        .println(`SKU: ${item.producto.IdProducto || item.producto.IdNegocioProducto}`)
        */
        // NOMBRE DEL PRODUCTO
        .align("center")
        .bold(false)
        .size(2, 2)
        .println(item.producto.Nombre || "Producto")

        // Volver a tamaño normal
        .bold(false)
        .size(1, 1)
        .feed(2);
    };

    try {
      if (printSpeed === 'rapido') {
        const builder = new EscPos().init();
        for (const item of printQueue) {
          for (let i = 0; i < item.quantity; i++) {
            buildLabel(item, builder);
          }
        }

        const dataArray = Array.from(builder.build());
        const response = await fetch(SERVER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataArray }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error enviando la impresión al servidor local');
        }
      } else {
        // Lento: imprimir uno por uno con 4s de retraso
        let isFirst = true;
        for (const item of printQueue) {
          for (let i = 0; i < item.quantity; i++) {
            if (!isFirst) {
              await new Promise(resolve => setTimeout(resolve, 4000));
            }
            isFirst = false;

            const builder = new EscPos().init();
            buildLabel(item, builder);
            const dataArray = Array.from(builder.build());

            const response = await fetch(SERVER_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: dataArray }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || 'Error enviando la impresión al servidor local');
            }
          }
        }
      }

      // Impresión exitosa
      clearPrintQueue();
      onClose();

    } catch (err: any) {
      setError(err.message || "Error desconocido al intentar imprimir");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 bottom-0 z-[70] w-[420px] max-w-full bg-white flex flex-col shadow-2xl transition-transform duration-350 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-950">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <h2 className="font-serif text-2xl font-bold text-zinc-950">Cola de Impresión</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Printer Status */}
        <div className="px-7 py-4 bg-zinc-50 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-zinc-700">
                Impresora por Servidor Local
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            El sistema enviará la etiqueta a tu servidor local de impresión (puerto 4000).
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setPrintSpeed('rapido')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${printSpeed === 'rapido' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}
            >
              Rápido
            </button>
            <button
              onClick={() => setPrintSpeed('lento')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${printSpeed === 'lento' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}
            >
              Lento
            </button>
          </div>

          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-600">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Empty state */}
        {printQueue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-300">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <p className="text-sm text-zinc-400">La cola de impresión está vacía</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-7 py-4 flex flex-col gap-5">
              {printQueue.map(({ producto, quantity }) => (
                <div key={producto.IdNegocioProducto} className="flex gap-4 items-start pb-5 border-b border-zinc-50 last:border-0">
                  <div className="w-[60px] h-[60px] rounded-lg bg-zinc-100 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                    {producto.Imagen_url ? (
                      <img src={producto.Imagen_url} alt={producto.Nombre} className="w-full h-full object-cover" />
                    ) : (
                      "🏷️"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-950 mb-1 truncate">{producto.Nombre}</h4>
                    <p className="text-sm text-zinc-500 mb-2">S/ {(producto.PrecioVenta ?? 0).toFixed(2)}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePrintQuantity(producto.IdNegocioProducto, quantity - 1)}
                        className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-base text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all leading-none"
                      >−</button>
                      <span className="text-sm font-semibold text-zinc-950 min-w-[20px] text-center">{quantity}</span>
                      <button
                        onClick={() => updatePrintQuantity(producto.IdNegocioProducto, quantity + 1)}
                        className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-base text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all leading-none"
                      >+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromPrintQueue(producto.IdNegocioProducto)} className="text-zinc-300 hover:text-zinc-950 transition-colors mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-zinc-100 flex flex-col gap-3">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className={`w-full py-3.5 text-white text-xs font-semibold tracking-widest uppercase rounded transition-colors ${!isPrinting
                  ? "bg-zinc-950 hover:bg-zinc-800"
                  : "bg-zinc-300 cursor-not-allowed"
                  }`}
              >
                {isPrinting ? "Enviando a Servidor..." : "Imprimir Etiquetas"}
              </button>
              <button onClick={clearPrintQueue} className="w-full py-3 border border-zinc-200 text-zinc-400 text-xs font-medium tracking-widest uppercase rounded hover:border-zinc-950 hover:text-zinc-950 transition-all">
                Vaciar Cola
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
