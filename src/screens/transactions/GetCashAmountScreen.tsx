import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useWallets } from '../../context/WalletsContext';
import calculateFee from '../../utils/calculateFee';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { RootStackScreenProps } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTransactions } from '../../context/TransactionsContext';
import { API_URL, authHeaders } from '../../config/api';

const PIN_LENGTH = 4;
const NUMPAD_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export default function GetCashAmountScreen({ navigation, route }: RootStackScreenProps<'GetCashAmount'>) {
  const { agent } = route.params;
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinError, setPinError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { wallets } = useWallets();
  const { token } = useApp();
  const { refresh } = useTransactions();
  const primaryWallet = wallets.find((w) => w.isPrimary) || wallets[0] || { balance: 0, name: '', currency: 'K' };

  const numericAmount = parseFloat(amount) || 0;
  const fee = calculateFee(numericAmount);
  const total = numericAmount + fee;
  const isValidAmount = numericAmount > 0;

  const quickAmounts = [100, 200, 500, 1000];

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
      const response = await fetch(`${API_URL}/transactions/cash-out`, {
        method: 'POST',
        headers: authHeaders(token!),
        body: JSON.stringify({
          agentCode: agent.code,
          amount: numericAmount,
          walletId: (primaryWallet as any).id,
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
        Alert.alert('Error', data.message || 'Withdrawal failed. Please try again.');
        return;
      }

      await refresh();
      closeModal();
      navigation.navigate('GetCashSuccess', {
        agent,
        amount: numericAmount,
        fee,
        total,
      });
    } catch {
      closeModal();
      Alert.alert('Error', 'Withdrawal failed. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.agentCard}>
          <View style={styles.agentIcon}>
            <Ionicons name="storefront" size={24} color={COLORS.warning} />
          </View>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <Text style={styles.agentCode}>{agent.code}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Withdrawal Amount</Text>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencySymbol}>K</Text>
            <Input
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
              maxLength={10}
              autoFocus
            />
          </View>
          <Text style={styles.balanceText}>
            Withdrawing from {(primaryWallet as any).provider ?? primaryWallet.name ?? ''} wallet
          </Text>
        </View>

        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                parseFloat(amount) === quickAmount && styles.quickAmountButtonActive,
              ]}
              onPress={() => setAmount(quickAmount.toString())}
            >
              <Text
                style={[
                  styles.quickAmountText,
                  parseFloat(amount) === quickAmount && styles.quickAmountTextActive,
                ]}
              >
                K{quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isValidAmount && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Withdrawal Summary</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Cash to Receive</Text>
              <Text style={styles.breakdownValue}>K{numericAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Agent Fee</Text>
              <Text style={styles.breakdownValue}>K{fee.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.totalLabel}>Total Debit</Text>
              <Text style={styles.totalValue}>K{total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Show this screen to the agent to complete your cash withdrawal.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          style={[
            styles.withdrawButton,
            !isValidAmount && styles.withdrawButtonDisabled,
          ]}
          onPress={() => setShowPinModal(true)}
          disabled={!isValidAmount}
        >
          <Ionicons name="cash" size={20} color={COLORS.white} />
          <Text style={styles.withdrawButtonText}>Get Cash</Text>
        </Button>
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
            <Text style={styles.modalSubtitle}>Authorise this withdrawal</Text>

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
    </KeyboardAvoidingView>
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
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  agentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  agentCode: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '500',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  amountLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    minWidth: 100,
    textAlign: 'center',
  },
  balanceText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  quickAmountButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickAmountButtonActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  quickAmountText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  quickAmountTextActive: {
    color: COLORS.white,
  },
  breakdownCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  breakdownTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  breakdownLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
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
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.warning,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '15',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  warningText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 142,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  withdrawButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  withdrawButtonText: {
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
