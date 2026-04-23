import React, { useState, type ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { currentUser } from '../../data/mockData';
import { useWallets } from '../../context/WalletsContext';
import * as mockAdapter from '../../services/mockAdapter';
import WalletCard from '../../components/ui/WalletCard';
import TransactionItem from '../../components/ui/TransactionItem';
import { HomeScreenProps, RootStackParamList } from '../../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const QuickActionButton = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { wallets: walletList } = useWallets();

  const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const recentTransactions = mockAdapter.getTransactions().slice(0, 4);
  const totalBalance = (walletList || []).reduce((sum, w) => sum + (w.balance || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {currentUser.name.split(' ')[0]}</Text>
            <Text style={styles.alias}>{currentUser.alias}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>K{totalBalance.toLocaleString()}</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="trending-up" size={16} color={COLORS.secondaryLight} />
            <Text style={styles.balanceChange}>+12.5% this month</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              icon="send"
              label="Send"
              color={COLORS.primary}
              onPress={() => rootNav?.navigate('SendMoney')}
            />
            <QuickActionButton
              icon="download"
              label="Receive"
              color={COLORS.secondary}
              onPress={() => rootNav?.navigate('ReceiveMoney')}
            />
            <QuickActionButton
              icon="cash"
              label="Get Cash"
              color={COLORS.warning}
              onPress={() => rootNav?.navigate('GetCash')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Wallets</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Wallets')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {walletList.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsCard}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              </View>
            )}
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
  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  alias: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  balanceLabel: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  balanceChange: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondaryLight,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  transactionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});
