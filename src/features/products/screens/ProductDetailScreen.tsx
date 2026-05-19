import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { productRepository } from '../repository/ProductRepository';
import { imageService } from '../../../services/image';
import { ShareService } from '../../../services/share';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/ui/Input';

export const ProductDetailScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const {
    selectedProduct,
    setSelectedProduct,
    currentScreen,
    navigateTo,
    goBack,
    setSelectedTag,
  } = useUIStore();

  // Editing form state
  const [editTitle, setEditTitle] = useState(selectedProduct?.title || '');
  const [editPrice, setEditPrice] = useState(selectedProduct?.price?.toString() || '');
  const [editTags, setEditTags] = useState(selectedProduct?.tags || '');
  const [editNotes, setEditNotes] = useState(selectedProduct?.notes || '');
  const [updating, setUpdating] = useState(false);

  if (!selectedProduct) return null;

  const handleShare = () => {
    ShareService.shareProduct(selectedProduct);
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
              await imageService.deleteImage(selectedProduct.image_path);
              Alert.alert('Deleted', 'The product has been removed from your local database.');
              goBack(); // Back to Home
            } catch (e: any) {
              Alert.alert('Deletion Failure', e.message);
            }
          },
        },
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Validation Error', 'Product title is required.');
      return;
    }

    try {
      setUpdating(true);
      const updated = await productRepository.update(selectedProduct.id, {
        title: editTitle.trim(),
        price: parseFloat(editPrice) || 0,
        tags: editTags.trim(),
        notes: editNotes.trim(),
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
        <Header title="Edit Product" showBack />
        
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
          <Input
            label="Product Title *"
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="e.g. Yamaha Fuel Filter"
          />

          <Input
            label="Price (EGP)"
            value={editPrice}
            onChangeText={setEditPrice}
            placeholder="e.g. 1800"
            keyboardType="numeric"
          />

          <Input
            label="Tags (e.g. #yamaha #filter)"
            value={editTags}
            onChangeText={setEditTags}
            placeholder="e.g. #yamaha #outboard #fuel"
          />

          <Input
            label="Notes"
            value={editNotes}
            onChangeText={setEditNotes}
            placeholder="e.g. OEM Replacement, Made in Japan"
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          <Button
            title="SAVE CHANGES"
            onPress={handleSaveEdit}
            loading={updating}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </View>
    );
  }

  // State 2: Detailed Product Profile View
  const symbol = imageService.getPlaceholderSymbol(selectedProduct.image_path);
  const tagChips = selectedProduct.tags.split(/\s+/).filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={selectedProduct.title} showBack />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Large Product Image Header */}
        <View style={[styles.imageBanner, { backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }]}>
          <Text style={styles.largeSymbol}>{symbol}</Text>
        </View>

        <View style={{ padding: spacing.lg }}>
          {/* Main Info Card */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Text variant="caption" color={colors.textSecondary}>SPARE PART PRODUCT</Text>
            <Text variant="h1" weight="bold" style={{ marginVertical: 4 }}>
              {selectedProduct.title}
            </Text>
            
            <Text variant="h2" color={colors.primary} weight="bold" style={{ marginTop: spacing.xs }}>
              {selectedProduct.price} EGP
            </Text>
          </Card>

          {/* Tags list */}
          <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
            PRODUCT TAGS
          </Text>
          <Card style={{ marginBottom: spacing.lg }}>
            {tagChips.length === 0 ? (
              <Text variant="bodyMedium" color={colors.textSecondary}>No tags defined.</Text>
            ) : (
              <View style={styles.tagGrid}>
                {tagChips.map(tag => (
                  <Pressable
                    key={tag}
                    onPress={() => {
                      setSelectedTag(tag);
                      goBack(); // Navigate back home to view filter results
                    }}
                    style={[styles.tagBadge, { backgroundColor: colors.surfaceSecondary }]}
                  >
                    <Text variant="bodySmall" weight="semibold" color={colors.primary}>
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>

          {/* Technical notes */}
          <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
            TECHNICAL SPECIFICATIONS / NOTES
          </Text>
          <Card style={{ marginBottom: spacing.lg }}>
            <Text variant="bodyMedium" style={{ lineHeight: 22 }}>
              {selectedProduct.notes || 'No technical notes recorded for this item.'}
            </Text>
          </Card>

          {/* Quick Share action row */}
          <Button
            title="SHARE ON WHATSAPP"
            onPress={handleShare}
            variant="primary"
            style={styles.shareButton}
          />

          {/* Edit / Delete footer buttons */}
          <View style={styles.footerButtons}>
            <Button
              title="EDIT PRODUCT"
              onPress={() => navigateTo('edit-product')}
              variant="outline"
              style={styles.halfBtn}
            />
            <Button
              title="DELETE PRODUCT"
              onPress={handleDelete}
              variant="accent"
              style={styles.halfBtn}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBanner: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  largeSymbol: {
    fontSize: 90,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  shareButton: {
    height: 52,
    marginBottom: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
    height: 48,
  },
});
export default ProductDetailScreen;
