import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '../types';
import { API_URL, authHeaders } from '../config/api';

type TransactionsContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export const TransactionsProvider: React.FC<{ children: React.ReactNode; token: string | null }> = ({ children, token }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: authHeaders(token),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTransactions(data.transactions);
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