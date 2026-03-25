import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

export default function Input({ style, ...props }) {
  return <TextInput style={[styles.input, style]} placeholderTextColor={COLORS.textMuted} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
  },
});
