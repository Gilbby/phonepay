import React, { createContext, useContext, useState, useEffect } from 'react';
import * as mockAdapter from '../services/mockAdapter';
import { Transaction } from '../types';


type TransactionsContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockAdapter.getTransactions());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const data = mockAdapter.getTransactions();
      setTransactions(data);
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
    <TransactionsContext.Provider value={{ transactions, isLoading, error, refresh }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionsContextValue => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};

export default TransactionsContext;
