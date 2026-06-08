import React, { useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../../../shared/ui/Text';
import { Button } from '../../../shared/components/Button';
import { ShareService, ShareOptions } from '../../../services/share';
import { Product } from '../../../database/db';
import { imageService } from '../../../services/image';

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
  const allImages = ShareService.getProductImageUrls(product);

  const [options, setOptions] = useState<ShareOptions>({
    includeTitle: true,
    includePrice: true,
    includeTags: true,
    includeNotes: false,
    selectedImages: allImages.length > 0 ? [allImages[0]] : [],
  });

  const toggleOption = (key: Exclude<keyof ShareOptions, 'selectedImages'>) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleImage = (imageUri: string) => {
    setOptions(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.includes(imageUri)
        ? prev.selectedImages.filter(uri => uri !== imageUri)
        : [...prev.selectedImages, imageUri],
    }));
  };

  const handleShare = async (
    app: 'whatsapp' | 'telegram' | 'messenger' | 'facebook' | 'system',
  ) => {
    await ShareService.shareProduct(product, options, app);
    onClose();
  };

  const OptionRow = ({
    label,
    optionKey,
  }: {
    label: string;
    optionKey: Exclude<keyof ShareOptions, 'selectedImages'>;
  }) => (
    <Pressable
      onPress={() => toggleOption(optionKey)}
      style={[styles.optionRow, { borderBottomColor: colors.border }]}
    >
      <Text style={{ flex: 1 }}>{label}</Text>
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: options[optionKey]
              ? colors.primary
              : 'transparent',
            borderColor: options[optionKey] ? colors.primary : colors.border,
          },
        ]}
      >
        {options[optionKey] && (
          <Text style={{ color: '#FFF', fontSize: 12 }}>✓</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text variant="h3" weight="bold" style={{ marginBottom: spacing.md }}>
            📤 Share Product
          </Text>

          <Text
            variant="caption"
            color={colors.textSecondary}
            weight="bold"
            style={{ marginBottom: spacing.md }}
          >
            WHAT TO INCLUDE
          </Text>

          <OptionRow label="Title" optionKey="includeTitle" />
          <OptionRow label="Price" optionKey="includePrice" />
          <OptionRow label="Tags" optionKey="includeTags" />
          <OptionRow label="Notes" optionKey="includeNotes" />

          {allImages.length > 0 && (
            <>
              <Text
                variant="caption"
                color={colors.textSecondary}
                weight="bold"
                style={{
                  marginTop: spacing.lg,
                  marginBottom: spacing.md,
                  color:
                    options.selectedImages.length === 0
                      ? colors.error
                      : colors.textSecondary,
                }}
              >
                SELECT IMAGES ({options.selectedImages.length} /{' '}
                {allImages.length})
              </Text>
              <View style={[styles.imageGrid, { marginBottom: spacing.lg }]}>
                {allImages.map((imageUri, index) => {
                  const isRealPhoto = imageUri.startsWith('file://');
                  const symbol = imageService.getPlaceholderSymbol(imageUri);
                  const isSelected = options.selectedImages.includes(imageUri);

                  return (
                    <Pressable
                      key={imageUri + index}
                      onPress={() => toggleImage(imageUri)}
                      style={[
                        styles.imageThumbnail,
                        {
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          borderWidth: isSelected ? 3 : 1,
                          backgroundColor: isSelected
                            ? colors.primary + '20'
                            : colors.border + '20',
                        },
                      ]}
                    >
                      {isRealPhoto ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.imagePreview}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.placeholderSymbol}>{symbol}</Text>
                      )}
                      {isSelected && (
                        <View
                          style={[
                            styles.checkmark,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text
                            style={{
                              color: '#FFF',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}
                          >
                            ✓
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <View
            style={{
              marginTop: spacing.lg,
              gap: spacing.sm,
              marginBottom: spacing.xl,
            }}
          >
            <Button
              title="💬 Share to WhatsApp"
              onPress={() => handleShare('whatsapp')}
              disabled={options.selectedImages.length === 0}
            />
            <Button
              title="✈️ Share to Telegram"
              onPress={() => handleShare('telegram')}
              variant="outline"
              disabled={options.selectedImages.length === 0}
            />
            <Button
              title="👤 Share to Messenger"
              onPress={() => handleShare('messenger')}
              variant="outline"
              disabled={options.selectedImages.length === 0}
            />
            <Button
              title="📘 Share to Facebook"
              onPress={() => handleShare('facebook')}
              variant="outline"
              disabled={options.selectedImages.length === 0}
            />
            <Button
              title="📱 More Options"
              onPress={() => handleShare('system')}
              variant="outline"
              disabled={options.selectedImages.length === 0}
            />
            <Button title="Cancel" onPress={onClose} variant="outline" />
          </View>
        </ScrollView>
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
    maxHeight: '90%',
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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageThumbnail: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  placeholderSymbol: {
    fontSize: 24,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareOptionsSheet;
