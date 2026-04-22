import { wallets as mockWallets } from '../data/wallets';
import { transactions as mockTransactions } from '../data/transactions';
import { Wallet, Transaction } from '../types';

// Keep an internal copy so we can mutate safely within the adapter
let wallets: Wallet[] = mockWallets.map((w) => ({ ...w }));
let transactions: Transaction[] = mockTransactions.map((t) => ({ ...t }));

export const getWallets = (): Wallet[] => wallets.map((w) => ({ ...w }));
export const setWallets = (newWallets: Wallet[]) => {
  wallets = newWallets.map((w) => ({ ...w }));
};

export const setPrimaryWallet = (id: string) => {
  wallets = wallets.map((w) => ({ ...w, isPrimary: w.id === id }));
};

export const getTransactions = (): Transaction[] => transactions.map((t) => ({ ...t }));

export const getTotalBalance = (): number => wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
