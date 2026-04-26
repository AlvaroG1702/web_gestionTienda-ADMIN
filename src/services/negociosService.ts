import api from './api';
import type { Negocio } from '../types';

// Obtener todos los negocios activos
export const getNegocios = async (): Promise<Negocio[]> => {
  const { data } = await api.get('/negocios');
  return data.data;
};

// Obtener un negocio por ID
export const getNegocioById = async (id: number): Promise<Negocio> => {
  const { data } = await api.get(`/negocios/${id}`);
  return data.data;
};
