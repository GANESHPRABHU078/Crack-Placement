import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { profileService } from '../api/profileService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await profileService.getProfile();
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const updateUser = (updater) => {
    setUser((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next) {
        localStorage.setItem('user', JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
