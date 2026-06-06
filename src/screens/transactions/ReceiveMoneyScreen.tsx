import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackScreenProps } from '../../types';
import { useApp } from '../../context/AppContext';

export default function ReceiveMoneyScreen({ navigation }: RootStackScreenProps<'ReceiveMoney'>) {
  const [copied, setCopied] = useState(false);
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const qrShotRef = useRef<ViewShot>(null);

  const qrValue = JSON.stringify({
    alias: user?.alias ?? '',
    phone: user?.phone ?? '',
    agentCode: user?.isAgent ? user?.agentCode : undefined,
    app: 'Snappay',
  });

  const handleCopy = () => {
    Clipboard.setString(user?.alias ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const message = `Send money here\nor using the alias: ${user?.alias ?? ''}`;

      if (qrShotRef.current?.capture) {
        const uri = await qrShotRef.current.capture();
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: message,
          });
          return;
        }
      }

      await Share.share({ message });
    } catch {
      try {
        await Share.share({
          message: `Send money here\nor using the alias: ${user?.alias ?? ''}`,
        });
      } catch {
        // UI only
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Your Payment Details</Text>
          <Text style={styles.headerSubtitle}>
            Share your alias or QR code to receive money
          </Text>
        </View>

        <View style={styles.qrCard}>
          <ViewShot ref={qrShotRef} options={{ format: 'png', quality: 1 }}>
            <View style={styles.shareCapture}>
              <View style={styles.qrContainer}>
                <QRCode
                  value={qrValue}
                  size={180}
                  color={COLORS.textPrimary}
                  backgroundColor={COLORS.white}
                />
              </View>
              <Text style={styles.shareCaptionTitle}>Send money here</Text>
              <Text style={styles.shareCaptionAlias}>
                or using the alias: {user?.alias ?? ''}
              </Text>
            </View>
          </ViewShot>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.alias?.replace('@', '').charAt(0).toUpperCase() ?? 'P'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.alias?.replace('@', '') ?? 'Snappay User'}</Text>
            <Text style={styles.userAlias}>{user?.alias ?? ''}</Text>
          </View>
        </View>

        <View style={styles.aliasCard}>
          <View style={styles.aliasHeader}>
            <Ionicons name="at" size={20} color={COLORS.primary} />
            <Text style={styles.aliasLabel}>Your Alias</Text>
          </View>
          <View style={styles.aliasRow}>
            <Text style={styles.aliasValue}>{user?.alias ?? ''}</Text>
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

        <View style={styles.phoneCard}>
          <View style={styles.phoneHeader}>
            <Ionicons name="call" size={20} color={COLORS.secondary} />
            <Text style={styles.phoneLabel}>Phone Number</Text>
          </View>
          <Text style={styles.phoneValue}>{user?.phone ?? ''}</Text>
        </View>

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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
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
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
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
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
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
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
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
  shareCapture: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  shareCaptionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  shareCaptionAlias: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: 4,
  },
});