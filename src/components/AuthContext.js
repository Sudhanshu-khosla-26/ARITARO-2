'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const saved = localStorage.getItem('aritaro_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulated login — in production this would hit an API
    const userData = {
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      avatar: email.charAt(0).toUpperCase(),
      joinedAt: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem('aritaro_user', JSON.stringify(userData));
    return true;
  };

  const signup = (name, email, password) => {
    const userData = {
      email,
      name,
      avatar: name.charAt(0).toUpperCase(),
      joinedAt: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem('aritaro_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aritaro_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
