import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthUser } from '../services/authService';
import {
  getStoredToken,
  getStoredUser,
  loginRequest,
  logoutRequest,
  setAxiosAuthHeader,
} from '../services/authService';

interface AuthContextType {
  user:            AuthUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  login:           (identifier: string, password: string) => Promise<void>;
  logout:          () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al montar (refresh de página)
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser  = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setAxiosAuthHeader(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    const { token: t, user: u } = await loginRequest(identifier, password);
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    await logoutRequest();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
