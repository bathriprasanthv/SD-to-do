import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from '../utils/localStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
