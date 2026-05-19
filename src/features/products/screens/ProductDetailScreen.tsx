import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { backgroundColor: '#F4F6F9' }]}>
      {/* Solid Navy Header matching mockup exactly */}
      <View
        style={[
          styles.navyHeader,
          {
            backgroundColor: '#0B2043',
            paddingTop: insets.top + spacing.sm,
            paddingBottom: spacing.sm,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <Pressable onPress={goBack} style={styles.headerButton}>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' }}>‹</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}></Text>
        <Pressable
          onPress={() => {
            Alert.alert(
              'Actions',
              'Select product option',
              [
                { text: 'Edit', onPress: () => navigateTo('edit-product') },
                { text: 'Delete', style: 'destructive', onPress: handleDelete },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
          style={styles.headerButton}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' }}>⋯</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Large Product Image Header */}
        <View style={[styles.imageBanner, { backgroundColor: '#F4F6F9', borderBottomWidth: 0 }]}>
          <Text style={styles.largeSymbol}>{symbol}</Text>
        </View>

        {/* Pure White Rounded Content Card */}
        <View style={[styles.contentCard, { backgroundColor: '#FFFFFF' }]}>
          {/* Title & Price */}
          <Text variant="h1" weight="bold" color="#0B2043" style={{ marginBottom: 4 }}>
            {selectedProduct.title}
          </Text>
          <Text variant="h2" color="#0B2043" weight="bold" style={{ marginBottom: spacing.lg }}>
            {selectedProduct.price} EGP
          </Text>

          {/* Tags Chips */}
          <View style={styles.tagWrapper}>
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
          <Text variant="bodyLarge" weight="bold" color="#0B2043" style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>
            Notes
          </Text>
          <Text variant="bodyMedium" color="#818A96" style={{ lineHeight: 22 }}>
            {selectedProduct.notes || 'No technical notes recorded for this item.'}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Premium Bottom Action Bar */}
      <View style={[styles.stickyBottomBar, { borderTopColor: colors.border, backgroundColor: '#FFFFFF', paddingBottom: Platform.OS === 'ios' ? insets.bottom + spacing.xs : spacing.md }]}>
        <Pressable onPress={handleShare} style={styles.bottomBarItem}>
          <Text style={{ fontSize: 24, marginBottom: 2 }}>💬</Text>
          <Text variant="caption" color="#0B2043" weight="bold">Share</Text>
        </Pressable>
        <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
        <Pressable onPress={() => navigateTo('edit-product')} style={styles.bottomBarItem}>
          <Text style={{ fontSize: 24, marginBottom: 2 }}>✏️</Text>
          <Text variant="caption" color="#0B2043" weight="bold">Edit</Text>
        </Pressable>
        <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
        <Pressable onPress={handleDelete} style={styles.bottomBarItem}>
          <Text style={{ fontSize: 24, marginBottom: 2 }}>🗑️</Text>
          <Text variant="caption" color={colors.error} weight="bold">Delete</Text>
        </Pressable>
      </View>
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
    height: 60,
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
