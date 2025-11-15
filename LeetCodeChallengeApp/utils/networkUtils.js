import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

// Check network connectivity
export const checkNetworkConnection = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected;
  } catch (error) {
    console.error('Error checking network connection:', error);
    return false;
  }
};

// Subscribe to network connectivity changes
export const subscribeToNetworkChanges = (callback) => {
  return NetInfo.addEventListener(callback);
};

// Show network status alert
export const showNetworkStatus = (isConnected) => {
  if (!isConnected) {
    Alert.alert(
      'Offline Mode',
      'You are currently offline. Some features may be limited.',
      [{ text: 'OK' }]
    );
  }
};

// Get detailed network information
export const getNetworkInfo = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo;
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
};