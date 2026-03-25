import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

export default function WalletListItem({ wallet, isSelected, onSelect, onSetPrimary }) {
  return (
    <TouchableOpacity
      style={[
        styles.walletCard,
        { borderLeftColor: wallet.color },
        isSelected && styles.walletCardSelected,
      ]}
      onPress={() => onSelect && onSelect(wallet)}
      activeOpacity={0.7}
    >
      <View style={styles.walletHeader}>
        <View style={[styles.walletIcon, { backgroundColor: wallet.color + '20' }]}> 
          <Ionicons name="phone-portrait" size={24} color={wallet.color} />
        </View>
        <View style={styles.walletInfo}>
          <View style={styles.walletNameRow}>
            <Text style={styles.walletName}>{wallet.name}</Text>
            {wallet.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
            )}
          </View>
          <Text style={styles.walletProvider}>Mobile Money</Text>
        </View>
      </View>

      <View style={styles.walletBalance}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>{wallet.currency}{wallet.balance.toLocaleString()}</Text>
      </View>

      {isSelected && (
        <View style={styles.walletActions}>
          {!wallet.isPrimary && (
            <TouchableOpacity style={styles.setPrimaryButton} onPress={() => onSetPrimary && onSetPrimary(wallet)}>
              <Ionicons name="star-outline" size={16} color={COLORS.primary} />
              <Text style={styles.setPrimaryText}>Set as Primary</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  walletCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  walletCardSelected: {
    ...SHADOWS.md,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  walletInfo: {
    flex: 1,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  walletName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  primaryBadge: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  primaryBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  walletProvider: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  walletBalance: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  balanceLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  walletActions: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  setPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  setPrimaryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
});
