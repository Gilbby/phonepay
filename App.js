import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="CreateAlias" component={CreateAliasScreen} />
          
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
