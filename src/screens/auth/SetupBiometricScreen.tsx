import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { AuthStackParamList, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetupBiometric'>;

export default function SetupBiometricScreen({ navigation }: Props) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supported = hasHardware && isEnrolled;
      if (!supported) {
        await AsyncStorage.setItem('biometric_enabled', 'false');
        navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
        return;
      }
      setIsSupported(true);
    };
    void checkBiometrics();
  }, []);

  const goToMain = async (enabled: boolean) => {
    await AsyncStorage.setItem('biometric_enabled', enabled ? 'true' : 'false');
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.reset({
      index: 0,
      routes: [{ name: 'MainTabs' as never }],
    });
  };

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm to enable biometric login',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await goToMain(true);
      } else {
        Alert.alert('Biometric setup cancelled', 'You can enable this later in Settings.');
      }
    } catch {
      Alert.alert('Error', 'Biometric authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSupported === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isSupported ? 'finger-print' : 'lock-open-outline'}
            size={48}
            color={isSupported ? COLORS.primary : COLORS.textMuted}
          />
        </View>

        <Text style={styles.title}>
          {isSupported ? 'Enable Biometric Login' : 'Biometrics Not Available'}
        </Text>

        <Text style={styles.subtitle}>
          {isSupported
            ? 'Use Face ID or fingerprint to sign in quickly and securely.'
            : 'Your device does not support biometric authentication or no biometrics are enrolled.'}
        </Text>

        {isSupported && (
          <View style={styles.featureList}>
            {['Faster sign-in', 'Secure and private', 'Enable anytime in Settings'].map((f) => (
              <View key={f} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          {isSupported && (
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleEnable}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="finger-print" size={20} color={COLORS.white} />
                  <Text style={styles.enableButtonText}>Enable Biometrics</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.skipButton, !isSupported && styles.skipButtonPrimary]}
            onPress={() => void goToMain(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipText, !isSupported && styles.skipTextPrimary]}>
              {isSupported ? 'Skip for now' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  featureList: {
    alignSelf: 'stretch',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  actions: {
    alignSelf: 'stretch',
    gap: SPACING.md,
    marginTop: 'auto',
    paddingBottom: SPACING.xl,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  enableButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  skipButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  skipText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  skipTextPrimary: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
