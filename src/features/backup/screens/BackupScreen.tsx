import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useAppState } from '../../../app/store';
import { BackupService } from '../../../services/backup';
import { ShareService } from '../../../services/share';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../utils/format';

export const BackupScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { cart, removeFromCart, clearCart } = useAppState();

  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [lastBackupData, setLastBackupData] = useState<string | null>(null);

  const cartTotal = cart.reduce((sum, item) => sum + item.part.price * item.quantity, 0);

  const handleCreateBackup = async () => {
    try {
      setBackingUp(true);
      const backupText = await BackupService.createBackup();
      setLastBackupData(backupText);
      setBackingUp(false);
      Alert.alert('Backup Created', 'Your active catalog preferences and order lists were securely compiled.');
    } catch (e: any) {
      setBackingUp(false);
      Alert.alert('Backup Failure', e.message);
    }
  };

  const handleRestoreBackup = async () => {
    if (!lastBackupData) {
      Alert.alert('No Backup Found', 'Create a backup first, or make sure you have backup records loaded.');
      return;
    }

    try {
      setRestoring(true);
      const success = await BackupService.restoreBackup(lastBackupData);
      setRestoring(false);
      if (success) {
        Alert.alert('Restored Successfully', 'Your database, settings, and parts cart were fully restored.');
      }
    } catch (e: any) {
      setRestoring(false);
      Alert.alert('Restore Failure', e.message);
    }
  };

  const handleShareQuote = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add spare parts from the engine assemblies before requesting a quotation.');
      return;
    }
    ShareService.shareCart(cart);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Backups & Orders" showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        
        {/* Replacement Order List (Cart) */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          SPARE PARTS ORDER LIST ({cart.length} ITEMS)
        </Text>
        
        <Card style={{ marginBottom: spacing.lg }}>
          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text variant="bodyLarge" color={colors.textSecondary} align="center">
                Your replacement order list is currently empty.
              </Text>
              <Text variant="caption" color={colors.textSecondary} align="center" style={{ marginTop: spacing.xs }}>
                Browse the Engine Catalogs and tap the '＋' button on assembly parts tables to build an order list.
              </Text>
            </View>
          ) : (
            <View>
              {cart.map((item) => (
                <View key={item.part.id} style={[styles.cartItemRow, { borderBottomColor: colors.border }]}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text variant="bodyMedium" weight="bold">{item.part.name}</Text>
                    <Text variant="caption" color={colors.textSecondary}>{item.part.partNumber} • Qty: {item.quantity}</Text>
                  </View>
                  <View style={styles.cartPriceCol}>
                    <Text variant="bodyMedium" weight="semibold">
                      {formatCurrency(item.part.price * item.quantity)}
                    </Text>
                    <Pressable onPress={() => removeFromCart(item.part.id)}>
                      <Text variant="caption" color={colors.accent} weight="bold">Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text variant="bodyLarge" weight="bold">Total Estimated Cost:</Text>
                <Text variant="h2" color={colors.primary} weight="bold">{formatCurrency(cartTotal)}</Text>
              </View>

              <View style={styles.cartActionRow}>
                <Button
                  title="Clear All"
                  onPress={() => {
                    clearCart();
                    Alert.alert('Cleared', 'Your replacement order has been reset.');
                  }}
                  variant="outline"
                  style={styles.cartActionBtn}
                />
                <Button
                  title="Share Parts Quote"
                  onPress={handleShareQuote}
                  variant="primary"
                  style={{ ...styles.cartActionBtn, flex: 1.5 }}
                />
              </View>
            </View>
          )}
        </Card>

        {/* Database backup controls */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          DATABASE SYNCHRONIZATION
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <Text variant="bodyMedium" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
            Backup your cached catalogs, order worksheets, and preferred warehouses settings locally.
          </Text>

          {backingUp || restoring ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                {backingUp ? 'Compiling local database backup payload...' : 'Restoring schema parameters from backup...'}
              </Text>
            </View>
          ) : (
            <View style={styles.backupActions}>
              <Button
                title="Create Backup"
                onPress={handleCreateBackup}
                variant="outline"
                style={styles.backupBtn}
              />
              <Button
                title="Restore Backup"
                onPress={handleRestoreBackup}
                variant="secondary"
                disabled={!lastBackupData}
                style={styles.backupBtn}
              />
            </View>
          )}

          {lastBackupData && (
            <View style={[styles.backupFoundBadge, { backgroundColor: colors.surfaceSecondary, borderRadius: spacing.xs }]}>
              <Text variant="caption" color={colors.success} weight="bold" align="center">
                ✓ Local Backup ready in memory cache
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCart: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cartPriceCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  cartActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cartActionBtn: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  backupActions: {
    flexDirection: 'row',
    gap: 12,
  },
  backupBtn: {
    flex: 1,
  },
  backupFoundBadge: {
    marginTop: 16,
    padding: 8,
  },
});
export default BackupScreen;
