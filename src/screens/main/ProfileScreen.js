import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { currentUser } from '../../data/mockData';

const SettingItem = ({ icon, label, value, onPress, showChevron = true, danger = false }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
      <Ionicons name={icon} size={20} color={danger ? COLORS.error : COLORS.textSecondary} />
    </View>
    <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
    {value && <Text style={styles.settingValue}>{value}</Text>}
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    )}
  </TouchableOpacity>
);

const SettingToggle = ({ icon, label, value, onValueChange }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textSecondary} />
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
      thumbColor={value ? COLORS.primary : COLORS.textMuted}
    />
  </View>
);

export default function ProfileScreen({ navigation }) {
  const [isAgentMode, setIsAgentMode] = useState(currentUser.isAgent);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userAlias}>{currentUser.alias}</Text>
          <Text style={styles.userPhone}>{currentUser.phone}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>K1,730</Text>
              <Text style={styles.statLabel}>Total Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Wallets</Text>
            </View>
          </View>
        </View>

        {/* Agent Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent Mode</Text>
          <View style={styles.settingsCard}>
            <View style={styles.agentModeContainer}>
              <View style={styles.agentModeInfo}>
                <View style={[styles.settingIcon, { backgroundColor: COLORS.warning + '20' }]}>
                  <Ionicons name="storefront" size={20} color={COLORS.warning} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Agent Mode</Text>
                  <Text style={styles.agentModeSubtext}>
                    {isAgentMode ? 'Accepting cash withdrawals' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isAgentMode}
                onValueChange={setIsAgentMode}
                trackColor={{ false: COLORS.border, true: COLORS.warning }}
                thumbColor={isAgentMode ? COLORS.white : COLORS.textMuted}
              />
            </View>
            {isAgentMode && (
              <View style={styles.agentInfo}>
                <View style={styles.agentInfoRow}>
                  <Text style={styles.agentInfoLabel}>Agent Code</Text>
                  <Text style={styles.agentInfoValue}>{currentUser.agentCode}</Text>
                </View>
                <View style={styles.agentInfoRow}>
                  <Text style={styles.agentInfoLabel}>Total Earnings</Text>
                  <Text style={[styles.agentInfoValue, { color: COLORS.success }]}>
                    K{currentUser.agentEarnings}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="person-outline"
              label="Personal Information"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="card-outline"
              label="Payment Methods"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="document-text-outline"
              label="Transaction Limits"
              value="K10,000/day"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="lock-closed-outline"
              label="Change PIN"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingToggle
              icon="finger-print-outline"
              label="Biometric Login"
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Two-Factor Authentication"
              value="Enabled"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="key-outline"
              label="Login Activity"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsCard}>
            <SettingToggle
              icon="notifications-outline"
              label="Push Notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="language-outline"
              label="Language"
              value="English"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="moon-outline"
              label="Appearance"
              value="Light"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="chatbubble-outline"
              label="Contact Support"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="document-outline"
              label="Terms of Service"
              onPress={() => {}}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="shield-outline"
              label="Privacy Policy"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
              showChevron={false}
              danger
            />
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PhonePay v1.0.0</Text>
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
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userAlias: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingIconDanger: {
    backgroundColor: COLORS.error + '20',
  },
  settingLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  settingLabelDanger: {
    color: COLORS.error,
  },
  settingValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginRight: SPACING.sm,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 60,
  },
  agentModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  agentModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentModeSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  agentInfo: {
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.warning + '30',
  },
  agentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  agentInfoLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  agentInfoValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  versionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
});
