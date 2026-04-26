import api from './api';
import type { Proveedor } from '../types';

export const getProveedores = async (idNegocio: number): Promise<Proveedor[]> => {
  const { data } = await api.get(`/proveedores?idNegocio=${idNegocio}`);
  return data.data;
};

export const createProveedor = async (body: {
  IdNegocio: number; Nombre: string; Telefono?: string; Correo?: string;
}): Promise<Proveedor> => {
  const { data } = await api.post('/proveedores', body);
  return data.data;
};

export const updateProveedor = async (
  id: number, body: { Nombre: string; Telefono?: string; Correo?: string }
): Promise<Proveedor> => {
  const { data } = await api.put(`/proveedores/${id}`, body);
  return data.data;
};

export const deleteProveedor = async (id: number): Promise<void> => {
  await api.delete(`/proveedores/${id}`);
};
