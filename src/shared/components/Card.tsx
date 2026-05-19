import React from 'react';
import { StyleSheet, Pressable, ViewStyle, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const { colors, spacing, theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    padding: spacing.lg,
    borderRadius: spacing.md,
    ...styles.shadow,
    shadowColor: colors.shadow,
    shadowOpacity: theme === 'dark' ? 0.3 : 0.08,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  shadow: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
});
export default Card;
