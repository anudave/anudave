import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { useColors } from '../store/useThemeStore';
import { useProgressStore } from '../store/useProgressStore';
import { getDifficultyColor } from '../utils/helpers';
import { loadChallengeData } from '../utils/loadChallenges';

const ChallengeScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, day } = route.params;
  const { completeChallenge, isChallengeCompleted } = useProgressStore();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const colors = useColors();
  
  const isCompleted = isChallengeCompleted(categoryId, day);

  useEffect(() => {
    loadChallenge();
  }, [categoryId, day]);

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const challengeData = await loadChallengeData(categoryId, day);
      setChallenge(challengeData);
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      completeChallenge(categoryId, day);
    }
    alert(`Congratulations! You completed Day ${day} of ${categoryName}! 🎉`);
    navigation.goBack();
  };

  const handleResourcePress = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  if (loading || !challenge) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading challenge...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Text style={[styles.category, { color: colors.textLight }]}>{categoryName}</Text>
          <Text style={[styles.day, { color: colors.primary }]}>Day {challenge.day}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
          <View style={[styles.difficulty, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>
              {challenge.difficulty}
            </Text>
          </View>
          
          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.completedBadgeText}>✅ Completed</Text>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Description</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            {challenge.description}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 Objectives</Text>
          {challenge.objectives.map((objective, index) => (
            <Text key={index} style={[styles.objectiveItem, { color: colors.text }]}>
              • {objective}
            </Text>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {challenge.codeExample}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📚 Explanation</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            {challenge.explanation}
          </Text>
        </View>

        {challenge.tips && challenge.tips.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💪 Tips</Text>
            {challenge.tips.map((tip, index) => (
              <Text key={index} style={[styles.tipItem, { color: colors.text }]}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {challenge.resources && challenge.resources.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🔗 Resources</Text>
            {challenge.resources.map((resource, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.resourceItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => handleResourcePress(resource)}
              >
                <Text style={[styles.resourceText, { color: colors.primary }]}>{resource}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completedButton, { backgroundColor: isCompleted ? colors.textLight : colors.success }]} 
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>
            {isCompleted ? '✅ Completed' : 'Mark as Complete ✅'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: colors.textLight }]}>← Back to Challenges</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  category: {
    fontSize: 16,
    marginBottom: 4,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  difficulty: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  completedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  objectiveItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  codeBlock: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    color: '#E2E8F0',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  resourceItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  resourceText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  completedButton: {
    backgroundColor: '#64748B',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default ChallengeScreen;