import React from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../ui/Text';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search parts, OEM numbers...',
  onClear,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.border,
          borderRadius: spacing.sm,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text, paddingVertical: spacing.md }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearButton}
        >
          <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
});
export default SearchInput;
