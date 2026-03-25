import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WalletCard = ({ wallet = {}, onPress, onLongPress }) => {
  const { name = '', balance = 0, currency = '', color = '#999', isPrimary = false } = wallet;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(wallet)}
      onLongPress={() => onLongPress && onLongPress(wallet)}
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

