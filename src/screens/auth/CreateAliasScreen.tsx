import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAlias'>;

export default function CreateAliasScreen({ navigation }: Props) {
  const [alias, setAlias] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAliasChange = (text: string): void => {
    const cleanText = text.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setAlias(cleanText);
    setError('');
  };

  const handleContinue = (): void => {
    if (alias.length < 3) {
      setError('Alias must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.replace('MainTabs');
    }, 1500);
  };

  const isValidAlias = alias.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="at" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Create Your Alias</Text>
            <Text style={styles.subtitle}>
              Choose a unique username that others can use to send you money
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your Alias</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.atSymbol}>@</Text>
              <TextInput
                style={styles.input}
                placeholder="yourname"
                placeholderTextColor={COLORS.textMuted}
                value={alias}
                onChangeText={handleAliasChange}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
              {isValidAlias && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                </View>
              )}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.hintContainer}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.hintText}>
                3-20 characters, letters, numbers, and underscores only
              </Text>
            </View>

            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewAvatar}>
                  <Ionicons name="person" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>Your Name</Text>
                  <Text style={styles.previewAlias}>
                    @{alias || 'yourname'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !isValidAlias && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValidAlias || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    marginLeft: -SPACING.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight + '30',
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
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  form: { marginBottom: SPACING.xl },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
  },
  atSymbol: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
  },
  checkIcon: { marginLeft: SPACING.sm },
  errorText: { color: COLORS.error, fontSize: FONTS.sizes.sm, marginTop: SPACING.sm },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  hintText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  previewContainer: { marginTop: SPACING.xl },
  previewLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  previewInfo: { flex: 1 },
  previewName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  previewAlias: { fontSize: FONTS.sizes.sm, color: COLORS.primary, marginTop: 2 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    marginTop: 'auto',
    ...SHADOWS.md,
  },
  buttonDisabled: { backgroundColor: COLORS.textMuted },
  buttonText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.white },
});