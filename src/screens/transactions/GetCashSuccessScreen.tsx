import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackScreenProps } from '../../types';

export default function GetCashSuccessScreen({ navigation, route }: RootStackScreenProps<'GetCashSuccess'>) {
  const { agent, amount, fee, total } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDone = () => {
    navigation.navigate('MainTabs');
  };

  const withdrawalCode = 'WD' + Date.now().toString().slice(-6);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
        <Animated.View
          style={[
            styles.successCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark" size={48} color={COLORS.white} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Withdrawal Approved!</Text>
          <Text style={styles.subtitle}>
            Show this code to the agent to collect your cash
          </Text>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Withdrawal Code</Text>
            <Text style={styles.codeValue}>{withdrawalCode}</Text>
            <Text style={styles.codeHint}>Valid for 30 minutes</Text>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Cash to Collect</Text>
            <Text style={styles.amountValue}>K{amount.toFixed(2)}</Text>
          </View>

          <View style={styles.agentCard}>
            <View style={styles.agentIcon}>
              <Ionicons name="storefront" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentLabel}>Agent</Text>
              <Text style={styles.agentName}>{agent.name}</Text>
              <Text style={styles.agentCodeText}>{agent.code}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Agent Fee</Text>
              <Text style={styles.detailValue}>K{fee.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Debited</Text>
              <Text style={styles.detailValue}>K{total.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>TXN{Date.now().toString().slice(-8)}</Text>
            </View>
          </View>
        </Animated.View>
    </ScrollView> 

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
          <Ionicons name="home" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
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
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  successCircle: {
    marginBottom: SPACING.lg,
  },
  successIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  codeCard: {
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    width: '100%',
    ...SHADOWS.md,
  },
  codeLabel: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  codeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 4,
  },
  codeHint: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: SPACING.sm,
  },
  amountCard: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    width: '100%',
    ...SHADOWS.sm,
  },
  amountLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    width: '100%',
    marginBottom: SPACING.md,
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
  agentLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  agentName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  agentCodeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '500',
    marginTop: 2,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  doneButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
