import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLider: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'admin';
  const isLider = user?.rol === 'lider';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLider,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
