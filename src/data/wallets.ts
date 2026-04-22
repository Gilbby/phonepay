import { Wallet } from '../types';

export const wallets: Wallet[] = [
  {
    id: '1',
    name: 'MTN',
    balance: 1200,
    currency: 'K',
    isPrimary: true,
    color: '#FFCC00',
    icon: 'phone-portrait',
  },
  {
    id: '2',
    name: 'Airtel',
    balance: 530,
    currency: 'K',
    isPrimary: false,
    color: '#E4002B',
    icon: 'phone-portrait',
  },
  {
    id: '3',
    name: 'Zamtel',
    balance: 0,
    currency: 'K',
    isPrimary: false,
    color: '#00A651',
    icon: 'phone-portrait',
  },
];
