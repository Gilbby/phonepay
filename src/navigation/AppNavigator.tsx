import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

// Transaction Screens (kept at root stack so deep linking/navigation matches)
import TransactionStack from './TransactionStack';
import { useApp } from '../context/AppContext';
import { ActivityIndicator, View } from 'react-native';

import { COLORS } from '../constants/theme';
import { RootStackParamList } from '../types';
import { TransactionsProvider } from '../context/TransactionsContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <TransactionsProvider>
      <Stack.Navigator
        id="root"
        initialRouteName={isAuthenticated ? 'MainTabs' : 'Auth'}
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

        {/* Nested transaction stack */}
        <Stack.Screen name="TransactionStack" component={TransactionStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </TransactionsProvider>
  );
}
