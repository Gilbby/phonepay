import { wallets as walletsData } from './wallets';
import { transactions as transactionsData } from './transactions';
import { Wallet, Transaction, Agent } from '../types';

// Compatibility layer re-exporting split data modules
export { currentUser } from './users';
export { wallets } from './wallets';
export { transactions } from './transactions';
export { users } from './users';

// Fee calculation (kept here for now)
export const calculateFee = (amount: number) => {
  if (amount <= 100) return 2;
  if (amount <= 500) return 5;
  if (amount <= 1000) return 10;
  return 15;
};

export const agents: Agent[] = [
  { id: '1', code: 'AG001', name: 'City Market Agent', location: 'Lusaka' },
  { id: '2', code: 'AG045', name: 'Mall Agent', location: 'Kitwe' },
  { id: '3', code: 'AG102', name: 'Corner Shop Agent', location: 'Ndola' },
];

export const getTotalBalance = () => {
  // import dynamically to avoid circular issues in some move sequences
  const { wallets } = require('./wallets');
  return (wallets as Wallet[]).reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
};
