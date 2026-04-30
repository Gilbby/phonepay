import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Wallet } from '../../types';

interface Props {
  wallet?: Wallet;
  onPress?: (w: Wallet) => void;
  onLongPress?: (w: Wallet) => void;
  style?: StyleProp<ViewStyle>;
}

const PROVIDER_COLORS: Record<string, string> = {
  MTN: '#FFC107',
  Airtel: '#F44336',
  Zamtel: '#4CAF50',
};

const WalletCard: React.FC<Props> = ({ wallet = {} as Wallet, onPress, onLongPress, style }) => {
  const provider = (wallet as any).provider || wallet.name || 'Unknown';
  const phone = (wallet as any).phone || '';
  const balance = wallet.balance || 0;
  const isPrimary = wallet.isPrimary || false;
  const color = PROVIDER_COLORS[provider] || wallet.color || '#999';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(wallet as Wallet)}
      onLongPress={() => onLongPress && onLongPress(wallet as Wallet)}
      activeOpacity={0.8}
    >
      <View style={[styles.icon, { backgroundColor: color }]}>
        <Text style={styles.iconText}>{provider.charAt(0)}</Text>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>{provider}</Text>
        <Text style={styles.phone}>{phone}</Text>
        <Text style={styles.balance}>K{balance.toLocaleString()}</Text>
      </View>

      {isPrimary ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Primary</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  phone: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  balance: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WalletCard;