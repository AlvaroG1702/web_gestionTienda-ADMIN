import api from './api';

// Ejemplo de servicio para Productos
// Cada función representa un endpoint del backend

// Obtener todos los productos
export const getProductos = async () => {
  const { data } = await api.get('/productos');
  return data;
};

// Obtener un producto por ID
export const getProductoById = async (id: number) => {
  const { data } = await api.get(`/productos/${id}`);
  return data;
};

// Crear un producto nuevo
export const createProducto = async (producto: object) => {
  const { data } = await api.post('/productos', producto);
  return data;
};

// Actualizar un producto
export const updateProducto = async (id: number, producto: object) => {
  const { data } = await api.put(`/productos/${id}`, producto);
  return data;
};

// Eliminar un producto
export const deleteProducto = async (id: number) => {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
};
