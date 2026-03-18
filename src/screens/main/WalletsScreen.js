import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { wallets, getTotalBalance } from '../../data/mockData';

const WalletCard = ({ wallet, isSelected, onSelect, onSetPrimary }) => (
  <TouchableOpacity
    style={[
      styles.walletCard,
      { borderLeftColor: wallet.color },
      isSelected && styles.walletCardSelected,
    ]}
    onPress={() => onSelect(wallet)}
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
      <Text style={styles.balanceAmount}>
        {wallet.currency}{wallet.balance.toLocaleString()}
      </Text>
    </View>

    {isSelected && (
      <View style={styles.walletActions}>
        {!wallet.isPrimary && (
          <TouchableOpacity
            style={styles.setPrimaryButton}
            onPress={() => onSetPrimary(wallet)}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.primary} />
            <Text style={styles.setPrimaryText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export default function WalletsScreen() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [localWallets, setLocalWallets] = useState(wallets);
  const [showBalance, setShowBalance] = useState(true);

  const handleSetPrimary = (wallet) => {
    setLocalWallets((prev) =>
      prev.map((w) => ({
        ...w,
        isPrimary: w.id === wallet.id,
      }))
    );
  };

  const totalBalance = localWallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallets</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <View style={styles.totalBalanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.totalLabel}>Total Balance</Text>
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setShowBalance(!showBalance)}
            >
              <Ionicons
                name={showBalance ? 'eye' : 'eye-off'}
                size={20}
                color="rgba(255, 255, 255, 0.7)"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalAmount}>
            {showBalance ? `K${totalBalance.toLocaleString()}` : '••••••'}
          </Text>
          <View style={styles.walletsCountRow}>
            <Ionicons name="wallet" size={16} color={COLORS.secondaryLight} />
            <Text style={styles.walletsCount}>
              {localWallets.length} wallets connected
            </Text>
          </View>
        </View>

        {/* Wallets List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Wallets</Text>
          {localWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isSelected={selectedWallet?.id === wallet.id}
              onSelect={setSelectedWallet}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </View>

        {/* Add Wallet Card */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addWalletCard}>
            <View style={styles.addWalletIcon}>
              <Ionicons name="add" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.addWalletInfo}>
              <Text style={styles.addWalletTitle}>Add New Wallet</Text>
              <Text style={styles.addWalletSubtitle}>
                Connect another mobile money account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="eye-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.settingLabel}>Show Balance</Text>
              </View>
              <Switch
                value={showBalance}
                onValueChange={setShowBalance}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={showBalance ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.settingLabel}>Transaction Alerts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <View style={styles.settingDivider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.settingLabel}>Spending Limits</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBalanceCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  visibilityToggle: {
    padding: SPACING.xs,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  walletsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  walletsCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondaryLight,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
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
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight + '20',
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  addWalletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addWalletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  addWalletInfo: {
    flex: 1,
  },
  addWalletTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  addWalletSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
