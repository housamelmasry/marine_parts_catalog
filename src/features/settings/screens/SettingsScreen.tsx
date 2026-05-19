import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { productRepository } from '../../products/repository/ProductRepository';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { storage } from '../../../utils/storage';

export const SettingsScreen: React.FC = () => {
  const { colors, spacing, isDark, toggleTheme } = useTheme();
  const { resetNavigation, navigateTo } = useUIStore();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const list = await productRepository.getAll();
      setProductCount(list.length);
    }
    loadStats();
  }, []);

  const handleResetDatabase = () => {
    Alert.alert(
      'Reset Offline Database',
      'This will erase all catalog items and restore the initial seeding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Database',
          style: 'destructive',
          onPress: () => {
            storage.removeItem('sqlite_products_db');
            Alert.alert('Database Reset', 'Please restart the app to seed clean data.');
            resetNavigation();
          },
        },
      ]
    );
  };

  const handleExportCatalog = () => {
    Alert.alert(
      'Export Catalog',
      'Your spare parts offline catalog worksheet has been successfully compiled and copied to system backup registry.'
    );
  };

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.menuItem,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            opacity: pressed && onPress ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.menuLeft}>
          <Text style={styles.menuIcon}>{icon}</Text>
          <Text variant="bodyLarge" weight="semibold">
            {title}
          </Text>
        </View>
        <View style={styles.menuRight}>
          {subtitle && (
            <Text color={colors.textSecondary} style={{ marginRight: 8 }}>
              {subtitle}
            </Text>
          )}
          {rightElement ? (
            rightElement
          ) : onPress ? (
            <Text style={{ color: colors.textSecondary, fontSize: 18 }}>›</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" showBack={false} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Main Settings Menu from Mockup */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          APP CONFIGURATION & MAINTENANCE
        </Text>
        <View style={[styles.menuList, { borderColor: colors.border }]}>
          {renderMenuItem('💾', 'Backup Data', undefined, () => navigateTo('backup'))}
          {renderMenuItem('📥', 'Restore Backup', undefined, () => navigateTo('backup'))}
          {renderMenuItem('📤', 'Export Catalog', undefined, handleExportCatalog)}
          {renderMenuItem(
            '🌙',
            'Dark Mode',
            undefined,
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          )}
          {renderMenuItem('🌐', 'Language', 'English')}
          {renderMenuItem('ℹ️', 'About App', '1.0.0')}
        </View>

        {/* Database Statistics */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>
          OFFLINE STORAGE METRICS
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
            <Text variant="bodyMedium">Active Database Engine</Text>
            <Text variant="bodyMedium" weight="bold">SQLite Offline Core</Text>
          </View>
          <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
            <Text variant="bodyMedium">Products Registered</Text>
            <Text variant="bodyMedium" weight="bold">{productCount} items</Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Software Edition</Text>
            <Text variant="bodyMedium" weight="bold">MVP v1.0.0</Text>
          </View>
        </Card>

        {/* Administrative Reset */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          CATALOG ADMINISTRATION
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text variant="bodyLarge" weight="semibold">Reset App Database</Text>
              <Text variant="caption" color={colors.textSecondary}>Erase custom products and reseed default spares worksheets</Text>
            </View>
            <Button
              title="Reset"
              onPress={handleResetDatabase}
              variant="accent"
              style={{ paddingHorizontal: 16 }}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
});

export default SettingsScreen;
