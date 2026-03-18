import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { currentUser } from '../../data/mockData';

export default function ReceiveMoneyScreen({ navigation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // UI only - just show feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send me money on PhonePay! My alias is ${currentUser.alias}`,
      });
    } catch (error) {
      // UI only - no error handling needed
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Your Payment Details</Text>
          <Text style={styles.headerSubtitle}>
            Share your alias or QR code to receive money
          </Text>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrContainer}>
            {/* Static QR code placeholder */}
            <View style={styles.qrPlaceholder}>
              <View style={styles.qrInner}>
                <Ionicons name="qr-code" size={120} color={COLORS.textPrimary} />
              </View>
            </View>
          </View>
          
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser.name.charAt(0)}
              </Text>
            </View>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userAlias}>{currentUser.alias}</Text>
          </View>
        </View>

        {/* Alias Card */}
        <View style={styles.aliasCard}>
          <View style={styles.aliasHeader}>
            <Ionicons name="at" size={20} color={COLORS.primary} />
            <Text style={styles.aliasLabel}>Your Alias</Text>
          </View>
          <View style={styles.aliasRow}>
            <Text style={styles.aliasValue}>{currentUser.alias}</Text>
            <TouchableOpacity
              style={[styles.copyButton, copied && styles.copyButtonSuccess]}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Ionicons
                name={copied ? 'checkmark' : 'copy'}
                size={16}
                color={copied ? COLORS.success : COLORS.primary}
              />
              <Text style={[styles.copyText, copied && styles.copyTextSuccess]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phone Card */}
        <View style={styles.phoneCard}>
          <View style={styles.phoneHeader}>
            <Ionicons name="call" size={20} color={COLORS.secondary} />
            <Text style={styles.phoneLabel}>Phone Number</Text>
          </View>
          <Text style={styles.phoneValue}>{currentUser.phone}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to receive money</Text>
          <View style={styles.instructionRow}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Share your alias or show QR code to sender
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Sender enters your alias or scans your QR code
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Money arrives instantly in your wallet
            </Text>
          </View>
        </View>
      </View>

      {/* Share Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Ionicons name="share-social" size={20} color={COLORS.white} />
          <Text style={styles.shareButtonText}>Share Payment Details</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  headerInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  qrCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  qrContainer: {
    marginBottom: SPACING.md,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  qrInner: {
    padding: SPACING.md,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  userName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  userAlias: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    marginTop: 2,
  },
  aliasCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  aliasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  aliasLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  aliasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aliasValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.primary,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight + '20',
    gap: SPACING.xs,
  },
  copyButtonSuccess: {
    backgroundColor: COLORS.success + '20',
  },
  copyText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  copyTextSuccess: {
    color: COLORS.success,
  },
  phoneCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  phoneLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  phoneValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  instructionsCard: {
    backgroundColor: COLORS.primaryLight + '15',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  instructionsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  instructionText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  shareButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
