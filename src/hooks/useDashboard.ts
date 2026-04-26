import { useStore } from '../context/StoreContext';

export function useDashboard() {
  const { productos, loadingProductos } = useStore();

  const totalValorVenta = productos.reduce((sum, p) => sum + (p.PrecioVenta ?? 0), 0);

  const stats = [
    {
      key: 'productos',
      value: loadingProductos ? '...' : productos.length,
      label: 'Total Productos',
      sub: 'en catálogo activo',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'categorias',
      value: loadingProductos ? '...' : new Set(productos.map(p => p.NombreCategoria)).size,
      label: 'Categorías',
      sub: 'distintas',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      key: 'proveedores',
      value: loadingProductos ? '...' : new Set(productos.map(p => p.NombreProveedor)).size,
      label: 'Proveedores',
      sub: 'activos',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      key: 'valor',
      value: loadingProductos
        ? '...'
        : `S/ ${totalValorVenta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      label: 'Valor Inventario',
      sub: 'precio de venta',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  // Agrupar por categoría
  const byCategory = productos.reduce<Record<string, number>>((acc, p) => {
    const cat = p.NombreCategoria ?? 'Sin categoría';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Productos con mayor margen (top 6)
  const topMargen = [...productos]
    .filter(p => p.MargenGanancia != null)
    .sort((a, b) => Number(b.MargenGanancia) - Number(a.MargenGanancia))
    .slice(0, 6)
    .map(p => ({
      id: String(p.IdNegocioProducto),
      name: p.Nombre,
      category: p.NombreCategoria ?? 'Sin categoría',
      image: p.Imagen_url ?? '',
      stock: 0,
      price: p.PrecioVenta ?? 0,
      description: p.Descripcion ?? '',
      featured: false,
      createdAt: p.FechaActualizacion ? new Date(p.FechaActualizacion) : new Date(),
    }));

  return {
    productos,
    loadingProductos,
    stats,
    byCategory,
    lowStockProducts: topMargen,   // alias usado por LowStockAlerts
    // alias legacy
    products: productos,
  };
}
