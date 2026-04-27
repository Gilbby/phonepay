import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletsProvider } from './WalletsContext';
import { currentUser as mockCurrentUser } from '../data/mockData';
import { User } from '../types';

type AppContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockCurrentUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (_phone: string, _otp: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUser(mockCurrentUser || null);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((r) => setTimeout(r, 1500));
      setIsLoading(false);
    };
    void checkAuth();
  }, []);

  return (
    <AppContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      <WalletsProvider>{children}</WalletsProvider>
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
