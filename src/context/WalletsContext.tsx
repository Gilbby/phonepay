import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wallet } from '../types';
import { API_URL, authHeaders } from '../config/api';

type WalletsContextValue = {
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setPrimary: (id: string) => Promise<void>;
};

const WalletsContext = createContext<WalletsContextValue | null>(null);

// Map MongoDB _id to id for frontend compatibility
const mapWallets = (wallets: any[]): Wallet[] =>
  wallets.map((w) => ({ ...w, id: w._id }));

export const WalletsProvider: React.FC<{ children: React.ReactNode; token: string | null }> = ({ children, token }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        headers: authHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setWallets(mapWallets(data.wallets));
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const setPrimary = async (id: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/wallets/${id}/primary`, {
        method: 'PATCH',
        headers: authHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setWallets(mapWallets(data.wallets));
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) void refresh();
  }, [token]);

  return (
    <WalletsContext.Provider value={{ wallets, isLoading, error, refresh, setPrimary }}>
      {children}
    </WalletsContext.Provider>
  );
};

export const useWallets = (): WalletsContextValue => {
  const ctx = useContext(WalletsContext);
  if (!ctx) throw new Error('useWallets must be used within WalletsProvider');
  return ctx;
};

export default WalletsContext;