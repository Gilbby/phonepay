import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackScreenProps } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTransactions } from '../../context/TransactionsContext';
import { API_URL, authHeaders } from '../../config/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PIN_LENGTH = 4;
const NUMPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export default function SendConfirmScreen({ navigation, route }: RootStackScreenProps<'SendConfirm'>) {
  const { recipient, amount, fee, total, wallet } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinError, setPinError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { token } = useApp();
  const { refresh } = useTransactions();
  const insets = useSafeAreaInsets();

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = () => {
    setShowPinModal(false);
    setPinDigits([]);
    setPinError('');
  };

  const handleDigit = (digit: string) => {
    if (pinDigits.length >= PIN_LENGTH || isLoading) return;
    const next = [...pinDigits, digit];
    setPinDigits(next);
    setPinError('');
    if (next.length === PIN_LENGTH) {
      void submitWithPin(next.join(''));
    }
  };

  const handleBackspace = () => {
    if (isLoading) return;
    setPinDigits((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const submitWithPin = async (pin: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions/send`, {
        method: 'POST',
        headers: authHeaders(token!),
        body: JSON.stringify({
          recipientAlias: recipient.alias,
          recipientPhone: recipient.phone,
          amount,
          senderWalletId: wallet.id,
          pin,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        shake();
        setPinError('Incorrect PIN');
        setPinDigits([]);
        return;
      }

      if (!response.ok) {
        closeModal();
        Alert.alert('Error', data.message || 'Transaction failed. Please try again.');
        return;
      }

      await refresh();
      closeModal();
      navigation.navigate('SendSuccess', { recipient, amount, fee });
    } catch {
      closeModal();
      Alert.alert('Error', 'Transaction failed. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryHeader}>
          <Ionicons name="paper-plane" size={48} color={COLORS.primary} />
          <Text style={styles.summaryTitle}>Confirm Transfer</Text>
          <Text style={styles.summarySubtitle}>
            Please review the details below
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sending to</Text>
            <View style={styles.detailValue}>
              <View style={styles.recipientAvatar}>
                <Text style={styles.recipientInitial}>
                  {recipient.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.recipientName}>{recipient.name}</Text>
                <Text style={styles.recipientAlias}>{recipient.alias}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailText}>K{amount.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Fee</Text>
            <Text style={styles.detailText}>K{fee.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Debit</Text>
            <Text style={styles.totalValue}>K{total.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>From Wallet</Text>
            <View style={styles.walletInfo}>
              <View style={[styles.walletDot, { backgroundColor: (wallet as any).color ?? COLORS.primary }]} />
              <Text style={styles.detailText}>{(wallet as any).provider ?? wallet.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="information-circle" size={20} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Please ensure the recipient details are correct. Transactions cannot be reversed.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setShowPinModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Send Money</Text>
          <Ionicons name="send" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={isLoading ? undefined : closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              disabled={isLoading}
              activeOpacity={0.6}
            >
              <Ionicons
                name="close"
                size={24}
                color={isLoading ? COLORS.textMuted : COLORS.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.lockIconCircle}>
              <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
            </View>

            <Text style={styles.modalTitle}>Enter PIN to confirm</Text>
            <Text style={styles.modalSubtitle}>Authorise this transfer</Text>

            <Animated.View
              style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}
            >
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i < pinDigits.length && styles.dotFilled]}
                />
              ))}
            </Animated.View>

            <View style={styles.pinErrorContainer}>
              {pinError ? (
                <Text style={styles.pinError}>{pinError}</Text>
              ) : null}
            </View>

            {isLoading ? (
              <ActivityIndicator
                color={COLORS.primary}
                size="large"
                style={styles.loader}
              />
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
                            <Ionicons
                              name="backspace-outline"
                              size={26}
                              color={COLORS.textPrimary}
                            />
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  summarySubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  recipientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientInitial: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  recipientName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  recipientAlias: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  walletDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '15',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  warningText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    height: 100,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  confirmButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  // PIN modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.md,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.xs,
  },
  lockIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
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
  pinErrorContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pinError: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  loader: {
    marginVertical: SPACING.xl,
  },
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
});
