import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { AuthStackScreenProps, RootStackParamList } from '../../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function CreateAliasScreen({ navigation }: AuthStackScreenProps<'CreateAlias'>) {
  const [alias, setAlias] = useState('');

  const handleCreate = () => {
    const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    rootNav?.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="create" size={48} color={COLORS.primary} />
        <Text style={styles.title}>Create an Alias</Text>
        <Text style={styles.subtitle}>Choose a unique alias for easy payments</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={alias}
          onChangeText={setAlias}
          placeholder="@youralias"
          placeholderTextColor={COLORS.textMuted}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Create Alias</Text>
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
