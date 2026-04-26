import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Producto } from '../types';

type SortBy = 'nombre' | 'precio' | 'margen';

export function useProducts(options?: { onlyActive?: boolean }) {
  const { productos } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('nombre');

  const filtered = productos
    .filter(p => {
      if (options?.onlyActive && !p.Estado) return false;
      return p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.NombreCategoria ?? '').toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'precio') return (b.PrecioVenta ?? 0) - (a.PrecioVenta ?? 0);
      if (sortBy === 'margen') return (Number(b.MargenGanancia) ?? 0) - (Number(a.MargenGanancia) ?? 0);
      return a.Nombre.localeCompare(b.Nombre);
    });

  const handleEdit = (product: Producto) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  return {
    filtered,
    search,
    setSearch,
    sortBy,
    setSortBy,
    modalOpen,
    editingProduct,
    handleEdit,
    handleAdd,
    handleClose,
  };
}
