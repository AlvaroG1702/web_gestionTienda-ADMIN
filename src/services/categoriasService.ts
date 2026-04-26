import api from './api';
import type { Categoria } from '../types';

// Obtener todas las categorías (catálogo global)
export const getCategorias = async (): Promise<Categoria[]> => {
  const { data } = await api.get('/categorias');
  return data.data;
};

// Crear una categoría nueva
export const createCategoria = async (categoria: { Nombre: string; Descripcion?: string }): Promise<Categoria> => {
  const { data } = await api.post('/categorias', categoria);
  return data.data;
};
