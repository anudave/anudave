import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useColors } from '../store/useThemeStore'; // Updated import

const CategoryButton = ({ category, completedCount = 0, onPress }) => {
  const colors = useColors();
  const progress = (completedCount / category.days) * 100;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: category.color }]}
      onPress={() => onPress(category)}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.progressText}>{completedCount}/{category.days}</Text>
      </View>
      <Text style={styles.description}>{category.description}</Text>
      
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 3,
  },
});

export default CategoryButton;