import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductsToolbar from '../components/products/ProductsToolbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function ProductsPage() {
  const {
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
  } = useProducts();

  return (
    <>
      <ProductsToolbar
        search={search}
        onSearch={setSearch}
        sortBy={sortBy}
        onSort={setSortBy}
        count={filtered.length}
        onAdd={handleAdd}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} onEdit={handleEdit} adminMode />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-sm mt-3">No se encontraron productos</p>
        </div>
      )}

      {modalOpen && <ProductModal product={editingProduct} onClose={handleClose} />}
    </>
  );
}
