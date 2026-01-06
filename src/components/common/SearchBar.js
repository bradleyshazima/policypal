import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
}) => {
  const showClear = value && value.length > 0;

  return (
    <View style={[styles.container, style]}>
      {/* Search Icon */}
      <Octicons
        name="search"
        size={16}
        color={COLORS.blue}
        style={styles.searchIcon}
      />

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        style={styles.input}
      />

      {/* Clear (X) Icon */}
      {showClear && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Octicons
            name="x"
            size={18}
            color={COLORS.gray}
            style={styles.clearIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Regular',
    fontSize: 14,
    color: COLORS.black,
  },
  clearIcon: {
    marginLeft: 8,
  },
});
