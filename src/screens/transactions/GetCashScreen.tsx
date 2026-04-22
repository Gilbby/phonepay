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
import { agents } from '../../data/mockData';
import { RootStackScreenProps } from '../../types';

const AgentItem: React.FC<{ agent: any; onSelect: (a: any) => void }> = ({ agent, onSelect }) => (
  <TouchableOpacity style={styles.agentItem} onPress={() => onSelect(agent)} activeOpacity={0.7}>
    <View style={styles.agentIcon}>
      <Ionicons name="storefront" size={24} color={COLORS.warning} />
    </View>
    <View style={styles.agentInfo}>
      <Text style={styles.agentName}>{agent.name}</Text>
      <View style={styles.agentMeta}>
        <Text style={styles.agentCode}>{agent.code}</Text>
        <View style={styles.dot} />
        <Text style={styles.agentLocation}>{agent.location}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
  </TouchableOpacity>
);

export default function GetCashScreen({ navigation }: RootStackScreenProps<'GetCash'>) {
  const [agentCode, setAgentCode] = useState('');

  const filteredAgents = agents.filter((agent) => {
    const query = agentCode.toLowerCase();
    return (
      agent.code.toLowerCase().includes(query) ||
      agent.name.toLowerCase().includes(query)
    );
  });

  const handleSelectAgent = (agent: any) => {
    navigation.navigate('GetCashAmount', { agent });
  };

  const handleContinue = () => {
    if (agentCode.length > 0) {
      const mockAgent = {
        id: 'custom',
        code: agentCode.toUpperCase(),
        name: 'Agent ' + agentCode.toUpperCase(),
        location: 'Unknown',
      };
      navigation.navigate('GetCashAmount', { agent: mockAgent });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Get Cash Works</Text>
            <Text style={styles.infoText}>
              Enter an agent code or select a nearby agent to withdraw cash from your wallet.
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Agent Code</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter agent code (e.g. AG001)"
              placeholderTextColor={COLORS.textMuted}
              value={agentCode}
              onChangeText={setAgentCode}
              autoCapitalize="characters"
            />
            {agentCode.length > 0 && (
              <TouchableOpacity onPress={() => setAgentCode('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.listHeader}>
          <Ionicons name="location" size={16} color={COLORS.textSecondary} />
          <Text style={styles.listTitle}>
            {agentCode ? 'Search Results' : 'Nearby Agents'}
          </Text>
        </View>

        {filteredAgents.length > 0 ? (
          <FlatList
            data={filteredAgents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AgentItem agent={item} onSelect={handleSelectAgent} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyStateText}>No agents found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try a different agent code
            </Text>
          </View>
        )}

        {agentCode.length > 0 && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue with "{agentCode.toUpperCase()}"
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
    paddingTop: SPACING.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight + '15',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  listTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
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
  agentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: SPACING.xs,
  },
  agentCode: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  agentLocation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
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
