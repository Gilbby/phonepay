import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackScreenProps, Agent } from '../../types';
import { useApp } from '../../context/AppContext';
import { API_URL, authHeaders } from '../../config/api';

const AgentItem: React.FC<{ agent: Agent; onSelect: (a: Agent) => void }> = ({ agent, onSelect }) => (
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { token } = useApp();

  useEffect(() => {
    const fetchAgents = async () => {
      setIsSearching(true);
      try {
        const query = agentCode.length > 0 ? `?q=${encodeURIComponent(agentCode)}` : '';
        const response = await fetch(
          `${API_URL}/users/agents/search${query}`,
          { headers: authHeaders(token!) }
        );
        const data = await response.json();
        if (response.ok) setAgents(data.agents);
      } catch {
        setAgents([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchAgents, agentCode.length > 0 ? 500 : 0);
    return () => clearTimeout(timer);
  }, [agentCode]);

  const handleSelectAgent = (agent: Agent) => {
    navigation.navigate('GetCashAmount', { agent });
  };

  const handleContinue = async () => {
    if (agentCode.length === 0) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/users/agents/search?q=${encodeURIComponent(agentCode)}`,
        { headers: authHeaders(token!) }
      );
      const data = await response.json();

      if (response.ok && data.agents.length > 0) {
        navigation.navigate('GetCashAmount', { agent: data.agents[0] });
      } else {
        Alert.alert(
          'Agent Not Found',
          `No agent found with code "${agentCode}". Please check and try again.`
        );
      }
    } catch {
      Alert.alert('Error', 'Could not verify agent. Check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
              {isSearching ? (
                <ActivityIndicator size="small" color={COLORS.warning} />
              ) : agentCode.length > 0 ? (
                <TouchableOpacity onPress={() => setAgentCode('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.listHeader}>
            <Ionicons name="location" size={16} color={COLORS.textSecondary} />
            <Text style={styles.listTitle}>
              {agentCode ? 'Search Results' : 'Available Agents'}
            </Text>
          </View>

          {agents.length > 0 ? (
            <FlatList
              data={agents}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <AgentItem agent={item} onSelect={handleSelectAgent} />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>
                {agentCode.length > 0 && !isSearching ? 'No agents found' : 'No agents available'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {agentCode.length > 0 && !isSearching
                  ? 'Try a different agent code'
                  : 'Loading agents...'}
              </Text>
            </View>
          )}
        </View>

        {agentCode.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>
                    Continue with "{agentCode.toUpperCase()}"
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 142,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  continueButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});