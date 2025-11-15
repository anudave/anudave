import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../store/useThemeStore';

const AchievementCard = ({ achievement, isUnlocked, progress = 0 }) => {
  const colors = useColors();
  
  // Calculate progress percentage locally
  const progressPercentage = isUnlocked ? 100 : Math.min((progress / achievement.requirement) * 100, 100);

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.card },
      isUnlocked && styles.unlockedCard
    ]}>
      <View style={styles.header}>
        <Text style={[styles.icon, { fontSize: 24 }]}>{achievement.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{achievement.name}</Text>
          <Text style={[styles.description, { color: colors.textLight }]}>
            {achievement.description}
          </Text>
        </View>
        {isUnlocked && (
          <Text style={[styles.unlockedBadge, { backgroundColor: colors.success }]}>
            ✅
          </Text>
        )}
      </View>
      
      {!isUnlocked && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: achievement.color 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textLight }]}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      )}
      
      {isUnlocked && (
        <View style={[styles.unlockedOverlay, { backgroundColor: `${achievement.color}20` }]}>
          <Text style={[styles.unlockedText, { color: achievement.color }]}>
            Unlocked! 🎉
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockedCard: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  unlockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  unlockedOverlay: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AchievementCard;