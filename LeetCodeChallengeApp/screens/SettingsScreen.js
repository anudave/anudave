import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useColors } from '../store/useThemeStore';
import { useThemeStore } from '../store/useThemeStore';
import { 
  scheduleDailyNotification, 
  cancelAllNotifications, 
  checkNotificationPermissions 
} from '../utils/notificationUtils';
import { useProgressStore } from '../store/useProgressStore';
import { 
  setOfflineMode, 
  isOfflineModeEnabled, 
  preloadChallengesForOffline, 
  getOfflineStorageInfo,
  clearOfflineData,
  getLastSyncTime
} from '../utils/offlineStorage';

const SettingsScreen = () => {
  const colors = useColors();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [offlineStorageInfo, setOfflineStorageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme, setTheme } = useThemeStore();
  const { resetProgress } = useProgressStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    await loadNotificationSettings();
    await loadOfflineSettings();
  };

  const loadNotificationSettings = async () => {
    const hasPermission = await checkNotificationPermissions();
    setNotificationsEnabled(hasPermission);
  };

  const loadOfflineSettings = async () => {
    const isOffline = await isOfflineModeEnabled();
    setOfflineModeEnabled(isOffline);
    
    const storageInfo = await getOfflineStorageInfo();
    setOfflineStorageInfo(storageInfo);
  };

  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled(value);
    
    if (value) {
      const scheduled = await scheduleDailyNotification();
      if (!scheduled) {
        setNotificationsEnabled(false);
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const handleOfflineModeToggle = async (value) => {
  setLoading(true);
  try {
    console.log('Toggling offline mode to:', value);
    
    if (value) {
      // Enable offline mode - preload challenges
      console.log('Preloading challenges...');
      const success = await preloadChallengesForOffline();
      console.log('Preload result:', success);
      
      if (success) {
        await setOfflineMode(true);
        setOfflineModeEnabled(true);
        Alert.alert('Offline Mode Enabled', 'Challenges have been downloaded for offline use.');
      } else {
        Alert.alert('Download Failed', 'Failed to download challenges for offline use. Please check your connection and try again.');
        setOfflineModeEnabled(false);
      }
    } else {
      // Disable offline mode
      console.log('Disabling offline mode...');
      await setOfflineMode(false);
      setOfflineModeEnabled(false);
      Alert.alert('Offline Mode Disabled', 'You will now use online content when available.');
    }
    
    // Refresh storage info
    const storageInfo = await getOfflineStorageInfo();
    setOfflineStorageInfo(storageInfo);
  } catch (error) {
    console.error('Error toggling offline mode:', error);
    Alert.alert('Error', `Failed to update offline mode settings: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const handlePreloadChallenges = async () => {
    setLoading(true);
    try {
      const success = await preloadChallengesForOffline();
      if (success) {
        Alert.alert('Success', 'Challenges have been preloaded for offline use.');
        const storageInfo = await getOfflineStorageInfo();
        setOfflineStorageInfo(storageInfo);
      } else {
        Alert.alert('Error', 'Failed to preload challenges. Please check your connection.');
      }
    } catch (error) {
      console.error('Error preloading challenges:', error);
      Alert.alert('Error', 'Failed to preload challenges.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearOfflineData = async () => {
    Alert.alert(
      'Clear Offline Data',
      'Are you sure you want to clear all offline challenge data? This will free up storage space but you\'ll need to download challenges again for offline use.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            const success = await clearOfflineData();
            if (success) {
              Alert.alert('Success', 'Offline data has been cleared.');
              const storageInfo = await getOfflineStorageInfo();
              setOfflineStorageInfo(storageInfo);
            } else {
              Alert.alert('Error', 'Failed to clear offline data.');
            }
          }
        },
      ]
    );
  };

  const handleThemeToggle = (value) => {
    setTheme(value);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Progress Reset', 'All your progress has been reset.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be available soon!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.textLight }]}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Offline Mode Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📴 Offline Mode</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, { color: colors.text }]}>Enable Offline Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.textLight }]}>
                Download challenges for use without internet connection
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Switch
                value={offlineModeEnabled}
                onValueChange={handleOfflineModeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            )}
          </View>

          {/* Offline Storage Info */}
          {offlineStorageInfo && (
            <View style={styles.offlineInfo}>
              <Text style={[styles.offlineInfoText, { color: colors.textLight }]}>
                📦 Storage: {formatFileSize(offlineStorageInfo.dataSize)}
              </Text>
              <Text style={[styles.offlineInfoText, { color: colors.textLight }]}>
                ⏰ Last Sync: {formatDate(offlineStorageInfo.lastSync)}
              </Text>
              <Text style={[styles.offlineInfoText, { color: colors.textLight }]}>
                {offlineStorageInfo.hasChallenges ? '✅ Challenges Downloaded' : '❌ No Challenges Downloaded'}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.settingButton, { backgroundColor: colors.primary }]} 
            onPress={handlePreloadChallenges}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.settingButtonText}>Download Challenges for Offline Use</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingButton, { backgroundColor: colors.warning }]} 
            onPress={handleClearOfflineData}
            disabled={loading}
          >
            <Text style={styles.settingButtonText}>Clear Offline Data</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, { color: colors.text }]}>Daily Reminders</Text>
              <Text style={[styles.settingDescription, { color: colors.textLight }]}>
                Get reminded at 9:00 AM daily to complete your challenge
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.settingButton, { backgroundColor: colors.primary }]} 
            onPress={handleExportData}
          >
            <Text style={styles.settingButtonText}>Export Progress Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingButton, styles.dangerButton, { backgroundColor: colors.error }]} 
            onPress={handleResetProgress}
          >
            <Text style={[styles.settingButtonText, styles.dangerText]}>
              Reset All Progress
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ App Information</Text>
          
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.textLight }]}>1.0.0</Text>
          </View>
          
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Total Challenges</Text>
            <Text style={[styles.infoValue, { color: colors.textLight }]}>350</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Developer</Text>
            <Text style={[styles.infoValue, { color: colors.textLight }]}>Tech Challenge Team</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  offlineInfo: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  offlineInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
  settingButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;