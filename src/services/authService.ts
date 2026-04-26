import api from './api';

const TOKEN_KEY = 'oruel_token';
const USER_KEY  = 'oruel_user';

export interface AuthUser {
  IdUsuario:    number;
  Nombre:       string;
  Email:        string;
  IdRol:        number;
  NombreRol:    string;
  IdNegocio:    number | null;
  NombreNegocio: string | null;
}

// Persistencia en localStorage
export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getStoredUser  = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
const storeSession = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Inyectar token en todas las peticiones Axios
export const setAxiosAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Login
export const loginRequest = async (
  identifier: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> => {
  const { data } = await api.post('/auth/login', { identifier, password });
  storeSession(data.token, data.user);
  setAxiosAuthHeader(data.token);
  return data;
};

// Logout
export const logoutRequest = async (): Promise<void> => {
  try { await api.post('/auth/logout'); } catch { /* ignore */ }
  clearSession();
  setAxiosAuthHeader(null);
};
