import React from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Part } from '../../constants/mockData';
import { Text } from '../ui/Text';
import { Button } from '../components/Button';
import { formatCurrency } from '../../utils/format';
import { ShareService } from '../../services/share';
import { useAppState } from '../../app/store';

interface PartDetailModalProps {
  part: Part | null;
  visible: boolean;
  onClose: () => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  visible,
  onClose,
}) => {
  const { colors, spacing } = useTheme();
  const { addToCart } = useAppState();

  if (!part) return null;

  const handleShare = () => {
    ShareService.sharePartDetails(part);
  };

  const handleAddToCart = () => {
    addToCart(part, 1);
    onClose();
  };

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
            <View>
              <Text variant="caption" color={colors.primary} weight="bold">REF NO. {part.refNo}</Text>
              <Text variant="h2" weight="bold">{part.name}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text variant="bodyLarge" color={colors.textSecondary} weight="bold">✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
            {/* Price & Stock Section */}
            <View style={[styles.pricingCard, { backgroundColor: colors.surfaceSecondary, borderRadius: spacing.md }]}>
              <View>
                <Text variant="caption" color={colors.textSecondary}>LIST PRICE</Text>
                <Text variant="h1" color={colors.primary} weight="bold">{formatCurrency(part.price)}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text variant="caption" color={colors.textSecondary}>GLOBAL STOCK</Text>
                <Text variant="h2" color={part.stock > 10 ? colors.success : colors.warning} weight="bold">
                  {part.stock} Units
                </Text>
              </View>
            </View>

            {/* Part Number Details */}
            <View style={styles.section}>
              <Text variant="caption" color={colors.textSecondary}>OEM PART NUMBER</Text>
              <Text variant="bodyLarge" weight="bold" style={styles.partNo}>{part.partNumber}</Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text variant="caption" color={colors.textSecondary}>DESCRIPTION</Text>
              <Text variant="bodyMedium" style={{ marginTop: spacing.xs, lineHeight: 20 }}>
                {part.description}
              </Text>
            </View>

            {/* Warehouse Stock breakdown */}
            <View style={styles.section}>
              <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
                WAREHOUSE STOCK BREAKDOWN
              </Text>
              {Object.entries(part.warehouses).map(([whName, whStock]) => (
                <View key={whName} style={[styles.warehouseRow, { borderBottomColor: colors.border }]}>
                  <Text variant="bodyMedium" weight="medium">📍 {whName} Hub</Text>
                  <Text
                    variant="bodyMedium"
                    weight="bold"
                    color={whStock > 5 ? colors.success : whStock > 0 ? colors.warning : colors.error}
                  >
                    {whStock > 0 ? `${whStock} in stock` : 'Out of stock'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Compatible Models */}
            <View style={styles.section}>
              <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
                COMPATIBLE ENGINES
              </Text>
              <View style={styles.compatibilityList}>
                {part.compatibleModels.map((model) => (
                  <View key={model} style={[styles.modelBadge, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text variant="caption" weight="semibold">⚓ {model}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Button
              title="Share Quote"
              onPress={handleShare}
              variant="outline"
              style={styles.actionBtn}
            />
            <Button
              title="Add to Order"
              onPress={handleAddToCart}
              variant="primary"
              style={{ ...styles.actionBtn, flex: 1.5 }}
            />
          </View>
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 8,
  },
  pricingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  section: {
    marginBottom: 20,
  },
  partNo: {
    fontSize: 18,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  warehouseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  compatibilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  modelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
  },
});
export default PartDetailModal;
