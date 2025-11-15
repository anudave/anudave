import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../store/useThemeStore';
import { subscribeToNetworkChanges, checkNetworkConnection } from '../utils/networkUtils';
import { isOfflineModeEnabled } from '../utils/offlineStorage';

const NetworkStatus = () => {
  const colors = useColors();
  const [isConnected, setIsConnected] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Check initial status
    checkInitialStatus();

    // Subscribe to network changes
    const unsubscribe = subscribeToNetworkChanges((state) => {
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  const checkInitialStatus = async () => {
    const connected = await checkNetworkConnection();
    const offlineMode = await isOfflineModeEnabled();
    setIsConnected(connected);
    setIsOfflineMode(offlineMode);
  };

  // Don't show anything if we're online and not in offline mode
  if (isConnected && !isOfflineMode) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isConnected ? colors.warning : colors.error,
        borderColor: colors.border
      }
    ]}>
      <Text style={styles.text}>
        {isConnected && isOfflineMode 
          ? '📴 Offline Mode Enabled' 
          : '🌐 You are offline - Using cached content'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NetworkStatus;