import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export interface User {
  id: string;
  name: string;
  alias: string;
  phone: string;
  isAgent?: boolean;
  agentCode?: string;
  agentEarnings?: number;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  isPrimary: boolean;
  color?: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  recipient?: string;
  recipientName?: string;
  sender?: string;
  senderName?: string;
  date: string;
  status: string;
  fee: number;
  agentCode?: string;
}

export interface Agent {
  id: string;
  code: string;
  name: string;
  location?: string;
}

export type MainTabsParamList = {
  Home: undefined;
  Transactions: undefined;
  Wallets: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  OTP: { phoneNumber?: string };
  CreateAlias: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  SendMoney: undefined;
  SendAmount: { recipient: User };
  SendConfirm: { recipient: User; amount: number; fee: number; total: number; wallet: Wallet };
  SendSuccess: { recipient: User; amount: number; fee: number };
  ReceiveMoney: undefined;
  GetCash: undefined;
  GetCashAmount: { agent: Agent };
  GetCashSuccess: { agent: Agent; amount: number; fee: number; total: number };
};

export type HomeScreenProps = BottomTabScreenProps<MainTabsParamList, 'Home'>;
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;
