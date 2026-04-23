import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { AuthStackScreenProps } from '../../types';

export default function OTPScreen({ navigation, route }: AuthStackScreenProps<'OTP'>) {
  const [code, setCode] = useState('');
  const phoneNumber = route.params?.phoneNumber ?? '';

  const handleVerify = () => {
    navigation.replace('CreateAlias');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={48} color={COLORS.primary} />
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>We sent a code to {phoneNumber}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Verify</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  form: {
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    ...SHADOWS.sm,
  },
  button: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
