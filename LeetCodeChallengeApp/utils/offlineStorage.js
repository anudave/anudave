import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for offline storage
const OFFLINE_KEYS = {
  CHALLENGES: 'offline_challenges',
  LAST_SYNC: 'offline_last_sync',
  OFFLINE_MODE: 'offline_mode_enabled',
};

// Check if offline mode is enabled
export const isOfflineModeEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(OFFLINE_KEYS.OFFLINE_MODE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking offline mode:', error);
    return false;
  }
};

// Enable/disable offline mode
export const setOfflineMode = async (enabled) => {
  try {
    await AsyncStorage.setItem(OFFLINE_KEYS.OFFLINE_MODE, enabled.toString());
    return true;
  } catch (error) {
    console.error('Error setting offline mode:', error);
    return false;
  }
};

// Save challenges for offline use
export const saveChallengesOffline = async (challenges) => {
  try {
    const challengesData = {
      challenges,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(OFFLINE_KEYS.CHALLENGES, JSON.stringify(challengesData));
    await AsyncStorage.setItem(OFFLINE_KEYS.LAST_SYNC, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving challenges offline:', error);
    return false;
  }
};

// Load challenges from offline storage
export const loadChallengesOffline = async () => {
  try {
    const challengesData = await AsyncStorage.getItem(OFFLINE_KEYS.CHALLENGES);
    if (!challengesData) return null;

    const parsedData = JSON.parse(challengesData);
    return parsedData.challenges;
  } catch (error) {
    console.error('Error loading challenges offline:', error);
    return null;
  }
};

// Get last sync timestamp
export const getLastSyncTime = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(OFFLINE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};

// Check if offline data is stale (older than 7 days)
export const isOfflineDataStale = async () => {
  try {
    const lastSync = await getLastSyncTime();
    if (!lastSync) return true;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return lastSync < sevenDaysAgo;
  } catch (error) {
    console.error('Error checking offline data staleness:', error);
    return true;
  }
};

// Clear all offline data
export const clearOfflineData = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_KEYS.CHALLENGES);
    await AsyncStorage.removeItem(OFFLINE_KEYS.LAST_SYNC);
    return true;
  } catch (error) {
    console.error('Error clearing offline data:', error);
    return false;
  }
};

// Get offline storage info
export const getOfflineStorageInfo = async () => {
  try {
    const [isEnabled, lastSync, hasChallenges] = await Promise.all([
      isOfflineModeEnabled(),
      getLastSyncTime(),
      AsyncStorage.getItem(OFFLINE_KEYS.CHALLENGES),
    ]);

    return {
      isEnabled,
      lastSync,
      hasChallenges: !!hasChallenges,
      dataSize: hasChallenges ? new Blob([hasChallenges]).size : 0,
    };
  } catch (error) {
    console.error('Error getting offline storage info:', error);
    return null;
  }
};