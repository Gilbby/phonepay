import React, { createContext, useContext, useEffect, useState } from 'react';
import * as mockAdapter from '../services/mockAdapter';
import { Wallet } from '../types';

type WalletsContextValue = {
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setPrimary: (id: string) => Promise<void>;
};

const WalletsContext = createContext<WalletsContextValue | null>(null);

export const WalletsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>(mockAdapter.getWallets());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const data = mockAdapter.getWallets();
      setWallets(data);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const setPrimary = async (id: string) => {
    setIsLoading(true);
    try {
      mockAdapter.setPrimaryWallet(id);
      const data = mockAdapter.getWallets();
      setWallets(data);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

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
