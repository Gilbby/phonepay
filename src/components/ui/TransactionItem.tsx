import React, { type ComponentProps } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { Transaction } from '../../types';

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const isSent = transaction.type === 'sent' || transaction.type === 'cash_out';
  const icon: ComponentProps<typeof Ionicons>['name'] =
    transaction.type === 'cash_out' ? 'cash' : isSent ? 'arrow-up' : 'arrow-down';
  const color = isSent ? COLORS.error : COLORS.success;

  const getName = () => {
    if (transaction.type === 'sent') return transaction.recipientName;
    if (transaction.type === 'received') return transaction.senderName;
    if (transaction.type === 'cash_out') return `Agent ${transaction.agentCode}`;
    return 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}> 
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>{getName()}</Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color }]}> {isSent ? '-' : '+'}K{transaction.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  transactionDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
