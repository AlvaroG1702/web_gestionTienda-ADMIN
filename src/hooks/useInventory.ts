import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Producto } from '../types';

export type StockStatus = {
  label: string;
  cls: string;
};

export function useInventory() {
  const { productos, removeProducto } = useStore();
  const [editingProduct, setEditingProduct] = useState<Producto | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = productos.filter(p =>
    p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.NombreCategoria ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Producto) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleDelete = async (product: Producto) => {
    if (confirm(`¿Eliminar "${product.Nombre}"?`)) {
      await removeProducto(product.IdNegocioProducto);
    }
  };

  // Sin campo stock en la BD por ahora → todos en "Normal"
  const stockStatus = (_stock: number): StockStatus =>
    ({ label: 'Normal', cls: 'bg-emerald-100 text-emerald-700' });

  return {
    filtered,
    search,
    setSearch,
    modalOpen,
    editingProduct,
    handleEdit,
    handleClose,
    handleDelete,
    stockStatus,
  };
}
