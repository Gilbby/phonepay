import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useWallets } from '../../context/WalletsContext';
import WalletCard from '../../components/ui/WalletCard';
import { API_URL, authHeaders } from '../../config/api';
import { useApp } from '../../context/AppContext';

export default function WalletsScreen() {
  const [selectedWallet, setSelectedWallet] = useState<{ id: string } | null>(null);
  const { wallets: localWallets, refresh, setPrimary } = useWallets();
  const { token } = useApp();
  const [showBalance, setShowBalance] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const handleSetPrimary = (wallet: { id: string }) => {
    setPrimary(wallet.id);
    setSelectedWallet(null);
  };

  const handleAddWallet = async () => {
    if (newPhone.length < 9) {
      setAddError('Please enter a valid phone number');
      return;
    }
    setIsAdding(true);
    setAddError('');
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        method: 'POST',
        headers: authHeaders(token!),
        body: JSON.stringify({ phone: `+260${newPhone}` }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAddError(data.message || 'Failed to add wallet');
        return;
      }
      await refresh();
      setNewPhone('');
      setShowAddModal(false);
    } catch {
      setAddError('Failed to add wallet. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveWallet = (wallet: { id: string; isPrimary?: boolean }) => {
    if (wallet.isPrimary) {
      Alert.alert('Cannot Remove', 'Set another wallet as primary first before removing this one.');
      return;
    }
    Alert.alert(
      'Remove Wallet',
      'Are you sure you want to remove this wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_URL}/wallets/${wallet.id}`, {
                method: 'DELETE',
                headers: authHeaders(token!),
              });
              await refresh();
              setSelectedWallet(null);
            } catch {
              Alert.alert('Error', 'Failed to remove wallet.');
            }
          },
        },
      ]
    );
  };

  const totalBalance = localWallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallets</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

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
            <Text style={styles.walletsCount}>{localWallets.length} wallets connected</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Wallets</Text>
          {localWallets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>No wallets added yet</Text>
              <Text style={styles.emptyStateSubtext}>Tap + to add your first wallet</Text>
            </View>
          ) : (
            localWallets.map((wallet) => (
              <React.Fragment key={wallet.id}>
                <WalletCard
                  wallet={wallet}
                  onPress={setSelectedWallet}
                  onLongPress={handleSetPrimary}
                />
                {selectedWallet?.id === wallet.id && (
                  <View style={styles.walletActions}>
                    <TouchableOpacity
                      style={styles.setPrimaryButton}
                      onPress={() => handleSetPrimary(wallet)}
                    >
                      <Ionicons name="star-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.setPrimaryText}>Set as Primary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveWallet(wallet)}
                    >
                      <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                      <Text style={styles.removeButtonText}>Remove Wallet</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </React.Fragment>
            ))
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.addWalletCard} onPress={() => setShowAddModal(true)}>
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

      {/* Add Wallet Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Wallet</Text>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setNewPhone(''); setAddError(''); }}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your mobile money phone number
            </Text>

            <View style={styles.modalInputContainer}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefix}>+260</Text>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="97 123 4567"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={newPhone}
                onChangeText={(text) => {
                  setNewPhone(text.replace(/[^0-9]/g, ''));
                  setAddError('');
                }}
                maxLength={10}
                autoFocus
              />
            </View>

            {addError ? <Text style={styles.errorText}>{addError}</Text> : null}

            <Text style={styles.providerHint}>
              Provider will be detected automatically (MTN, Airtel, Zamtel)
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, (newPhone.length < 9 || isAdding) && styles.modalButtonDisabled]}
              onPress={handleAddWallet}
              disabled={newPhone.length < 9 || isAdding}
              activeOpacity={0.8}
            >
              {isAdding ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.modalButtonText}>Add Wallet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  walletActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  setPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight + '20',
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  setPrimaryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.error + '15',
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  removeButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.error,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  prefixContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  prefix: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalInput: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.sm,
  },
  providerHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  modalButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  modalButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});