import React, { createContext, useContext, useEffect, useState } from 'react';
import * as mockAdapter from '../services/mockAdapter';
import { Wallet } from '../types';

type WalletsContextValue = {
  wallets: Wallet[];
  refresh: () => void;
  setPrimary: (id: string) => void;
};

const WalletsContext = createContext<WalletsContextValue | null>(null);

export const WalletsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>(mockAdapter.getWallets());

  const refresh = () => setWallets(mockAdapter.getWallets());

  const setPrimary = (id: string) => {
    mockAdapter.setPrimaryWallet(id);
    refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <WalletsContext.Provider value={{ wallets, refresh, setPrimary }}>
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
