import api from './api';
import type { Producto, ProductoInput } from '../types';

// Obtener todos los productos de un negocio
export const getProductos = async (idNegocio: number): Promise<Producto[]> => {
  const { data } = await api.get(`/productos?idNegocio=${idNegocio}`);
  return data.data;
};

// Obtener un producto por IdNegocioProducto
export const getProductoById = async (id: number): Promise<Producto> => {
  const { data } = await api.get(`/productos/${id}`);
  return data.data;
};

// Crear un producto nuevo
export const createProducto = async (producto: ProductoInput): Promise<Producto> => {
  const { data } = await api.post('/productos', producto);
  return data.data;
};

// Actualizar un producto (añade nuevo precio si cambió)
export const updateProducto = async (id: number, producto: Partial<ProductoInput>): Promise<Producto> => {
  const { data } = await api.put(`/productos/${id}`, producto);
  return data.data;
};

// Eliminar un producto (soft delete)
export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};
