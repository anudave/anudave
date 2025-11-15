import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../store/useThemeStore'; // Updated import

const SearchBar = ({ value, onChangeText, onClear, placeholder = "Search challenges..." }) => {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          color: colors.text,
          borderColor: colors.border 
        }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={[styles.clearText, { color: colors.textLight }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 32,
    top: 32,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchBar;