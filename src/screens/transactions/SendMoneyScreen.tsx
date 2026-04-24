import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { users } from '../../data/mockData';
import { RootStackScreenProps, User } from '../../types';

const ContactItem: React.FC<{ user: User; onSelect: (u: User) => void }> = ({ user, onSelect }) => (
  <TouchableOpacity style={styles.contactItem} onPress={() => onSelect(user)} activeOpacity={0.7}>
    <View style={styles.contactAvatar}>
      <Text style={styles.contactInitial}>{user.name.charAt(0)}</Text>
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{user.name}</Text>
      <Text style={styles.contactAlias}>{user.alias}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
  </TouchableOpacity>
);

export default function SendMoneyScreen({ navigation }: RootStackScreenProps<'SendMoney'>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('alias');

  const filteredUsers = users.filter((user: User) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.alias.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
  });

  const handleSelectUser = (user: User) => {
    navigation.navigate('SendAmount', { recipient: user });
  };

  const handleContinue = () => {
    if (searchQuery.length > 0) {
      const mockRecipient = {
        id: 'custom',
        name: searchQuery.startsWith('@') ? searchQuery.slice(1) : searchQuery,
        alias: searchQuery.startsWith('@') ? searchQuery : `@${searchQuery}`,
        phone: searchQuery,
      };
      navigation.navigate('SendAmount', { recipient: mockRecipient });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'alias' && styles.tabActive]}
            onPress={() => setSelectedTab('alias')}
          >
            <Ionicons
              name="at"
              size={18}
              color={selectedTab === 'alias' ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.tabText, selectedTab === 'alias' && styles.tabTextActive]}>
              Alias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'phone' && styles.tabActive]}
            onPress={() => setSelectedTab('phone')}
          >
            <Ionicons
              name="call"
              size={18}
              color={selectedTab === 'phone' ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.tabText, selectedTab === 'phone' && styles.tabTextActive]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedTab === 'alias' ? 'Enter alias (e.g. @john)' : 'Enter phone number'}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            keyboardType={selectedTab === 'phone' ? 'phone-pad' : 'default'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {searchQuery ? 'Search Results' : 'Recent Contacts'}
          </Text>
        </View>

        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers.filter((u: User) => u.alias !== '@gibby')}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ContactItem user={item} onSelect={handleSelectUser} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="person-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyStateText}>No contacts found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try searching by name, alias, or phone number
            </Text>
          </View>
        )}

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Send to "{searchQuery}"
            </Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
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
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  tabActive: {
    backgroundColor: COLORS.primaryLight + '30',
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  listHeader: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  listTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactInitial: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  contactAlias: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: 2,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  continueButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});