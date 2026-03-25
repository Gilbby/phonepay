import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

// Transaction Screens (kept at root stack so deep linking/navigation matches)
import SendMoneyScreen from '../screens/transactions/SendMoneyScreen';
import SendAmountScreen from '../screens/transactions/SendAmountScreen';
import SendConfirmScreen from '../screens/transactions/SendConfirmScreen';
import SendSuccessScreen from '../screens/transactions/SendSuccessScreen';
import ReceiveMoneyScreen from '../screens/transactions/ReceiveMoneyScreen';
import GetCashScreen from '../screens/transactions/GetCashScreen';
import GetCashAmountScreen from '../screens/transactions/GetCashAmountScreen';
import GetCashSuccessScreen from '../screens/transactions/GetCashSuccessScreen';

import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      {/* Auth flow */}
      <Stack.Screen name="Auth" component={AuthStack} />

      {/* Main App */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Send Money Flow */}
      <Stack.Screen
        name="SendMoney"
        component={SendMoneyScreen}
        options={{ headerShown: true, headerTitle: 'Send Money', headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="SendAmount"
        component={SendAmountScreen}
        options={{ headerShown: true, headerTitle: 'Enter Amount', headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="SendConfirm"
        component={SendConfirmScreen}
        options={{ headerShown: true, headerTitle: 'Confirm', headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="SendSuccess"
        component={SendSuccessScreen}
        options={{ headerShown: false }}
      />

      {/* Receive Money */}
      <Stack.Screen
        name="ReceiveMoney"
        component={ReceiveMoneyScreen}
        options={{ headerShown: true, headerTitle: 'Receive Money', headerTintColor: COLORS.primary }}
      />

      {/* Get Cash Flow */}
      <Stack.Screen
        name="GetCash"
        component={GetCashScreen}
        options={{ headerShown: true, headerTitle: 'Get Cash', headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="GetCashAmount"
        component={GetCashAmountScreen}
        options={{ headerShown: true, headerTitle: 'Cash Amount', headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="GetCashSuccess"
        component={GetCashSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
