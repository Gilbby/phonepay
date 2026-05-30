import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { API_URL } from '../../config/api';

const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 5;

const NUMPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

type ViewMode = 'loading' | 'biometric' | 'pin';

type Props = {
  onUnlock: () => void;
  onLockout: () => void;
};

export default function AppLockScreen({ onUnlock, onLockout }: Props) {
  const [mode, setMode] = useState<ViewMode>('loading');
  const [pin, setPin] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const attemptCount = useRef(0);

  const shake = (onDone?: () => void) => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => onDone?.());
  };

  const triggerBiometric = async () => {
    setMode('biometric');
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
        disableDeviceFallback: false,
      });
      if (result.success) {
        onUnlock();
      } else {
        setMode('pin');
      }
    } catch {
      setMode('pin');
    }
  };

  useEffect(() => {
    const init = async () => {
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supported = hasHardware && isEnrolled;
      setBiometricsAvailable(supported);

      if (biometricEnabled === 'true' && supported) {
        void triggerBiometric();
      } else {
        setMode('pin');
      }
    };
    void init();
  }, []);

  const handlePinFailure = (count: number) => {
    shake(() => {
      setPin([]);
      if (count >= MAX_ATTEMPTS) {
        setErrorMessage('Too many attempts. Please log in again.');
        setTimeout(() => onLockout(), 1500);
      } else {
        setErrorMessage('Incorrect PIN');
      }
    });
  };

  const verifyPin = async (pinString: string) => {
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const pinHash = await SecureStore.getItemAsync('pin_hash');
      let success = false;

      if (pinHash) {
        success = await bcrypt.compare(pinString, pinHash);
      } else {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${API_URL}/auth/verify-pin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pin: pinString }),
        });
        success = res.ok;
      }

      if (success) {
        onUnlock();
        return;
      }

      attemptCount.current += 1;
      handlePinFailure(attemptCount.current);
    } catch {
      attemptCount.current += 1;
      handlePinFailure(attemptCount.current);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH || isVerifying) return;
    const newPin = [...pin, digit];
    setPin(newPin);
    setErrorMessage('');
    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => void verifyPin(newPin.join('')), 120);
    }
  };

  const handleBackspace = () => {
    if (isVerifying) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  if (mode === 'loading') {
    return (
      <View style={styles.splash}>
        <Text style={styles.logoText}>PhonePay</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (mode === 'biometric') {
    return (
      <View style={styles.splash}>
        <Text style={styles.logoText}>PhonePay</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <TouchableOpacity style={styles.textLink} onPress={() => setMode('pin')}>
          <Text style={styles.textLinkText}>Use PIN instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logoText}>PhonePay</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Enter your PIN</Text>
          <Text style={styles.subtitle}>Verify your identity to continue</Text>
        </View>

        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
          ))}
        </Animated.View>

        <Text style={[styles.errorText, { opacity: errorMessage ? 1 : 0 }]}>
          {errorMessage || ' '}
        </Text>

        {isVerifying ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
        ) : (
          <View style={styles.numpad}>
            {NUMPAD_KEYS.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.numpadRow}>
                {row.map((key, colIdx) => {
                  if (key === '') return <View key={colIdx} style={styles.numpadKey} />;
                  if (key === 'backspace') {
                    return (
                      <TouchableOpacity
                        key={colIdx}
                        style={styles.numpadKey}
                        onPress={handleBackspace}
                        activeOpacity={0.6}
                      >
                        <Ionicons name="backspace-outline" size={26} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={colIdx}
                      style={styles.numpadKey}
                      onPress={() => handleDigit(key)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.numpadDigit}>{key}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {biometricsAvailable && (
          <TouchableOpacity style={styles.textLink} onPress={() => void triggerBiometric()}>
            <Text style={styles.textLinkText}>Try biometrics again</Text>
          </TouchableOpacity>
        )}
      </View>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    minHeight: FONTS.sizes.sm + 4,
  },
  loader: {
    marginTop: SPACING.xl,
  },
  numpad: {
    width: '100%',
    maxWidth: 320,
    gap: SPACING.sm,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  numpadKey: {
    flex: 1,
    aspectRatio: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadDigit: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  textLink: {
    marginTop: SPACING.xl,
  },
  textLinkText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
