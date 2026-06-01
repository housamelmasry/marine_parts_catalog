import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { productRepository } from '../repository/ProductRepository';
import { imageService } from '../../../services/image';
import { ShareOptionsSheet } from '../components/ShareOptionsSheet';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/ui/Input';
import { useTranslation } from '../../../utils/i18n';
import { CategoryPickerField } from '../components/CategoryPickerField';

export const ProductDetailScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    selectedProduct,
    setSelectedProduct,
    currentScreen,
    navigateTo,
    goBack,
    setSelectedTag,
  } = useUIStore();
  const { t, isRTL } = useTranslation();

  // Editing form state
  const [editTitle, setEditTitle] = useState(selectedProduct?.title || '');
  const [editCategory, setEditCategory] = useState(
    selectedProduct?.category || '',
  );
  const [editPrice, setEditPrice] = useState(
    selectedProduct?.price?.toString() || '',
  );
  const [editTags, setEditTags] = useState(selectedProduct?.tags || '');
  const [editNotes, setEditNotes] = useState(selectedProduct?.notes || '');
  const [editPhotoUris, setEditPhotoUris] = useState<string[]>(
    imageService.getProductImages(selectedProduct?.image_path),
  );
  const [updating, setUpdating] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);

  if (!selectedProduct) return null;

  const handleSelectPhoto = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      if (source === 'camera') {
        const { launchCamera } = require('react-native-image-picker');
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: false,
        });
      } else {
        const { launchImageLibrary } = require('react-native-image-picker');
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 10,
        });
      }

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setCopyingImage(true);
        try {
          const copiedUris: string[] = [];
          for (const asset of result.assets) {
            if (asset.uri) {
              const permanentUri = await imageService.copyToAppStorage(
                asset.uri,
              );
              copiedUris.push(permanentUri);
            }
          }
          setEditPhotoUris(prev => [...prev, ...copiedUris]);
        } finally {
          setCopyingImage(false);
        }
      }
    } catch (e) {
      setCopyingImage(false);
      console.warn('Image picker failed or was cancelled', e);
      Alert.alert(
        isRTL ? 'معرض الصور غير متوفر' : 'Gallery Unavailable',
        isRTL
          ? 'معرض الصور غير متوفر في هذه النسخة التجريبية. يرجى إعادة بناء التطبيق.'
          : 'Image gallery is not supported in this preview build. Please rebuild the native binary.',
      );
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEditPhotoUris(prev => prev.filter((_, i) => i !== index));
  };

  const handleShare = () => {
    setShowShareSheet(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Spare Product',
      `Are you sure you want to permanently remove "${selectedProduct.title}" from your catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productRepository.delete(selectedProduct.id);
              await imageService.deleteProductImages(
                selectedProduct.image_path,
              );
              Alert.alert(
                'Deleted',
                'The product has been removed from your local database.',
              );
              goBack(); // Back to Home
            } catch (e: any) {
              Alert.alert('Deletion Failure', e.message);
            }
          },
        },
      ],
    );
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Validation Error', 'Product title is required.');
      return;
    }

    try {
      setUpdating(true);

      const updatedImagePath =
        editPhotoUris.length > 0 ? editPhotoUris.join(',') : 'defaultIcon';

      const updated = await productRepository.update(selectedProduct.id, {
        title: editTitle.trim(),
        price: parseFloat(editPrice) || 0,
        tags: editTags.trim(),
        category: editCategory.trim(),
        notes: editNotes.trim(),
        image_path: updatedImagePath,
        thumbnail_path: updatedImagePath,
      });

      setUpdating(false);
      if (updated) {
        setSelectedProduct(updated);
        Alert.alert('Product Updated', 'Changes saved successfully.');
        goBack(); // Return to details screen
      }
    } catch (e: any) {
      setUpdating(false);
      Alert.alert('Save Error', e.message);
    }
  };

  // State 1: Minimal Edit Product Form
  if (currentScreen === 'edit-product') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={t('edit')} showBack />

        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label={t('productTitleLabel')}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder={
              isRTL ? 'مثال: فلتر وقود ميركوري' : 'e.g. Mercury Fuel Filter'
            }
            style={isRTL ? { textAlign: 'right' } : undefined}
          />

          <CategoryPickerField
            label={t('categoryLabel')}
            value={editCategory}
            onChange={setEditCategory}
            isRTL={isRTL}
          />

          <Input
            label={t('priceLabel')}
            value={editPrice}
            onChangeText={setEditPrice}
            placeholder="e.g. 1800"
            keyboardType="numeric"
            style={isRTL ? { textAlign: 'right' } : undefined}
          />

          <Text
            variant="caption"
            color={colors.textSecondary}
            weight="bold"
            style={{
              marginTop: spacing.md,
              marginBottom: spacing.xs,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('productPhotoLabel')}
          </Text>
          <Card style={{ marginBottom: spacing.lg, padding: 12 }}>
            {copyingImage ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : editPhotoUris.length > 0 ? (
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
                >
                  {editPhotoUris.map((uri, index) => {
                    const isRealPhoto = uri.startsWith('file://');
                    const symbol = imageService.getPlaceholderSymbol(uri);
                    return (
                      <View
                        key={uri + index}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 8,
                          overflow: 'hidden',
                          position: 'relative',
                          backgroundColor: colors.surfaceSecondary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isRealPhoto ? (
                          <Image
                            source={{ uri }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text style={{ fontSize: 32 }}>{symbol}</Text>
                        )}
                        <Pressable
                          onPress={() => handleRemovePhoto(index)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(217, 83, 79, 0.9)',
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 10,
                              fontWeight: 'bold',
                            }}
                          >
                            ✕
                          </Text>
                        </Pressable>
                        {index === 0 && (
                          <View
                            style={{
                              position: 'absolute',
                              bottom: 4,
                              left: 4,
                              backgroundColor: 'rgba(45, 106, 79, 0.9)',
                              paddingHorizontal: 4,
                              paddingVertical: 1,
                              borderRadius: 3,
                            }}
                          >
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: 7,
                                fontWeight: 'bold',
                              }}
                            >
                              {isRTL ? 'الرئيسية' : 'Primary'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
                <View
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    gap: 10,
                    marginTop: 8,
                  }}
                >
                  <Pressable
                    onPress={() => handleSelectPhoto('camera')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.surfaceSecondary,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 6 }}>📸</Text>
                    <Text variant="caption" weight="bold">
                      {isRTL ? 'كاميرا' : 'Camera'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSelectPhoto('gallery')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.surfaceSecondary,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 6 }}>🖼️</Text>
                    <Text variant="caption" weight="bold">
                      {isRTL ? 'معرض' : 'Gallery'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text
                  color={colors.textSecondary}
                  style={{ marginBottom: 12, fontSize: 40 }}
                >
                  ⚙️
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Button
                    title={isRTL ? '📸 كاميرا' : '📸 Camera'}
                    onPress={() => handleSelectPhoto('camera')}
                    variant="outline"
                    size="small"
                  />
                  <Button
                    title={isRTL ? '🖼️ معرض' : '🖼️ Gallery'}
                    onPress={() => handleSelectPhoto('gallery')}
                    variant="outline"
                    size="small"
                  />
                </View>
              </View>
            )}
          </Card>

          <Input
            label={t('tagsLabel')}
            value={editTags}
            onChangeText={setEditTags}
            placeholder="e.g. #yamaha #filter"
            style={isRTL ? { textAlign: 'right' } : undefined}
          />

          <Input
            label={t('notesLabel')}
            value={editNotes}
            onChangeText={setEditNotes}
            placeholder={
              isRTL
                ? 'مثال: قطعة أصلية يابانية...'
                : 'e.g. OEM Replacement, Made in Japan'
            }
            multiline
            numberOfLines={3}
            style={[
              { height: 80, textAlignVertical: 'top' },
              isRTL ? { textAlign: 'right' } : undefined,
            ]}
          />

          <Button
            title={isRTL ? 'حفظ التعديلات' : 'SAVE CHANGES'}
            onPress={handleSaveEdit}
            loading={updating}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </View>
    );
  }

  // State 2: Detailed Product Profile View
  const images = imageService.getProductImages(selectedProduct.image_path);
  const primaryImage = images[0] || '';
  const symbol = imageService.getPlaceholderSymbol(primaryImage);
  const hasRealPhotos = primaryImage && primaryImage.startsWith('file://');
  const tagChips = selectedProduct.tags.split(/\s+/).filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: '#F4F6F9' }]}>
      {/* Solid Navy Header matching mockup exactly */}
      <View
        style={[
          styles.navyHeader,
          {
            backgroundColor: '#0B2043',
            paddingTop: insets.top,
            paddingHorizontal: spacing.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            height: 60 + insets.top,
          },
        ]}
      >
        <Pressable onPress={goBack} style={styles.headerButton}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 'bold',
              transform: [{ scaleX: isRTL ? -1 : 1 }],
            }}
          >
            ‹
          </Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}></Text>
        <Pressable
          onPress={() => {
            Alert.alert(
              isRTL ? 'خيارات المنتج' : 'Actions',
              isRTL ? 'اختر إجراءً للمنتج' : 'Select product option',
              [
                {
                  text: isRTL ? 'تعديل' : 'Edit',
                  onPress: () => navigateTo('edit-product'),
                },
                {
                  text: isRTL ? 'حذف' : 'Delete',
                  style: 'destructive',
                  onPress: handleDelete,
                },
                { text: t('cancel'), style: 'cancel' },
              ],
            );
          }}
          style={styles.headerButton}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' }}>
            ⋯
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Product Image Header */}
        <View
          style={[
            styles.imageBanner,
            {
              backgroundColor: '#F4F6F9',
              borderBottomWidth: 0,
              height: 260,
              position: 'relative',
            },
          ]}
        >
          {hasRealPhotos ? (
            <View style={{ width: '100%', height: '100%' }}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={images}
                keyExtractor={(item, index) => item + index}
                onScroll={e => {
                  const x = e.nativeEvent.contentOffset.x;
                  const w =
                    e.nativeEvent.layoutMeasurement.width ||
                    Dimensions.get('window').width;
                  const index = Math.round(x / w);
                  if (index !== activeImageIndex) {
                    setActiveImageIndex(index);
                  }
                }}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: Dimensions.get('window').width,
                      height: '100%',
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
              {/* Pagination Dots overlay */}
              {images.length > 1 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {images.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: i === activeImageIndex ? 16 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          i === activeImageIndex
                            ? '#0B2043'
                            : 'rgba(11, 32, 67, 0.3)',
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.largeSymbol}>{symbol}</Text>
          )}
        </View>

        {/* Pure White Rounded Content Card */}
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: '#FFFFFF',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          {/* Title & Price */}
          <Text
            variant="caption"
            color={colors.textSecondary}
            weight="bold"
            style={{ marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}
          >
            {selectedProduct.category?.toUpperCase() ||
              (isRTL ? 'منتج قطع غيار' : 'SPARE PART PRODUCT')}
          </Text>
          <Text
            variant="h1"
            weight="bold"
            color="#0B2043"
            style={{ marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}
          >
            {selectedProduct.title}
          </Text>
          <Text
            variant="h2"
            color="#0B2043"
            weight="bold"
            style={{
              marginBottom: spacing.lg,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {selectedProduct.price} EGP
          </Text>

          {/* Tags Chips */}
          <View
            style={[
              styles.tagWrapper,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            {tagChips.map(tag => (
              <Pressable
                key={tag}
                onPress={() => {
                  setSelectedTag(tag);
                  goBack();
                }}
                style={[styles.tagBadge, { backgroundColor: '#EBF0F5' }]}
              >
                <Text variant="bodySmall" weight="semibold" color="#0B2043">
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Technical Specs Notes */}
          <Text
            variant="bodyLarge"
            weight="bold"
            color="#0B2043"
            style={{
              marginTop: spacing.lg,
              marginBottom: spacing.xs,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {isRTL ? 'الملاحظات الفنية' : 'Notes'}
          </Text>
          <Text
            variant="bodyMedium"
            color="#818A96"
            style={{ lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}
          >
            {selectedProduct.notes ||
              (isRTL
                ? 'لا توجد ملاحظات فنية مسجلة لهذا العنصر.'
                : 'No technical notes recorded for this item.')}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Premium Bottom Action Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            borderTopColor: colors.border,
            backgroundColor: '#FFFFFF',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            paddingBottom:
              insets.bottom > 0 ? insets.bottom + spacing.xs : spacing.md,
          },
        ]}
      >
        <Pressable onPress={handleShare} style={styles.bottomBarItem}>
          <Text style={{ fontSize: 24, marginBottom: 2 }}>💬</Text>
          <Text variant="caption" color="#0B2043" weight="bold">
            {t('share')}
          </Text>
        </Pressable>
        <View
          style={[styles.verticalDivider, { backgroundColor: colors.border }]}
        />
        <Pressable
          onPress={() => navigateTo('edit-product')}
          style={styles.bottomBarItem}
        >
          <Text style={{ fontSize: 24, marginBottom: 2 }}>✏️</Text>
          <Text variant="caption" color="#0B2043" weight="bold">
            {t('edit')}
          </Text>
        </Pressable>
        <View
          style={[styles.verticalDivider, { backgroundColor: colors.border }]}
        />
        <Pressable onPress={handleDelete} style={styles.bottomBarItem}>
          <Text style={{ fontSize: 24, marginBottom: 2 }}>🗑️</Text>
          <Text variant="caption" color={colors.error} weight="bold">
            {t('delete')}
          </Text>
        </Pressable>
      </View>
      <ShareOptionsSheet
        visible={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        product={selectedProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageBanner: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeSymbol: {
    fontSize: 90,
  },
  contentCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    elevation: 10,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    shadowOpacity: 0.08,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
});

export default ProductDetailScreen;
