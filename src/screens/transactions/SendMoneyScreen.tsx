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
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { RootStackScreenProps, User } from '../../types';
import { useApp } from '../../context/AppContext';
import { API_URL, authHeaders } from '../../config/api';

const ContactItem: React.FC<{ user: User; onSelect: (u: User) => void }> = ({ user, onSelect }) => (
  <TouchableOpacity style={styles.contactItem} onPress={() => onSelect(user)} activeOpacity={0.7}>
    <View style={styles.contactAvatar}>
      <Text style={styles.contactInitial}>
        {(user.alias?.replace('@', '') ?? user.phone ?? '?').charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{user.alias?.replace('@', '') ?? 'Unknown'}</Text>
      <Text style={styles.contactAlias}>{user.alias}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
  </TouchableOpacity>
);

export default function SendMoneyScreen({ navigation }: RootStackScreenProps<'SendMoney'>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('alias');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { token } = useApp();

  useEffect(() => {
    if (selectedTab === 'scan') {
      setScanned(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${API_URL}/users/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: authHeaders(token!) }
        );
        const data = await response.json();
        if (response.ok) setSearchResults(data.users);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectUser = (user: User) => {
    navigation.navigate('SendAmount', { recipient: user });
  };

  const handleContinue = async () => {
    if (searchQuery.length === 0) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/users/search?q=${encodeURIComponent(searchQuery)}`,
        { headers: authHeaders(token!) }
      );
      const data = await response.json();

      if (response.ok && data.users.length > 0) {
        navigation.navigate('SendAmount', { recipient: data.users[0] });
      } else {
        Alert.alert(
          'User Not Found',
          `No user found with "${searchQuery}". Please check and try again.`
        );
      }
    } catch {
      Alert.alert('Error', 'Could not verify recipient. Check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanTab = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to scan QR codes.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setSelectedTab('scan');
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);

      if (parsed.app !== 'PhonePay') {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not from PhonePay.',
          [{ text: 'Scan Again', onPress: () => setScanned(false) }]
        );
        return;
      }

      // Look up the user by alias
      const response = await fetch(
        `${API_URL}/users/search?q=${encodeURIComponent(parsed.alias)}`,
        { headers: authHeaders(token!) }
      );
      const result = await response.json();

      if (response.ok && result.users.length > 0) {
        navigation.navigate('SendAmount', { recipient: result.users[0] });
      } else {
        Alert.alert(
          'User Not Found',
          'Could not find the user from this QR code.',
          [{ text: 'Scan Again', onPress: () => setScanned(false) }]
        );
      }
    } catch {
      Alert.alert(
        'Invalid QR Code',
        'Could not read this QR code. Please try again.',
        [{ text: 'Scan Again', onPress: () => setScanned(false) }]
      );
    }
  };

  const renderScanTab = () => {
    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtext}>
            Allow camera access to scan PhonePay QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.scanHint}>
            Point camera at a PhonePay QR code
          </Text>
          {scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
          {/* Tabs */}
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
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'scan' && styles.tabActive]}
              onPress={handleScanTab}
            >
              <Ionicons
                name="qr-code-outline"
                size={18}
                color={selectedTab === 'scan' ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[styles.tabText, selectedTab === 'scan' && styles.tabTextActive]}>
                Scan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scan Tab */}
          {selectedTab === 'scan' ? (
            renderScanTab()
          ) : (
            <>
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
                {isSearching ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : searchQuery.length > 0 ? (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                    <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>
                  {searchQuery ? 'Search Results' : 'Search for a recipient'}
                </Text>
              </View>

              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <ContactItem user={item} onSelect={handleSelectUser} />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="person-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyStateText}>
                    {searchQuery.length > 0 && !isSearching ? 'No users found' : 'Search by alias or phone'}
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    {searchQuery.length > 0 && !isSearching
                      ? 'Try a different alias or phone number'
                      : 'Type at least 2 characters to search'}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {searchQuery.length > 0 && selectedTab !== 'scan' && (
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
                    Send to "{searchQuery}"
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
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
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
  // Scanner styles
  scannerContainer: {
    flex: 1,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.white,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: RADIUS.sm,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: RADIUS.sm,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: RADIUS.sm,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: RADIUS.sm,
  },
  scanHint: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    marginTop: SPACING.xl,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  rescanButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  rescanButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  permissionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  permissionSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});