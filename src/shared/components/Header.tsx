import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAppState } from '../../app/store';
import { Text } from '../ui/Text';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  style?: ViewStyle;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  style,
  rightAction,
}) => {
  const { colors, spacing } = useTheme();
  const { goBack, navigationStack } = useAppState();
  const insets = useSafeAreaInsets();

  const canGoBack = showBack ?? navigationStack.length > 1;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top,
          height: 56 + insets.top,
        },
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {canGoBack && (
          <Pressable onPress={goBack} style={styles.backButton}>
            <Text variant="bodyLarge" color={colors.primary} weight="bold">
              ← Back
            </Text>
          </Pressable>
        )}
      </View>
      
      <Text variant="h3" weight="bold" style={styles.title}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
export default Header;
