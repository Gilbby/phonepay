import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useWallets } from '../../context/WalletsContext';
import calculateFee from '../../utils/calculateFee';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { RootStackScreenProps } from '../../types';

export default function SendAmountScreen({ navigation, route }: RootStackScreenProps<'SendAmount'>) {
  const { recipient } = route.params;
  const [amount, setAmount] = useState('');
  const { wallets } = useWallets();
  const primaryWallet = wallets.find((w) => w.isPrimary) || wallets[0] || { id: 'unknown', isPrimary: false, balance: 0, name: '', currency: 'K' };

  const numericAmount = parseFloat(amount) || 0;
  const fee = calculateFee(numericAmount);
  const total = numericAmount + fee;
  const hasInsufficientFunds = total > (primaryWallet.balance || 0);
  const isValidAmount = numericAmount > 0;

  const quickAmounts = [50, 100, 200, 500];

  const handleContinue = () => {
    if (!isValidAmount || hasInsufficientFunds) return;
    navigation.navigate('SendConfirm', {
      recipient,
      amount: numericAmount,
      fee,
      total,
      wallet: primaryWallet,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.recipientCard}>
          <View style={styles.recipientAvatar}>
            <Text style={styles.recipientInitial}>{recipient.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientName}>{recipient.name}</Text>
            <Text style={styles.recipientAlias}>{recipient.alias}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
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
            Available: K{(primaryWallet.balance || 0).toLocaleString()} ({primaryWallet.name})
          </Text>
          {hasInsufficientFunds && (
            <Text style={styles.errorText}>Insufficient balance</Text>
          )}
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
          <View style={styles.feeCard}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Amount</Text>
              <Text style={styles.feeValue}>K{numericAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Transaction Fee</Text>
              <Text style={styles.feeValue}>K{fee.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.feeRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>K{total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <Button
          style={[
            styles.continueButton,
            (!isValidAmount || hasInsufficientFunds) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isValidAmount || hasInsufficientFunds}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </Button>
      </View>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  recipientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  recipientInitial: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  recipientAlias: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
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
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
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
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickAmountText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  quickAmountTextActive: {
    color: COLORS.white,
  },
  feeCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  feeLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  feeValue: {
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
    color: COLORS.primary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: 'auto',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  continueButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
