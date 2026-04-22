import React, { createContext, useContext, useState } from 'react';
import { WalletsProvider } from './WalletsContext';
import { currentUser as mockCurrentUser } from '../data/mockData';
import { User, Wallet } from '../types';

type AppContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedWallet: Wallet | null;
  setSelectedWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockCurrentUser || null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser, selectedWallet, setSelectedWallet }}>
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
