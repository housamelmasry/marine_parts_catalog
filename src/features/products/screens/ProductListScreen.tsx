import React from 'react';
import { StyleSheet, View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { useProducts } from '../hooks/useProducts';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { SearchInput } from '../../../shared/components/SearchInput';
import { imageService } from '../../../services/image';
import { Product } from '../../../database/db';

export const ProductListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    setSelectedProduct,
    navigateTo,
  } = useUIStore();

  const { products, loading, allTags } = useProducts(searchQuery, selectedTag);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product-details');
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const symbol = imageService.getPlaceholderSymbol(item.image_path);
    
    return (
      <View style={styles.gridCell}>
        <Card
          onPress={() => handleSelectProduct(item)}
          style={{ ...styles.productCard, backgroundColor: colors.surface }}
        >
          {/* Product Image Box */}
          <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSecondary, borderRadius: spacing.sm }]}>
            <Text style={styles.imageSymbol}>{symbol}</Text>
          </View>

          <Text variant="bodyLarge" weight="bold" numberOfLines={1} style={{ marginTop: spacing.sm }}>
            {item.title}
          </Text>

          <Text variant="h3" color={colors.primary} weight="bold" style={{ marginTop: 2 }}>
            {item.price} EGP
          </Text>

          <Text variant="caption" color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 4 }}>
            {item.tags}
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Marine Catalog" showBack={false} />

      {/* Top Search bar */}
      <View style={[styles.searchContainer, { borderBottomColor: colors.border, padding: spacing.lg }]}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />
      </View>

      {/* Dynamic Tag Filter chips */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...allTags]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedTag === item;
            return (
              <Pressable
                onPress={() => setSelectedTag(item)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  weight="bold"
                  color={isSelected ? '#FFFFFF' : colors.text}
                >
                  {item === 'All' ? 'All Products' : item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Two-Column Grid list */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="h3" color={colors.textSecondary} align="center">
            No Catalog Items Found
          </Text>
          <Text variant="bodyMedium" color={colors.textSecondary} align="center" style={{ marginTop: spacing.xs }}>
            Tap the floating (+) button below to create your first offline part worksheet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 100 }}
          renderItem={renderProductItem}
        />
      )}

      {/* Floating Add Product button */}
      <Pressable
        onPress={() => navigateTo('add-product')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.accent,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text weight="bold" style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    borderBottomWidth: 1,
  },
  filterBar: {
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  gridCell: {
    flex: 1,
    padding: 8,
    maxWidth: '50%',
  },
  productCard: {
    flex: 1,
    padding: 12,
  },
  imageContainer: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSymbol: {
    fontSize: 48,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },
});
export default ProductListScreen;
