import React from 'react';
import { useInventory } from '../hooks/useInventory';
import InventorySearchBar from '../components/inventory/InventorySearchBar';
import InventoryTable from '../components/inventory/InventoryTable';
import ProductModal from '../components/ProductModal';

export default function InventoryPage() {
  const {
    filtered,
    search,
    setSearch,
    modalOpen,
    editingProduct,
    handleEdit,
    handleClose,
    handleDelete,
    stockStatus,
  } = useInventory();

  return (
    <>
      <InventorySearchBar
        search={search}
        onSearch={setSearch}
        count={filtered.length}
      />

      <InventoryTable
        products={filtered}
        stockStatus={stockStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && <ProductModal product={editingProduct} onClose={handleClose} />}
    </>
  );
}
