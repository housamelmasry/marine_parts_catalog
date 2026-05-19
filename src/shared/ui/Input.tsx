import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  placeholderTextColor,
  ...props
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surfaceSecondary,
            borderColor: error ? colors.error : colors.border,
            padding: spacing.md,
            borderRadius: spacing.sm,
          },
          style,
        ]}
        placeholderTextColor={placeholderTextColor || colors.textSecondary}
        {...props}
      />
      {error && (
        <Text variant="caption" color={colors.error} style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
  },
});
export default Input;
