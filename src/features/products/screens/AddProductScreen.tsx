import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Pressable, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { productRepository } from '../repository/ProductRepository';
import { imageService } from '../../../services/image';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/ui/Input';
import { useTranslation } from '../../../utils/i18n';

const SYMBOL_OPTIONS = [
  { symbol: '🌊', label: 'Pump', code: 'part_pump' },
  { symbol: '🌀', label: 'Propeller', code: 'part_prop' },
  { symbol: '⛽', label: 'Fuel Filter', code: 'part_filter' },
  { symbol: '⚡', label: 'Spark Plug', code: 'part_spark' },
  { symbol: '⚓', label: 'Anchor', code: 'defaultIcon' },
];

export const AddProductScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { goBack } = useUIStore();
  const { t, isRTL } = useTranslation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedIconCode, setSelectedIconCode] = useState('defaultIcon');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelectPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });
      
      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri || null);
      }
    } catch (e) {
      console.warn('launchImageLibrary native module is null / failed to load', e);
      Alert.alert(
        isRTL ? 'معرض الصور غير متوفر' : 'Gallery Unavailable',
        isRTL
          ? 'معرض الصور غير متوفر في هذه النسخة التجريبية. يرجى إعادة بناء التطبيق أو استخدام أيقونة الفئة الافتراضية.'
          : 'Image gallery is not supported in this preview build. Please rebuild the native binary or use a category icon.'
      );
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('validationErr'), t('titleRequired'));
      return;
    }

    try {
      setSaving(true);
      
      // Use local photo if selected, otherwise fallback to offline symbol
      const imageToSave = photoUri ? photoUri : selectedIconCode;
      
      const storedImage = await imageService.copyToAppStorage(imageToSave);
      const storedThumb = await imageService.generateThumbnail(imageToSave);

      await productRepository.create({
        title: title.trim(),
        price: parseFloat(price) || 0,
        tags: tags.trim() || '#marine',
        category: category.trim(),
        notes: notes.trim(),
        image_path: storedImage,
        thumbnail_path: storedThumb,
      });

      setSaving(false);
      Alert.alert(t('catalogSuccess'), t('productAddedSuccess', { title }));
      goBack(); // Return to Home
    } catch (e: any) {
      setSaving(false);
      Alert.alert(t('validationErr'), e.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('addNewProduct')} showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
        {/* Offline Symbol Picker Zone */}
        <Text
          variant="caption"
          color={colors.textSecondary}
          weight="bold"
          style={{ marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('selectCategoryIcon')}
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={[styles.gridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {SYMBOL_OPTIONS.map((opt) => {
              const isSelected = selectedIconCode === opt.code;
              return (
                <Pressable
                  key={opt.code}
                  onPress={() => setSelectedIconCode(opt.code)}
                  style={[
                    styles.symbolBox,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceSecondary,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderRadius: spacing.sm,
                    },
                  ]}
                >
                  <Text style={styles.symbol}>{opt.symbol}</Text>
                  <Text
                    variant="caption"
                    weight="bold"
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    numberOfLines={1}
                  >
                    {t(opt.code as any)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Product form details */}
        <Input
          label={t('productTitleLabel')}
          value={title}
          onChangeText={setTitle}
          placeholder={isRTL ? 'مثال: مروحة ياماها المائية' : 'e.g. Yamaha Water Impeller'}
          style={isRTL ? { textAlign: 'right' } : undefined}
        />

        <Input
          label={t('categoryLabel')}
          value={category}
          onChangeText={setCategory}
          placeholder={isRTL ? 'مثال: أجزاء المحرك' : 'e.g. Engine Parts'}
          style={isRTL ? { textAlign: 'right' } : undefined}
        />

        <Input
          label={t('priceLabel')}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 2500"
          keyboardType="numeric"
          style={isRTL ? { textAlign: 'right' } : undefined}
        />

        <Text
          variant="caption"
          color={colors.textSecondary}
          weight="bold"
          style={{ marginTop: spacing.md, marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('productPhotoLabel')}
        </Text>
        <Card style={{ marginBottom: spacing.lg, alignItems: 'center' }}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 12 }} resizeMode="cover" />
          ) : (
             <Text color={colors.textSecondary} style={{ marginBottom: 12, textAlign: 'center' }}>
               {t('noPhotoSelected')}
             </Text>
          )}
          <Button title={photoUri ? t('changePhoto') : t('selectFromGallery')} onPress={handleSelectPhoto} variant="outline" />
        </Card>

        <Input
          label={t('tagsLabel')}
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. #yamaha #pump #outboard"
          style={isRTL ? { textAlign: 'right' } : undefined}
        />

        <Input
          label={t('notesLabel')}
          value={notes}
          onChangeText={setNotes}
          placeholder={isRTL ? 'مثال: مواصفات الملاءمة، المحركات المتوافقة...' : 'e.g. Fitment specs, compatible engines...'}
          multiline
          numberOfLines={4}
          style={[{ height: 90, textAlignVertical: 'top' }, isRTL ? { textAlign: 'right' } : undefined]}
        />

        <Button
          title={t('saveProductBtn')}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  symbolBox: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  symbol: {
    fontSize: 24,
    marginBottom: 4,
  },
});

export default AddProductScreen;


