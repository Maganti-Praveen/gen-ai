import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, updateProfileApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('s2s_token') || null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem('s2s_token');
      if (!stored) { setLoading(false); return; }
      try {
        const res = await getMe(stored);
        setUser(res.data.user);
        setToken(stored);
      } catch (_) {
        localStorage.removeItem('s2s_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('s2s_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('s2s_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('s2s_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await updateProfileApi(data);
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
