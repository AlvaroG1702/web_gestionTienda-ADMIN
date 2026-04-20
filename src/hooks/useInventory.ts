import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';

export type StockStatus = {
  label: string;
  cls: string;
};

export function useInventory() {
  const { products, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`¿Eliminar "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const stockStatus = (stock: number): StockStatus => {
    if (stock === 0) return { label: 'Sin stock', cls: 'bg-red-100 text-red-600' };
    if (stock <= 5)  return { label: 'Bajo',      cls: 'bg-amber-100 text-amber-700' };
    return               { label: 'Normal',    cls: 'bg-emerald-100 text-emerald-700' };
  };

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
