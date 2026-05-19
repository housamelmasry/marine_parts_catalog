import React from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useUIStore, Screen } from '../app/store';
import { Text } from '../shared/ui/Text';

// Screens imports
import { ProductListScreen } from '../features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { AddProductScreen } from '../features/products/screens/AddProductScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';

export const RootNavigator: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { currentScreen, navigateTo } = useUIStore();
  const insets = useSafeAreaInsets();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <ProductListScreen />;
      case 'add-product':
        return <AddProductScreen />;
      case 'product-details':
      case 'edit-product':
        return <ProductDetailScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <ProductListScreen />;
    }
  };

  const getActiveTab = (): 'catalog' | 'settings' => {
    if (currentScreen === 'settings') return 'settings';
    return 'catalog';
  };

  const activeTab = getActiveTab();

  const handleTabPress = (tab: 'catalog' | 'settings') => {
    if (tab === 'catalog') {
      navigateTo('home');
    } else if (tab === 'settings') {
      navigateTo('settings');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Active Screen Shell */}
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>

      {/* Floating Bottom Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : spacing.md,
            paddingTop: spacing.md,
          },
        ]}
      >
        {/* Catalog (Home) Tab */}
        <Pressable
          onPress={() => handleTabPress('catalog')}
          style={styles.tabItem}
        >
          <Text align="center" style={styles.tabIcon}>⚓</Text>
          <Text
            variant="caption"
            weight="bold"
            color={activeTab === 'catalog' ? colors.primary : colors.textSecondary}
          >
            Catalog
          </Text>
        </Pressable>

        {/* Settings Tab */}
        <Pressable
          onPress={() => handleTabPress('settings')}
          style={styles.tabItem}
        >
          <Text align="center" style={styles.tabIcon}>⚙️</Text>
          <Text
            variant="caption"
            weight="bold"
            color={activeTab === 'settings' ? colors.primary : colors.textSecondary}
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
});
export default RootNavigator;
