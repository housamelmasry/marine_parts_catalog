import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Pressable, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
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

export const AddProductScreen: React.FC = () => {
  const { colors, spacing, isDark } = useTheme();
  const { goBack } = useUIStore();
  const { t, isRTL } = useTranslation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Tracks while we copy the picked image into permanent app storage
  const [copyingImage, setCopyingImage] = useState(false);

  const handleSelectPhoto = async (source: 'camera' | 'gallery' | 'files') => {
    try {
      let result;
      if (source === 'camera') {
        // Opens the device camera to take a new photo
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: false, // we save our own copy in app documents
        });
      } else {
        // 'gallery' and 'files' both open the system image picker.
        // On Android this shows the gallery/photos app.
        // On iOS it shows the Photos picker.
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 1,
        });
      }

      if (result.didCancel) return; // User pressed back — do nothing

      if (result.errorCode) {
        Alert.alert(
          isRTL ? 'خطأ في الوصول' : 'Access Error',
          result.errorMessage || (isRTL ? 'تعذر الوصول إلى الصور.' : 'Could not access photos.')
        );
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const rawUri = result.assets[0].uri;
        if (!rawUri) return;

        // Immediately copy the image into the app's permanent documents folder.
        // This converts the ephemeral content:// URI (Android) into a stable file:// path.
        setCopyingImage(true);
        try {
          const permanentUri = await imageService.copyToAppStorage(rawUri);
          setPhotoUri(permanentUri);
        } finally {
          setCopyingImage(false);
        }
      }
    } catch (e) {
      setCopyingImage(false);
      console.warn('Image picker failed or was cancelled', e);
      Alert.alert(
        isRTL ? 'معرض الصور غير متوفر' : 'Media Store Unavailable',
        isRTL
          ? 'تعذر الوصول إلى وسائط التخزين. يرجى التحقق من أذونات التطبيق.'
          : 'Could not access local media storage. Please verify camera & gallery permissions.'
      );
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('validationErr'), t('titleRequired'));
      return;
    }

    try {
      setSaving(true);

      // photoUri is already a permanent file:// path (copied in handleSelectPhoto).
      // If no photo was selected, fall back to the default icon key.
      const imagePath = photoUri || 'defaultIcon';

      await productRepository.create({
        title: title.trim(),
        price: parseFloat(price) || 0,
        tags: tags.trim() || '#marine',
        category: category.trim() || (isRTL ? 'عام' : 'General'),
        notes: notes.trim(),
        image_path: imagePath,
        thumbnail_path: imagePath, // same path used for thumbnail
      });

      setSaving(false);
      Alert.alert(t('catalogSuccess'), t('productAddedSuccess', { title }));
      goBack();
    } catch (e: any) {
      setSaving(false);
      Alert.alert(t('validationErr'), e.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('addNewProduct')} showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 110 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Offline Stored Locally Badge */}
        <View style={[styles.badgeContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.localBadge, { backgroundColor: isDark ? '#1E293B' : '#0B2043' }]}>
            <Text style={styles.badgeIcon}>🛢️</Text>
            <Text variant="caption" weight="bold" color="#FFFFFF" style={styles.badgeText}>
              {isRTL ? 'تخزين محلي آمن' : 'STORED LOCALLY'}
            </Text>
          </View>
        </View>

        {/* Dynamic Image Picker / Preview Card */}
        <Card style={styles.pickerCard}>
          {copyingImage ? (
            // Shown while the image is being copied into permanent app storage
            <View style={[styles.dashedBorder, { borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', minHeight: 160 }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 12 }} align="center">
                {isRTL ? '⏳ جارٍ حفظ الصورة في التخزين المحلي...' : '⏳ Saving image to local storage...'}
              </Text>
            </View>
          ) : photoUri ? (
            <View>
              <View style={styles.previewContainer}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
                <View style={styles.changeOverlay}>
                  <Pressable
                    onPress={() => handleSelectPhoto('gallery')}
                    style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text color="#FFFFFF" variant="caption" weight="bold">🔄 {isRTL ? 'تغيير' : 'Change'}</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleRemovePhoto}
                    style={[styles.smallBtn, { backgroundColor: '#D9534F', marginLeft: 8 }]}
                  >
                    <Text color="#FFFFFF" variant="caption" weight="bold">🗑️ {isRTL ? 'إزالة' : 'Remove'}</Text>
                  </Pressable>
                </View>
                <View style={styles.indicatorBadge}>
                  <Text style={{ fontSize: 10, marginRight: 4 }}>✅</Text>
                  <Text variant="caption" color="#2D6A4F" weight="bold">
                    {isRTL ? 'محفوظة محلياً' : 'Saved Locally'}
                  </Text>
                </View>
              </View>
              {/* Show the permanent file path stored in the DB */}
              <View style={{ marginTop: 8, paddingHorizontal: 4 }}>
                <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }} numberOfLines={2}>
                  📂 {photoUri}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.dashedBorder, { borderColor: colors.border }]}>
              {/* How image upload works — info banner */}
              <View style={{ backgroundColor: isDark ? '#1A2840' : '#EBF4FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20, width: '100%' }}>
                <Text variant="caption" color={colors.primary} weight="bold" style={{ marginBottom: 4 }}>
                  {isRTL ? '📌 كيف تعمل إضافة الصورة؟' : '📌 How image upload works'}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={{ lineHeight: 18 }}>
                  {isRTL
                    ? 'اختر صورة من الكاميرا أو المعرض. سيتم نسخها تلقائياً إلى مجلد التطبيق الخاص بك وحفظ مسارها في قاعدة البيانات.'
                    : 'Pick an image from camera or gallery. It will be automatically copied into the app\'s private folder and its path saved to the database.'}
                </Text>
              </View>

              <View style={[styles.pickerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {/* Camera */}
                <Pressable onPress={() => handleSelectPhoto('camera')} style={styles.pickerItem}>
                  <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF0F5' }]}>
                    <Text style={{ fontSize: 26 }}>📸</Text>
                  </View>
                  <Text variant="bodyMedium" weight="bold" style={{ marginTop: 8 }}>
                    {isRTL ? 'الكاميرا' : 'Camera'}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 11 }}>
                    {isRTL ? 'التقاط صورة' : 'Take Photo'}
                  </Text>
                </Pressable>

                {/* Gallery */}
                <Pressable onPress={() => handleSelectPhoto('gallery')} style={styles.pickerItem}>
                  <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF0F5' }]}>
                    <Text style={{ fontSize: 26 }}>🖼️</Text>
                  </View>
                  <Text variant="bodyMedium" weight="bold" style={{ marginTop: 8 }}>
                    {isRTL ? 'المعرض' : 'Gallery'}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 11 }}>
                    {isRTL ? 'من معرض الصور' : 'From Gallery'}
                  </Text>
                </Pressable>

                {/* Files — also opens image picker (same as gallery on Android/iOS) */}
                <Pressable onPress={() => handleSelectPhoto('files')} style={styles.pickerItem}>
                  <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1E293B' : '#EBF0F5' }]}>
                    <Text style={{ fontSize: 26 }}>📁</Text>
                  </View>
                  <Text variant="bodyMedium" weight="bold" style={{ marginTop: 8 }}>
                    {isRTL ? 'الملفات' : 'Files'}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 11 }}>
                    {isRTL ? 'تصفح الملفات' : 'Browse Files'}
                  </Text>
                </Pressable>
              </View>

              <Text variant="caption" color={colors.textSecondary} weight="medium" align="center" style={{ marginTop: 16 }}>
                {isRTL ? 'اختر صورة من هاتفك المحمول' : 'Select image from your phone'}
              </Text>
            </View>
          )}
        </Card>

        {/* Product Form Card */}
        <Card style={{ padding: spacing.lg, borderRadius: 16 }}>
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
        </Card>

        {/* Quick Actions Drawer Card */}
        <Card style={{ marginTop: spacing.md, padding: spacing.md, borderRadius: 16 }}>
          <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.sm, textAlign: isRTL ? 'right' : 'left' }}>
            {isRTL ? 'إجراءات سريعة للصور' : 'QUICK PHOTO ACTIONS'}
          </Text>
          <View style={[styles.quickActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Pressable
              onPress={() => handleSelectPhoto('camera')}
              style={({ pressed }) => [styles.actionButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>📸</Text>
              <Text variant="caption" weight="bold">{isRTL ? 'التقاط صورة' : 'Take Photo'}</Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleSelectPhoto('gallery')}
              style={({ pressed }) => [styles.actionButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>🖼️</Text>
              <Text variant="caption" weight="bold">{isRTL ? 'معرض الصور' : 'Choose Gallery'}</Text>
            </Pressable>
          </View>
        </Card>

      </ScrollView>

      {/* Floating Save Button container at bottom */}
      <View style={[styles.bottomActionBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          title={t('saveProductBtn')}
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badgeContainer: {
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  pickerCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  dashedBorder: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  pickerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  previewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  indicatorBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  saveBtn: {
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
  },
});

export default AddProductScreen;


