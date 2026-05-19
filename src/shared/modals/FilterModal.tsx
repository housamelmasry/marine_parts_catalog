import React from 'react';
import { StyleSheet, View, Modal, Pressable, Switch } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../ui/Text';
import { Button } from '../components/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  brands: readonly string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  inStockOnly,
  setInStockOnly,
  selectedBrand,
  setSelectedBrand,
  brands,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable 
          style={[styles.modalContent, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text variant="h3" weight="bold">Filter Spare Parts</Text>
            <Pressable onPress={onClose}>
              <Text variant="bodyLarge" color={colors.accent} weight="bold">Close</Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Stock Filter Row */}
          <View style={styles.row}>
            <View>
              <Text variant="bodyLarge" weight="semibold">In-Stock Only</Text>
              <Text variant="caption" color={colors.textSecondary}>Show parts ready to dispatch immediately</Text>
            </View>
            <Switch
              value={inStockOnly}
              onValueChange={setInStockOnly}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Brand Filter */}
          <View style={styles.section}>
            <Text variant="bodyLarge" weight="semibold" style={{ marginBottom: spacing.sm }}>
              Filter by Brand
            </Text>
            <View style={styles.chipContainer}>
              <Pressable
                onPress={() => setSelectedBrand('All')}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedBrand === 'All' ? colors.primary : colors.surfaceSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  weight="bold"
                  color={selectedBrand === 'All' ? '#FFFFFF' : colors.text}
                >
                  All Brands
                </Text>
              </Pressable>
              {brands.map((brand) => (
                <Pressable
                  key={brand}
                  onPress={() => setSelectedBrand(brand)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedBrand === brand ? colors.primary : colors.surfaceSecondary,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    weight="bold"
                    color={selectedBrand === brand ? '#FFFFFF' : colors.text}
                  >
                    {brand}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Button title="Apply Filters" onPress={onClose} style={styles.applyBtn} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  applyBtn: {
    marginTop: 16,
  },
});
export default FilterModal;
