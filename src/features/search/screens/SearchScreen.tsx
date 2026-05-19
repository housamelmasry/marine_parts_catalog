import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useAppState } from '../../../app/store';
import { useDebounce } from '../../../hooks/useDebounce';
import { SearchService, SearchResult } from '../../../services/search';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { SearchInput } from '../../../shared/components/SearchInput';
import { PartDetailModal } from '../../../shared/modals/PartDetailModal';
import { Part } from '../../../constants';

export const SearchScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { addToCart, selectedPart, setSelectedPart } = useAppState();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }
    const searchResults = SearchService.searchParts(debouncedQuery);
    setResults(searchResults);
  }, [debouncedQuery]);

  const handleSelectResult = (part: Part) => {
    setSelectedPart(part);
    setDetailModalVisible(true);
  };

  const handleAddToCart = (part: Part) => {
    addToCart(part, 1);
    Alert.alert('Order Added', `1 unit of [${part.partNumber}] was added to your spare parts list.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Spare Parts Search" showBack />

      {/* Search Input Area */}
      <View style={[styles.searchBox, { borderBottomColor: colors.border, padding: spacing.lg }]}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, part number, or description..."
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <Text variant="h3" align="center" style={{ marginBottom: spacing.xs }}>
              Enter Part or OEM Number
            </Text>
            <Text variant="bodyMedium" color={colors.textSecondary} align="center">
              Find spare parts instantly across Yamaha, Mercury, Volvo Penta catalogs by typing name keywords or reference serial numbers.
            </Text>
            <View style={styles.recentSearches}>
              <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
                POPULAR SUGGESTIONS
              </Text>
              <View style={styles.suggestions}>
                {['Impeller', 'Anode', 'Gasket', 'Thermostat', '63P-11325'].map((sug) => (
                  <Pressable
                    key={sug}
                    onPress={() => setQuery(sug)}
                    style={[styles.sugBadge, { backgroundColor: colors.surfaceSecondary }]}
                  >
                    <Text variant="caption" weight="semibold">🔍 {sug}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text variant="bodyLarge" weight="bold" style={{ marginBottom: spacing.md }}>
              Search Results ({results.length})
            </Text>

            {results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="h3" align="center">No Spare Parts Found</Text>
                <Text variant="bodyMedium" color={colors.textSecondary} align="center" style={{ marginTop: spacing.xs }}>
                  Double check the part serial number or search using a shorter term.
                </Text>
              </View>
            ) : (
              results.map(({ part, engineName, assemblyName }) => (
                <Card
                  key={part.id}
                  onPress={() => handleSelectResult(part)}
                  style={{ marginBottom: spacing.md }}
                >
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text variant="caption" color={colors.primary} weight="bold">
                        {part.partNumber}
                      </Text>
                      <Text variant="h3" weight="bold" style={{ marginVertical: 4 }}>
                        {part.name}
                      </Text>
                      <Text variant="caption" color={colors.textSecondary}>
                        Engine: {engineName} ({assemblyName})
                      </Text>
                    </View>

                    <View style={styles.priceSection}>
                      <Text variant="bodyLarge" weight="bold" color={colors.primary}>
                        ${part.price.toFixed(2)}
                      </Text>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAddToCart(part);
                        }}
                        style={[styles.addBtn, { backgroundColor: `${colors.primary}10`, borderRadius: spacing.xs }]}
                      >
                        <Text variant="bodySmall" color={colors.primary} weight="bold">＋ Add</Text>
                      </Pressable>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Part detail modal overlay */}
      <PartDetailModal
        part={selectedPart}
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedPart(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    borderBottomWidth: 1,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  recentSearches: {
    marginTop: 40,
    width: '100%',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sugBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
export default SearchScreen;
