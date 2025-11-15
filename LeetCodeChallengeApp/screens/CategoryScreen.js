import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useColors } from '../store/useThemeStore';
import ChallengeCard from '../components/ChallengeCard';
import { getChallengesForCategory } from '../utils/loadChallenges';
import { useProgressStore } from '../store/useProgressStore';

const CategoryScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isChallengeCompleted } = useProgressStore();
  const colors = useColors();

  useEffect(() => {
    loadChallenges();
  }, [categoryId]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const categoryChallenges = getChallengesForCategory(categoryId);
      setChallenges(categoryChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengePress = (challenge) => {
    navigation.navigate('Challenge', {
      categoryId,
      categoryName,
      day: challenge.day,
      challenge
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading challenges...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{categoryName}</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>50 days of intensive learning</Text>
        <Text style={[styles.stats, { color: colors.primary }]}>
          {challenges.filter(c => isChallengeCompleted(categoryId, c.day)).length} / {challenges.length} completed
        </Text>
      </View>
      
      <ScrollView style={styles.challengesList}>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.day}
            challenge={challenge}
            onPress={() => handleChallengePress(challenge)}
            isCompleted={isChallengeCompleted(categoryId, challenge.day)}
          />
        ))}
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  stats: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  challengesList: {
    flex: 1,
    padding: 20,
  },
});

export default CategoryScreen;