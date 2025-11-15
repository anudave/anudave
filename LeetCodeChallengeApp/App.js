import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import NetworkStatus from './components/NetworkStatus';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <NetworkStatus />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366F1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Tech Challenge Master' }}
          />
          <Stack.Screen 
            name="Category" 
            component={CategoryScreen}
            options={({ route }) => ({ title: route.params?.categoryName || 'Challenges' })}
          />
          <Stack.Screen 
            name="Challenge" 
            component={ChallengeScreen}
            options={({ route }) => ({ title: `Day ${route.params?.day || '1'}` })}
          />
          <Stack.Screen 
            name="Progress" 
            component={ProgressScreen}
            options={{ title: 'My Progress' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ title: 'Search Challenges' }}
          />
          <Stack.Screen 
            name="Achievements" 
            component={AchievementsScreen}
            options={{ title: 'Achievements' }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}