import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../store/useThemeStore'; // Updated import
import { getDifficultyColor } from '../utils/helpers';

const ChallengeCard = ({ challenge, onPress, isCompleted }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.completedCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.day, { color: colors.textLight }]}>📅 Day {challenge.day}</Text>
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.completedText}>✅</Text>
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
      <View style={styles.footer}>
        <Text style={[styles.difficulty, { color: colors.textLight }]}>
          Difficulty: <Text style={[styles.diffText, { color: getDifficultyColor(challenge.difficulty) }]}>
            {challenge.difficulty}
          </Text>
        </Text>
        {isCompleted && (
          <Text style={[styles.statusText, { color: colors.success }]}>Completed</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 14,
  },
  diffText: {
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default ChallengeCard;