import { wallets as mockWallets } from '../data/wallets';
import { transactions as mockTransactions } from '../data/transactions';

// Keep an internal copy so we can mutate safely within the adapter
let wallets = mockWallets.map((w) => ({ ...w }));
let transactions = mockTransactions.map((t) => ({ ...t }));

export const getWallets = () => wallets.map((w) => ({ ...w }));
export const setWallets = (newWallets) => {
  wallets = newWallets.map((w) => ({ ...w }));
};

export const setPrimaryWallet = (id) => {
  wallets = wallets.map((w) => ({ ...w, isPrimary: w.id === id }));
};

export const getTransactions = () => transactions.map((t) => ({ ...t }));

export const getTotalBalance = () => wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
