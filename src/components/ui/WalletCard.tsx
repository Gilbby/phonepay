import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Wallet } from '../../types';

interface Props {
  wallet?: Wallet;
  onPress?: (w: Wallet) => void;
  onLongPress?: (w: Wallet) => void;
  style?: StyleProp<ViewStyle>;
}

const WalletCard: React.FC<Props> = ({ wallet = {}, onPress, onLongPress, style }) => {
  const { name = '', balance = 0, currency = '', color = '#999', isPrimary = false } = wallet as Wallet;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(wallet as Wallet)}
      onLongPress={() => onLongPress && onLongPress(wallet as Wallet)}
      activeOpacity={0.8}
    >
      <View style={[styles.icon, { backgroundColor: color }]} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>{name}</Text>
        <Text style={styles.balance}>{currency}{balance}</Text>
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
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
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
