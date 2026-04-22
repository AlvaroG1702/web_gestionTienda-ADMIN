import axios from 'axios';

// La URL base viene del .env del frontend (Vite)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request (ej: añadir token en el futuro)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (manejo global de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
