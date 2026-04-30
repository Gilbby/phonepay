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

const mapTransactions = (transactions: any[]): Transaction[] =>
  transactions.map((t) => ({
    ...t,
    id: t._id,
    date: t.createdAt ?? new Date().toISOString(),
    currency: 'K',
    recipientName: t.receiverId?.alias ?? t.receiverId?.phone ?? 'Unknown',
    senderName: t.senderId?.alias ?? t.senderId?.phone ?? 'Unknown',
    agentCode: t.agentId?.agentCode ?? '',
  }));

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
      console.log('transactions count:', data.transactions?.length);
      if (!response.ok) throw new Error(data.message);
      const mapped = mapTransactions(data.transactions);
      console.log('mapped count:', mapped.length);
      setTransactions(mapped);
      setError(null);
    } catch (e) {
      console.log('transactions error:', String(e));
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('token changed:', token ? 'has token' : 'no token');
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