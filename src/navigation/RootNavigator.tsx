import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useUIStore, Screen } from '../app/store';
import { Text } from '../shared/ui/Text';
import { useTranslation } from '../utils/i18n';

// Screens imports
import { ProductListScreen } from '../features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { AddProductScreen } from '../features/products/screens/AddProductScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { SearchScreen } from '../features/search/screens/SearchScreen';
import { BackupScreen } from '../features/backup/screens/BackupScreen';

export const RootNavigator: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { currentScreen, navigateTo, goBack } = useUIStore();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useTranslation();

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
      case 'search':
        return <SearchScreen />;
      case 'backup':
        return <BackupScreen />;
      default:
        return <ProductListScreen />;
    }
  };

  const getActiveTab = (): 'home' | 'add' | 'settings' => {
    if (currentScreen === 'settings' || currentScreen === 'backup')
      return 'settings';
    if (currentScreen === 'add-product') return 'add';
    return 'home';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen !== 'home') {
        goBack();
        return true;
      }
      return true; // prevent app exit on Android
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [currentScreen, goBack]);

  const handleTabPress = (tab: 'home' | 'add' | 'settings') => {
    if (tab === 'home') {
      navigateTo('home');
    } else if (tab === 'add') {
      navigateTo('add-product');
    } else if (tab === 'settings') {
      navigateTo('settings');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Active Screen Shell */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Floating Bottom Tab Bar matching mockup exactly */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, spacing.md),
            paddingTop: spacing.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {/* Home Tab */}
        <Pressable
          onPress={() => handleTabPress('home')}
          style={styles.tabItem}
        >
          <Text align="center" style={styles.tabIcon}>
            🏠
          </Text>
          <Text
            variant="caption"
            weight="bold"
            color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          >
            {t('home')}
          </Text>
        </Pressable>

        {/* Add Tab */}
        <Pressable onPress={() => handleTabPress('add')} style={styles.tabItem}>
          <Text align="center" style={styles.tabIcon}>
            ➕
          </Text>
          <Text
            variant="caption"
            weight="bold"
            color={activeTab === 'add' ? colors.primary : colors.textSecondary}
          >
            {t('add')}
          </Text>
        </Pressable>

        {/* Settings Tab */}
        <Pressable
          onPress={() => handleTabPress('settings')}
          style={styles.tabItem}
        >
          <Text align="center" style={styles.tabIcon}>
            ⚙️
          </Text>
          <Text
            variant="caption"
            weight="bold"
            color={
              activeTab === 'settings' ? colors.primary : colors.textSecondary
            }
          >
            {t('settings')}
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
