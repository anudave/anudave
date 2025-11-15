import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useColors } from '../store/useThemeStore';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { useProgressStore } from '../store/useProgressStore';
import { getAllAchievements, getAchievementsByType } from '../constants/achievements';
import { getUnlockedCountByType } from '../utils/achievementUtils';
import AchievementCard from '../components/AchievementCard';

const AchievementsScreen = () => {
  const colors = useColors();
  const { 
    getUnlockedCount, 
    resetAchievements,
    isAchievementUnlocked,
    getAchievementProgress,
    unlockedAchievements
  } = useAchievementsStore();
  
  const { getTotalCompleted, getCategoryProgress } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState('all');
  
  const allAchievements = getAllAchievements();
  const unlockedCount = getUnlockedCount();
  const totalAchievements = allAchievements.length;

  const filteredAchievements = activeTab === 'all' 
    ? allAchievements 
    : getAchievementsByType(activeTab);

  const tabs = [
    { id: 'all', name: 'All', count: unlockedCount },
    { id: 'completion', name: 'Completion', count: getUnlockedCountByType(unlockedAchievements, 'completion') },
    { id: 'streak', name: 'Streak', count: getUnlockedCountByType(unlockedAchievements, 'streak') },
    { id: 'category', name: 'Categories', count: getUnlockedCountByType(unlockedAchievements, 'category') },
    { id: 'special', name: 'Special', count: getUnlockedCountByType(unlockedAchievements, 'special') },
  ];

  // Calculate progress for each achievement
  const getProgressForAchievement = (achievement) => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    
    if (isUnlocked) return achievement.requirement;
    
    const storedProgress = getAchievementProgress(achievement.id);
    if (storedProgress > 0) return storedProgress;
    
    // Calculate current progress based on achievement type
    switch (achievement.type) {
      case 'completion':
        return Math.min(getTotalCompleted(), achievement.requirement);
      case 'streak':
        // We don't have direct access to streak here, so use stored progress
        return storedProgress;
      case 'category':
        return Math.min(getCategoryProgress(achievement.category), achievement.requirement);
      default:
        return 0;
    }
  };

  const handleResetAchievements = () => {
    Alert.alert(
      'Reset Achievements',
      'Are you sure you want to reset all your achievements? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetAchievements();
            Alert.alert('Achievements Reset', 'All achievements have been reset.');
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Stats */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>🏆 Achievements</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{unlockedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Unlocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalAchievements}</Text>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {Math.round((unlockedCount / totalAchievements) * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Complete</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsContainer, { backgroundColor: colors.card }]}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              { backgroundColor: colors.background },
              activeTab === tab.id && [styles.activeTab, { backgroundColor: colors.primary }]
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text 
              style={[
                styles.tabText,
                { color: colors.text },
                activeTab === tab.id && styles.activeTabText
              ]}
            >
              {tab.name} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <ScrollView style={styles.achievementsList}>
        {filteredAchievements.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textLight }]}>
              No achievements found in this category.
            </Text>
          </View>
        ) : (
          filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={isAchievementUnlocked(achievement.id)}
              progress={getProgressForAchievement(achievement)}
            />
          ))
        )}
      </ScrollView>

      {/* Reset Button (for testing) */}
      <TouchableOpacity 
        style={[styles.resetButton, { backgroundColor: colors.error }]} 
        onPress={handleResetAchievements}
      >
        <Text style={styles.resetButtonText}>Reset Achievements</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  tabsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    // backgroundColor is set dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  achievementsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  resetButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AchievementsScreen;