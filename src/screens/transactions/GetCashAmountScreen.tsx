import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useWallets } from '../../context/WalletsContext';
import calculateFee from '../../utils/calculateFee';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { RootStackScreenProps } from '../../types';

export default function GetCashAmountScreen({ navigation, route }: RootStackScreenProps<'GetCashAmount'>) {
  const { agent } = route.params;
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useWallets();
  const primaryWallet = wallets.find((w) => w.isPrimary) || wallets[0] || { balance: 0, name: '', currency: 'K' };

  const numericAmount = parseFloat(amount) || 0;
  const fee = calculateFee(numericAmount);
  const total = numericAmount + fee;
  const hasInsufficientFunds = total > (primaryWallet.balance || 0);
  const isValidAmount = numericAmount > 0;

  const quickAmounts = [100, 200, 500, 1000];

  const handleWithdraw = () => {
    if (!isValidAmount || hasInsufficientFunds) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('GetCashSuccess', {
        agent,
        amount: numericAmount,
        fee,
        total,
      });
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
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
      </View>

      <View style={styles.footer}>
        <Button
          style={[
            styles.withdrawButton,
            (!isValidAmount || hasInsufficientFunds) && styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          disabled={!isValidAmount || hasInsufficientFunds || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="cash" size={20} color={COLORS.white} />
              <Text style={styles.withdrawButtonText}>Get Cash</Text>
            </>
          )}
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
});
