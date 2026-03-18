// Mock Users
export const currentUser = {
  id: '1',
  name: 'Gibby Kombe',
  alias: '@gibby',
  phone: '+260971234567',
  isAgent: false,
  agentCode: 'AG001',
  agentEarnings: 500,
};

export const users = [
  { id: '1', name: 'Gibby Kombe', alias: '@gibby', phone: '+260971234567' },
  { id: '2', name: 'John Banda', alias: '@john', phone: '+260972345678' },
  { id: '3', name: 'Mary Phiri', alias: '@mary', phone: '+260973456789' },
  { id: '4', name: 'Peter Mwanza', alias: '@peter', phone: '+260974567890' },
];

// Mock Wallets
export const wallets = [
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

// Mock Transactions
export const transactions = [
  {
    id: '1',
    type: 'sent',
    amount: 100,
    currency: 'K',
    recipient: '@john',
    recipientName: 'John Banda',
    date: '2024-01-15T10:30:00',
    status: 'completed',
    fee: 2,
  },
  {
    id: '2',
    type: 'received',
    amount: 250,
    currency: 'K',
    sender: '@mary',
    senderName: 'Mary Phiri',
    date: '2024-01-14T14:20:00',
    status: 'completed',
    fee: 0,
  },
  {
    id: '3',
    type: 'sent',
    amount: 500,
    currency: 'K',
    recipient: '@peter',
    recipientName: 'Peter Mwanza',
    date: '2024-01-13T09:15:00',
    status: 'completed',
    fee: 5,
  },
  {
    id: '4',
    type: 'cash_out',
    amount: 200,
    currency: 'K',
    agentCode: 'AG045',
    date: '2024-01-12T16:45:00',
    status: 'completed',
    fee: 4,
  },
  {
    id: '5',
    type: 'received',
    amount: 1000,
    currency: 'K',
    sender: '@john',
    senderName: 'John Banda',
    date: '2024-01-11T11:00:00',
    status: 'completed',
    fee: 0,
  },
  {
    id: '6',
    type: 'sent',
    amount: 50,
    currency: 'K',
    recipient: '@mary',
    recipientName: 'Mary Phiri',
    date: '2024-01-10T08:30:00',
    status: 'pending',
    fee: 1,
  },
];

// Fee calculation (static mock)
export const calculateFee = (amount) => {
  if (amount <= 100) return 2;
  if (amount <= 500) return 5;
  if (amount <= 1000) return 10;
  return 15;
};

// Agents for Get Cash
export const agents = [
  { id: '1', code: 'AG001', name: 'City Market Agent', location: 'Lusaka' },
  { id: '2', code: 'AG045', name: 'Mall Agent', location: 'Kitwe' },
  { id: '3', code: 'AG102', name: 'Corner Shop Agent', location: 'Ndola' },
];

// Total balance calculation
export const getTotalBalance = () => {
  return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
};
