import React, { useEffect, useRef } from 'react';
import {
  AppState,
  AppStateStatus,
  PanResponder,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import TransactionStack from './TransactionStack';
import AppLockScreen from '../screens/auth/AppLockScreen';
import { useApp } from '../context/AppContext';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { RootStackParamList } from '../types';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, logout } = useApp();
  const backgroundedAt = useRef<number | null>(null);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!isAuthenticated) return;
    idleTimer.current = setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('AppLock');
      }
    }, IDLE_TIMEOUT);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetIdleTimer();
        return false; // detect touch but don't consume it
      },
    })
  ).current;

  useEffect(() => {
    if (isAuthenticated) resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isAuthenticated]);

  // Re-lock after 30 seconds in background. Uses navigationRef so this can
  // fire regardless of which screen is currently active in the stack.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundedAt.current = Date.now();
      } else if (nextState === 'active') {
        if (
          isAuthenticated &&
          backgroundedAt.current !== null &&
          Date.now() - backgroundedAt.current > 30_000
        ) {
          backgroundedAt.current = null;
          if (navigationRef.isReady()) {
            navigationRef.navigate('AppLock');
          }
        }
      }
    });
    return () => subscription.remove();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>Snappay</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
    <Stack.Navigator
      id="root"
      initialRouteName={isAuthenticated ? 'AppLock' : 'Auth'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen
        name="AppLock"
        options={{ headerShown: false, gestureEnabled: false }}
      >
        {(props) => (
          <AppLockScreen
            onUnlock={() => props.navigation.replace('MainTabs')}
            onLockout={async () => {
              await logout();
              props.navigation.replace('Auth');
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="TransactionStack"
        component={TransactionStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.lg,
  },
  splashLogo: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
