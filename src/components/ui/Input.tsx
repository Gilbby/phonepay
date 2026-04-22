import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export default function Input({ style, ...props }: InputProps) {
  return <TextInput style={[styles.input, style]} placeholderTextColor={COLORS.textMuted} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
  },
});
