import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule daily notification
export const scheduleDailyNotification = async () => {
  const hasPermission = await requestNotificationPermissions();
  
  if (hasPermission) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚀 Daily Challenge Reminder!",
        body: "Don't forget to complete your daily tech challenge!",
        sound: true,
        data: { type: 'daily-reminder' },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
    
    console.log('Daily notification scheduled!');
    return true;
  }
  
  return false;
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Check notification permissions
export const checkNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};