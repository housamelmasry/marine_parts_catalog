import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
    const isRealPhoto = item.image_path && item.image_path.startsWith('file://');

    return (
      <View style={styles.gridCell}>
        <Card
          onPress={() => handleSelectProduct(item)}
          style={{ ...styles.productCard, backgroundColor: colors.surface }}
        >
          {/* Product Image Box */}
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: colors.surfaceSecondary,
                borderRadius: spacing.sm,
                overflow: 'hidden',
              },
            ]}
          >
            {isRealPhoto ? (
              <Image
                source={{ uri: item.image_path }}
                style={{ width: '100%', height: '100%', borderRadius: spacing.sm }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.imageSymbol}>{symbol}</Text>
            )}
          </View>

          {/* Category badge */}
          {item.category ? (
            <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Text variant="caption" weight="bold" color={colors.secondary} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          ) : null}

          <Text
            variant="bodyLarge"
            weight="bold"
            numberOfLines={1}
            style={{ marginTop: spacing.xs }}
          >
            {item.title}
          </Text>

          <Text
            variant="h3"
            color={colors.primary}
            weight="bold"
            style={{ marginTop: 2 }}
          >
            {item.price} EGP
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Top Custom Header matching Screen 1 mockup exactly */}
      <View
        style={[styles.customHeader, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Loay Marine Parts
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Catalog
          </Text>
        </View>
        <Pressable
          onPress={() =>
            Alert.alert('Notifications', 'No new spares worksheet updates.')
          }
          style={[
            styles.bellContainer,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Text style={{ fontSize: 20 }}>🔔</Text>
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Top Search bar with custom sliding settings/filter icon */}
      <View
        style={[
          styles.searchContainer,
          {
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            paddingTop: spacing.xs,
          },
        ]}
      >
        <View
          style={[
            styles.searchWrapper,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>
            🔍
          </Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search parts..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            onPress={() => navigateTo('search')}
            style={styles.filterButton}
          >
            <Text style={{ fontSize: 18 }}>🎛️</Text>
          </Pressable>
        </View>
      </View>

      {/* Dynamic Tag Filter chips */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...allTags]}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedTag === item;
            return (
              <Pressable
                onPress={() => setSelectedTag(item)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
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

      {/* Recent / Quick Spares section */}
      {!searchQuery && (
        <View style={{ marginBottom: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              marginBottom: spacing.sm,
            }}
          >
            <Text variant="caption" color={colors.textSecondary} weight="bold">
              Recent
            </Text>
            <Pressable onPress={() => navigateTo('search')}>
              <Text variant="caption" color={colors.primary} weight="bold">
                See all
              </Text>
            </Pressable>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              { id: '1', title: 'Yamaha Pump', price: '2500 EGP', icon: '🌊' },
              {
                id: '2',
                title: 'Mercury Filter',
                price: '900 EGP',
                icon: '⛽',
              },
              { id: '3', title: 'Impeller', price: '3000 EGP', icon: '🌀' },
            ]}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigateTo('search')}
                style={{
                  width: 110,
                  padding: spacing.md,
                  borderRadius: spacing.sm,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.surfaceSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                </View>
                <Text
                  variant="caption"
                  weight="bold"
                  numberOfLines={1}
                  style={{ textAlign: 'center' }}
                >
                  {item.title}
                </Text>
                <Text
                  variant="caption"
                  color={colors.primary}
                  weight="bold"
                  style={{ marginTop: 2 }}
                >
                  {item.price}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

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
          <Text
            variant="bodyMedium"
            color={colors.textSecondary}
            align="center"
            style={{ marginTop: spacing.xs }}
          >
            Tap the floating (+) button below to create your first offline part
            worksheet.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            variant="caption"
            color={colors.textSecondary}
            weight="bold"
            style={{ paddingHorizontal: 16, marginBottom: spacing.xs }}
          >
            All Parts ({products.length})
          </Text>
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: spacing.sm,
              paddingBottom: 100,
            }}
            renderItem={renderProductItem}
          />
        </View>
      )}

      {/* Floating Add Product button */}
      <Pressable
        onPress={() => navigateTo('add-product')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text weight="bold" style={styles.fabText}>
          ＋
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -2,
  },
  bellContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  searchContainer: {
    borderBottomWidth: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterButton: {
    padding: 6,
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
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
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
