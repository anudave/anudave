import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  FlatList 
} from 'react-native';
import { useColors } from '../store/useThemeStore';
import SearchBar from '../components/SearchBar';
import ChallengeCard from '../components/ChallengeCard';
import { CATEGORIES } from '../constants/categories';
import { searchChallenges, filterChallengesByCategory, filterChallengesByDifficulty } from '../utils/helpers';
import { getChallengesForCategory } from '../utils/loadChallenges';
import { useProgressStore } from '../store/useProgressStore';

const SearchScreen = ({ navigation }) => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [allChallenges, setAllChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isChallengeCompleted } = useProgressStore();

  useEffect(() => {
    loadAllChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [searchQuery, selectedCategory, selectedDifficulty, allChallenges]);

  const loadAllChallenges = async () => {
    setLoading(true);
    try {
      const challenges = [];
      
      // Load challenges from all categories
      for (const category of CATEGORIES) {
        const categoryChallenges = getChallengesForCategory(category.id);
        challenges.push(...categoryChallenges);
      }
      
      setAllChallenges(challenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = () => {
    let results = [...allChallenges];
    
    // Apply search
    if (searchQuery.trim()) {
      results = searchChallenges(results, searchQuery);
    }
    
    // Apply category filter
    if (selectedCategory) {
      results = filterChallengesByCategory(results, selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      results = filterChallengesByDifficulty(results, selectedDifficulty);
    }
    
    setFilteredChallenges(results);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  const handleChallengePress = (challenge) => {
    navigation.navigate('Challenge', {
      categoryId: challenge.category,
      categoryName: CATEGORIES.find(c => c.id === challenge.category)?.name || challenge.category,
      day: challenge.day,
      challenge
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  const getCategoryName = (categoryId) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;
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
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>🔍 Search Challenges</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Find challenges across all categories
        </Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search by title, description, or keywords..."
      />

      {/* Filters Section */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.filtersContainer, { backgroundColor: colors.card }]}
      >
        {/* Category Filters */}
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>Category:</Text>
          <View style={styles.filterItems}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.background },
                  selectedCategory === category.id && [styles.selectedFilter, { backgroundColor: category.color }]
                ]}
                onPress={() => handleCategoryFilter(category.id)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    { color: colors.text },
                    selectedCategory === category.id && styles.selectedFilterText
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Filters */}
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>Difficulty:</Text>
          <View style={styles.filterItems}>
            {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.background },
                  selectedDifficulty === difficulty && [styles.selectedFilter, { backgroundColor: getDifficultyColor(difficulty) }]
                ]}
                onPress={() => handleDifficultyFilter(difficulty)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    { color: colors.text },
                    selectedDifficulty === difficulty && styles.selectedFilterText
                  ]}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Clear Filters */}
      {(searchQuery || selectedCategory || selectedDifficulty) && (
        <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
          <Text style={[styles.clearAllText, { color: colors.primary }]}>Clear All Filters</Text>
        </TouchableOpacity>
      )}

      {/* Results Section */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsCount, { color: colors.textLight }]}>
          {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} found
        </Text>

        {filteredChallenges.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textLight }]}>
              {allChallenges.length === 0 
                ? 'No challenges available yet.' 
                : 'No challenges match your search. Try different keywords or filters.'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChallenges}
            keyExtractor={(item) => `${item.category}-${item.day}`}
            renderItem={({ item }) => (
              <ChallengeCard
                challenge={item}
                onPress={() => handleChallengePress(item)}
                isCompleted={isChallengeCompleted(item.category, item.day)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.challengesList}
          />
        )}
      </View>
    </View>
  );
};

// Helper function for difficulty colors in filters
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return '#10B981';
    case 'intermediate': return '#F59E0B';
    case 'advanced': return '#EF4444';
    default: return '#6366F1';
  }
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  filterGroup: {
    marginRight: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    // backgroundColor is set dynamically
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clearAllButton: {
    padding: 12,
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
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
  challengesList: {
    paddingBottom: 20,
  },
});

export default SearchScreen;