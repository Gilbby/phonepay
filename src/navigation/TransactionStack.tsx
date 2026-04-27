import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SendMoneyScreen from '../screens/transactions/SendMoneyScreen';
import SendAmountScreen from '../screens/transactions/SendAmountScreen';
import SendConfirmScreen from '../screens/transactions/SendConfirmScreen';
import SendSuccessScreen from '../screens/transactions/SendSuccessScreen';
import ReceiveMoneyScreen from '../screens/transactions/ReceiveMoneyScreen';
import GetCashScreen from '../screens/transactions/GetCashScreen';
import GetCashAmountScreen from '../screens/transactions/GetCashAmountScreen';
import GetCashSuccessScreen from '../screens/transactions/GetCashSuccessScreen';
import { COLORS } from '../constants/theme';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function TransactionStack() {
  return (
    <Stack.Navigator id="transactions">
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

      <Stack.Screen
        name="ReceiveMoney"
        component={ReceiveMoneyScreen}
        options={{ headerShown: true, headerTitle: 'Receive Money', headerTintColor: COLORS.primary }}
      />

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
