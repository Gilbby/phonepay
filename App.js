import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

// Auth Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import CreateAliasScreen from './src/screens/auth/CreateAliasScreen';

// Main App
import MainTabs from './src/navigation/MainTabs';

// Transaction Screens
import SendMoneyScreen from './src/screens/transactions/SendMoneyScreen';
import SendAmountScreen from './src/screens/transactions/SendAmountScreen';
import SendConfirmScreen from './src/screens/transactions/SendConfirmScreen';
import SendSuccessScreen from './src/screens/transactions/SendSuccessScreen';
import ReceiveMoneyScreen from './src/screens/transactions/ReceiveMoneyScreen';
import GetCashScreen from './src/screens/transactions/GetCashScreen';
import GetCashAmountScreen from './src/screens/transactions/GetCashAmountScreen';
import GetCashSuccessScreen from './src/screens/transactions/GetCashSuccessScreen';

import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
