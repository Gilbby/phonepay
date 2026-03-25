import React, { createContext, useContext, useEffect, useState } from 'react';
import * as mockAdapter from '../services/mockAdapter';

const WalletsContext = createContext(null);

export const WalletsProvider = ({ children }) => {
  const [wallets, setWallets] = useState(mockAdapter.getWallets());

  const refresh = () => setWallets(mockAdapter.getWallets());

  const setPrimary = (id) => {
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

export const useWallets = () => {
  const ctx = useContext(WalletsContext);
  if (!ctx) throw new Error('useWallets must be used within WalletsProvider');
  return ctx;
};
