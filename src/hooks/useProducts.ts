import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';

type SortBy = 'name' | 'price' | 'stock';

export function useProducts() {
  const { products } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });

  const handleEdit = (product: Product) => {
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
