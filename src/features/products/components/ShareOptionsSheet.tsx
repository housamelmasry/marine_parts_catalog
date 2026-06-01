import React, { useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../../../shared/ui/Text';
import { Button } from '../../../shared/components/Button';
import { ShareService, ShareOptions } from '../../../services/share';
import { Product } from '../../../database/db';

interface ShareOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

export const ShareOptionsSheet: React.FC<ShareOptionsSheetProps> = ({
  visible,
  onClose,
  product,
}) => {
  const { colors, spacing } = useTheme();
  const hasImage = product.image_path?.startsWith('file://') || product.thumbnail_path?.startsWith('file://');

  const [options, setOptions] = useState<ShareOptions>({
    includeTitle: true,
    includePrice: true,
    includeTags: true,
    includeNotes: false,
    includeImage: hasImage,
  });

  const toggleOption = (key: keyof ShareOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShare = async (app: 'whatsapp' | 'system') => {
    await ShareService.shareProduct(product, options, app);
    onClose();
  };

  const OptionRow = ({ label, optionKey }: { label: string; optionKey: keyof ShareOptions }) => (
    <Pressable
      onPress={() => toggleOption(optionKey)}
      style={[styles.optionRow, { borderBottomColor: colors.border }]}
    >
      <Text style={{ flex: 1 }}>{label}</Text>
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: options[optionKey] ? colors.primary : 'transparent',
            borderColor: options[optionKey] ? colors.primary : colors.border,
          },
        ]}
      >
        {options[optionKey] && <Text style={{ color: '#FFF', fontSize: 12 }}>✓</Text>}
      </View>
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text variant="h3" weight="bold" style={{ marginBottom: spacing.md }}>
          Share Product
        </Text>

        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.sm }}>
          INCLUDE IN MESSAGE
        </Text>

        <OptionRow label="Title" optionKey="includeTitle" />
        <OptionRow label="Price" optionKey="includePrice" />
        <OptionRow label="Tags" optionKey="includeTags" />
        <OptionRow label="Notes" optionKey="includeNotes" />
        {hasImage && <OptionRow label="Image" optionKey="includeImage" />}

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Button
            title="Share to WhatsApp"
            onPress={() => handleShare('whatsapp')}
          />
          <Button
            title="System Share Sheet"
            onPress={() => handleShare('system')}
            variant="outline"
          />
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareOptionsSheet;
