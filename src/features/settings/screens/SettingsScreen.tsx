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
import { useTranslation } from '../../../utils/i18n';

export const SettingsScreen: React.FC = () => {
  const { colors, spacing, isDark, toggleTheme } = useTheme();
  const { resetNavigation, navigateTo } = useUIStore();
  const { t, language, setLanguage, isRTL } = useTranslation();
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
      t('resetAlertTitle'),
      t('resetAlertConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('resetBtn'),
          style: 'destructive',
          onPress: () => {
            storage.removeItem('sqlite_products_db');
            Alert.alert(t('dbResetSuccessTitle'), t('dbResetAlertDone'));
            resetNavigation();
          },
        },
      ]
    );
  };

  const handleExportCatalog = () => {
    Alert.alert(
      t('exportAlertTitle'),
      t('exportAlertDesc')
    );
  };

  const handleChangeLanguage = () => {
    Alert.alert(
      language === 'ar' ? 'اختر اللغة' : 'Select Language',
      language === 'ar' ? 'اختر اللغة المفضلة للتطبيق' : 'Choose your preferred language',
      [
        {
          text: 'العربية',
          style: language === 'ar' ? 'cancel' : 'default',
          onPress: () => setLanguage('ar'),
        },
        {
          text: 'English',
          style: language === 'en' ? 'cancel' : 'default',
          onPress: () => setLanguage('en'),
        },
      ]
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
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={[styles.menuLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.menuIcon, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>{icon}</Text>
          <Text variant="bodyLarge" weight="semibold">
            {title}
          </Text>
        </View>
        <View style={[styles.menuRight, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {subtitle && (
            <Text color={colors.textSecondary} style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }}>
              {subtitle}
            </Text>
          )}
          {rightElement ? (
            rightElement
          ) : onPress ? (
            <Text style={{ color: colors.textSecondary, fontSize: 18, transform: [{ scaleX: isRTL ? -1 : 1 }] }}>›</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('settings')} showBack={false} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Main Settings Menu from Mockup */}
        <Text
          variant="caption"
          color={colors.textSecondary}
          weight="bold"
          style={{ marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('appConfigMaintenance')}
        </Text>
        <View style={[styles.menuList, { borderColor: colors.border }]}>
          {renderMenuItem('💾', t('backupData'), undefined, () => navigateTo('backup'))}
          {renderMenuItem('📥', t('restoreBackup'), undefined, () => navigateTo('backup'))}
          {renderMenuItem('📤', t('exportCatalog'), undefined, handleExportCatalog)}
          {renderMenuItem(
            '🌙',
            t('darkMode'),
            undefined,
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          )}
          {renderMenuItem('🌐', t('language'), language === 'ar' ? 'العربية' : 'English', handleChangeLanguage)}
          {renderMenuItem('ℹ️', t('aboutApp'), '1.0.0')}
        </View>

        {/* Database Statistics */}
        <Text
          variant="caption"
          color={colors.textSecondary}
          weight="bold"
          style={{ marginTop: spacing.lg, marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('offlineStorageMetrics')}
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={[styles.statRow, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text variant="bodyMedium">{t('activeDbEngine')}</Text>
            <Text variant="bodyMedium" weight="bold">{t('sqliteOfflineCore')}</Text>
          </View>
          <View style={[styles.statRow, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text variant="bodyMedium">{t('productsRegistered')}</Text>
            <Text variant="bodyMedium" weight="bold">{t('itemsCount', { count: productCount })}</Text>
          </View>
          <View style={[styles.statRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text variant="bodyMedium">{t('softwareEdition')}</Text>
            <Text variant="bodyMedium" weight="bold">{t('mvpEdition')}</Text>
          </View>
        </Card>

        {/* Administrative Reset */}
        <Text
          variant="caption"
          color={colors.textSecondary}
          weight="bold"
          style={{ marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('catalogAdmin')}
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, paddingRight: isRTL ? 0 : 8, paddingLeft: isRTL ? 8 : 0, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text variant="bodyLarge" weight="semibold" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('resetAppDb')}</Text>
              <Text variant="caption" color={colors.textSecondary} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('resetDbDesc')}</Text>
            </View>
            <Button
              title={t('resetBtn')}
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
    width: 24,
    textAlign: 'center',
  },
});

export default SettingsScreen;
