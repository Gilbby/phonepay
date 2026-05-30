import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { WalletsProvider } from './WalletsContext';
import { TransactionsProvider } from './TransactionsContext';
import { User } from '../types';
import { API_URL } from '../config/api';

type AppContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<{ isNewUser: boolean; hasPin: boolean }>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          const decoded = jwtDecode<{ exp: number }>(storedToken);
          if (decoded.exp < Date.now() / 1000) {
            await AsyncStorage.multiRemove(['token', 'user', 'biometric_enabled']);
            try { await SecureStore.deleteItemAsync('pin_hash'); } catch {}
            return;
          }
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch {
        // Malformed token or storage error — treat as logged out
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, []);

  const login = async (phone: string, otp: string): Promise<{ isNewUser: boolean; hasPin: boolean }> => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);

    return { isNewUser: data.isNewUser, hasPin: !!data.user?.hasPin };
  };

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('biometric_enabled');
    try { await SecureStore.deleteItemAsync('pin_hash'); } catch {}
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, setUser }}>
      <WalletsProvider token={token}>
        <TransactionsProvider token={token}>
          {children}
        </TransactionsProvider>
      </WalletsProvider>
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
