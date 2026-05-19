import React from 'react';
import { StyleSheet, View, Pressable, FlatList } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Part } from '../../../constants/mockData';
import { Text } from '../../../shared/ui/Text';
import { formatCurrency } from '../../../utils/format';

interface PartsTableProps {
  parts: Part[];
  selectedPart: Part | null;
  onSelectPart: (part: Part) => void;
  onAddToCart: (part: Part) => void;
  preferredWarehouse: string;
}

export const PartsTable: React.FC<PartsTableProps> = ({
  parts,
  selectedPart,
  onSelectPart,
  onAddToCart,
  preferredWarehouse,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      {/* Table Headers */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border, backgroundColor: colors.surfaceSecondary }]}>
        <Text variant="caption" weight="bold" style={styles.refCol}>REF</Text>
        <Text variant="caption" weight="bold" style={styles.nameCol}>PART / DESCRIPTION</Text>
        <Text variant="caption" weight="bold" style={styles.stockCol} align="center">STOCK</Text>
        <Text variant="caption" weight="bold" style={styles.priceCol} align="right">PRICE</Text>
        <Text variant="caption" weight="bold" style={styles.actionCol} align="center">ADD</Text>
      </View>

      {/* Parts Rows */}
      {parts.map((part) => {
        const isSelected = selectedPart?.id === part.id;
        const localStock = part.warehouses[preferredWarehouse] ?? 0;
        
        return (
          <Pressable
            key={part.id}
            onPress={() => onSelectPart(part)}
            style={[
              styles.row,
              {
                borderBottomColor: colors.border,
                backgroundColor: isSelected 
                  ? `${colors.primary}15` 
                  : colors.surface,
              },
            ]}
          >
            <View style={[styles.refCol, styles.refBadge, { backgroundColor: isSelected ? colors.primary : colors.surfaceSecondary }]}>
              <Text
                variant="caption"
                weight="bold"
                color={isSelected ? '#FFFFFF' : colors.text}
              >
                {part.refNo}
              </Text>
            </View>

            <View style={styles.nameCol}>
              <Text variant="bodySmall" weight="bold" style={{ letterSpacing: 0.2 }}>
                {part.partNumber}
              </Text>
              <Text variant="bodyMedium" numberOfLines={1} style={{ marginTop: 2 }}>
                {part.name}
              </Text>
            </View>

            <View style={styles.stockCol}>
              <Text
                variant="caption"
                weight="bold"
                align="center"
                color={localStock > 5 ? colors.success : localStock > 0 ? colors.warning : colors.error}
              >
                {localStock > 0 ? `${localStock} left` : 'OUT'}
              </Text>
            </View>

            <View style={styles.priceCol}>
              <Text variant="bodyMedium" weight="semibold" align="right">
                {formatCurrency(part.price)}
              </Text>
            </View>

            <Pressable
              onPress={() => onAddToCart(part)}
              style={[
                styles.actionCol,
                styles.addBtn,
                { backgroundColor: `${colors.primary}10`, borderRadius: spacing.xs },
              ]}
            >
              <Text variant="bodyMedium" color={colors.primary} weight="bold" align="center">
                ＋
              </Text>
            </Pressable>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  refCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refBadge: {
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  nameCol: {
    flex: 2,
    paddingRight: 8,
  },
  stockCol: {
    width: 65,
    justifyContent: 'center',
  },
  priceCol: {
    width: 80,
    justifyContent: 'center',
  },
  actionCol: {
    width: 40,
    justifyContent: 'center',
  },
  addBtn: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
export default PartsTable;
