import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Proveedor } from '../types';
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from '../services/proveedoresService';

export function useProveedores() {
  const { user } = useAuth();
  const idNegocio = user?.IdNegocio ?? 0;

  const [proveedores, setProveedores]   = useState<Proveedor[]>([]);
  const [loading,     setLoading]       = useState(true);
  const [error,       setError]         = useState<string | null>(null);
  const [search,      setSearch]        = useState('');
  const [modalOpen,   setModalOpen]     = useState(false);
  const [editing,     setEditing]       = useState<Proveedor | undefined>(undefined);

  // ── Carga ──────────────────────────────────────────────────────────────────
  const reload = useCallback(async () => {
    if (!idNegocio) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProveedores(idNegocio);
      setProveedores(data);
    } catch {
      setError('No se pudo cargar los proveedores');
    } finally {
      setLoading(false);
    }
  }, [idNegocio]);

  useEffect(() => { reload(); }, [reload]);

  // ── Filtro ─────────────────────────────────────────────────────────────────
  const filtered = proveedores.filter(p =>
    p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.Correo ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async (form: { Nombre: string; Telefono: string; Correo: string }) => {
    if (editing) {
      await updateProveedor(editing.IdProveedor, form);
    } else {
      await createProveedor({ IdNegocio: idNegocio, ...form });
    }
    await reload();
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleDelete = async (p: Proveedor) => {
    if (confirm(`¿Eliminar proveedor "${p.Nombre}"?`)) {
      await deleteProveedor(p.IdProveedor);
      await reload();
    }
  };

  const handleAdd = () => { setEditing(undefined); setModalOpen(true); };
  const handleEdit = (p: Proveedor) => { setEditing(p); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(undefined); };

  return {
    filtered, loading, error, reload,
    search, setSearch,
    modalOpen, editing,
    handleAdd, handleEdit, handleClose, handleSave, handleDelete,
    total: proveedores.length,
  };
}
