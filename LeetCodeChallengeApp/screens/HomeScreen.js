import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { useColors } from '../store/useThemeStore';
import { useProgressStore } from '../store/useProgressStore';
import CategoryButton from '../components/CategoryButton';

const HomeScreen = ({ navigation }) => {
  const colors = useColors();
  const { getCategoryProgress } = useProgressStore();

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', { 
      categoryId: category.id,
      categoryName: category.name
    });
  };

  const navigateToProgress = () => {
    navigation.navigate('Progress');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  const navigateToAchievements = () => {
    navigation.navigate('Achievements');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>🚀 Tech Challenge Master</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Master multiple technologies through daily challenges
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.primary }]} 
            onPress={navigateToProgress}
          >
            <Text style={styles.headerButtonText}>Progress 📊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.primary }]} 
            onPress={navigateToSearch}
          >
            <Text style={styles.headerButtonText}>Search 🔍</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.primary }]} 
            onPress={navigateToAchievements}
          >
            <Text style={styles.headerButtonText}>Achievements 🏆</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.primary }]} 
            onPress={navigateToSettings}
          >
            <Text style={styles.headerButtonText}>Settings ⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.categoriesList}>
        {CATEGORIES.map((category) => {
          const completed = getCategoryProgress(category.id);
          return (
            <CategoryButton
              key={category.id}
              category={category}
              completedCount={completed}
              onPress={handleCategoryPress}
            />
          );
        })}
      </ScrollView>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesList: {
    flex: 1,
    padding: 20,
  },
});

export default HomeScreen;