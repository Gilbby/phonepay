import React, { createContext, useContext, useState } from 'react';
import { WalletsProvider } from './WalletsContext';
import { currentUser } from '../data/users';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(currentUser || null);
  const [selectedWallet, setSelectedWallet] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser, selectedWallet, setSelectedWallet }}>
      <WalletsProvider>{children}</WalletsProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
