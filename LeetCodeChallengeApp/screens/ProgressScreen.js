import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useProgressStore } from '../store/useProgressStore';
import { CATEGORIES } from '../constants/categories';
import { useColors } from '../store/useThemeStore';

const ProgressScreen = () => {
  const colors = useColors();
  const { 
    getTotalCompleted, 
    getCategoryProgress, 
    currentStreak,
    resetProgress 
  } = useProgressStore();

  const totalCompleted = getTotalCompleted();
  const totalChallenges = CATEGORIES.length * 50;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {/* Header Stats */}
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>📊 Your Progress</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalCompleted}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Completed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{currentStreak}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Day Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {Math.round((totalCompleted / totalChallenges) * 100)}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Overall</Text>
            </View>
          </View>
        </View>

        {/* Progress Bars for Each Category */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Progress</Text>
          
          {CATEGORIES.map((category) => {
            const completed = getCategoryProgress(category.id);
            const progress = (completed / category.days) * 100;
            
            return (
              <View key={category.id} style={styles.categoryProgress}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                  <Text style={[styles.progressText, { color: colors.textLight }]}>
                    {completed}/{category.days}
                  </Text>
                </View>
                
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progress}%`,
                        backgroundColor: category.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Reset Button for Testing */}
        <TouchableOpacity 
          style={[styles.resetButton, { backgroundColor: colors.error }]} 
          onPress={resetProgress}
        >
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>
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
  headerCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
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
  categoryProgress: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProgressScreen;