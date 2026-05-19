import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert } from 'react-native';
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
  const { resetNavigation } = useUIStore();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" showBack={false} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Theme Panel */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          THEME & INTERFACE
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.row}>
            <View>
              <Text variant="bodyLarge" weight="semibold">Deep Ocean Dark Mode</Text>
              <Text variant="caption" color={colors.textSecondary}>Toggle nighttime high-contrast UI theme</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>

        {/* Database statistics */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          LOCAL STORAGE METRICS
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

        {/* Actions panel */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          CATALOG ADMINISTRATION
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text variant="bodyLarge" weight="semibold">Reset App Database</Text>
              <Text variant="caption" color={colors.textSecondary}>Erase custom products and reseed default Yamaha, Mercury spares worksheets</Text>
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
});
export default SettingsScreen;
