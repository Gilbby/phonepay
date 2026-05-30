import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { API_URL, authHeaders } from '../../config/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetupPin'>;

const PIN_LENGTH = 4;

const NUMPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export default function SetupPinScreen({ navigation }: Props) {
  const { token } = useApp();
  const [pin, setPin] = useState<string[]>([]);
  const [firstPin, setFirstPin] = useState<string>('');
  const [phase, setPhase] = useState<'enter' | 'confirm'>('enter');
  const [isLoading, setIsLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = (onDone?: () => void) => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => onDone?.());
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = [...pin, digit];
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      const pinString = newPin.join('');
      if (phase === 'enter') {
        setTimeout(() => {
          setFirstPin(pinString);
          setPhase('confirm');
          setPin([]);
        }, 120);
      } else {
        if (pinString === firstPin) {
          void submitPin(pinString);
        } else {
          shake(() => {
            setPin([]);
          });
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const submitPin = async (pinString: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/set-pin`, {
        method: 'POST',
        headers: authHeaders(token!),
        body: JSON.stringify({ pin: pinString }),
      });

      if (!response.ok) {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to set PIN. Please try again.');
        setPin([]);
        setFirstPin('');
        setPhase('enter');
        return;
      }

      navigation.replace('SetupBiometric');
    } catch {
      Alert.alert('Error', 'Could not set PIN. Check your connection.');
      setPin([]);
      setFirstPin('');
      setPhase('enter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>
            {phase === 'enter' ? 'Create Your PIN' : 'Confirm Your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {phase === 'enter'
              ? 'Choose a 4-digit PIN to secure your account'
              : 'Enter your PIN again to confirm'}
          </Text>
        </View>

        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < pin.length && styles.dotFilled,
              ]}
            />
          ))}
        </Animated.View>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
        ) : (
          <View style={styles.numpad}>
            {NUMPAD_KEYS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.numpadRow}>
                {row.map((key, colIndex) => {
                  if (key === '') {
                    return <View key={colIndex} style={styles.numpadKey} />;
                  }
                  if (key === 'backspace') {
                    return (
                      <TouchableOpacity
                        key={colIndex}
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
                      key={colIndex}
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

        {phase === 'confirm' && (
          <TouchableOpacity
            style={styles.startOver}
            onPress={() => {
              setPin([]);
              setFirstPin('');
              setPhase('enter');
            }}
          >
            <Text style={styles.startOverText}>Start over</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
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
  loader: { marginTop: SPACING.xl },
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
  startOver: { marginTop: SPACING.xl },
  startOverText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});
