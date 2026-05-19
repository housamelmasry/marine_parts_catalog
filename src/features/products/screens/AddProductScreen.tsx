import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useUIStore } from '../../../app/store';
import { productRepository } from '../repository/ProductRepository';
import { imageService } from '../../../services/image';
import { Text } from '../../../shared/ui/Text';
import { Card } from '../../../shared/components/Card';
import { Header } from '../../../shared/components/Header';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/ui/Input';

const SYMBOL_OPTIONS = [
  { symbol: '🌊', label: 'Pump', code: 'part_pump' },
  { symbol: '🌀', label: 'Propeller', code: 'part_prop' },
  { symbol: '⛽', label: 'Fuel Filter', code: 'part_filter' },
  { symbol: '⚡', label: 'Spark Plug', code: 'part_spark' },
  { symbol: '⚓', label: 'Anchor', code: 'default' },
];

export const AddProductScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { goBack } = useUIStore();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedIconCode, setSelectedIconCode] = useState('default');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Product title is required.');
      return;
    }

    try {
      setSaving(true);
      
      // Simulate copies to offline device folders
      const storedImage = await imageService.copyToAppStorage(selectedIconCode);
      const storedThumb = await imageService.generateThumbnail(selectedIconCode);

      await productRepository.create({
        title: title.trim(),
        price: parseFloat(price) || 0,
        tags: tags.trim() || '#marine',
        notes: notes.trim(),
        image_path: storedImage,
        thumbnail_path: storedThumb,
      });

      setSaving(false);
      Alert.alert('Catalog Success', `"${title}" has been successfully added to offline SQLite.`);
      goBack(); // Return to Home
    } catch (e: any) {
      setSaving(false);
      Alert.alert('Save Error', e.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Add New Product" showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
        {/* Offline Symbol Picker Zone */}
        <Text variant="caption" color={colors.textSecondary} weight="bold" style={{ marginBottom: spacing.xs }}>
          SELECT PRODUCT CATEGORY ICON
        </Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.gridRow}>
            {SYMBOL_OPTIONS.map((opt) => {
              const isSelected = selectedIconCode === opt.code;
              return (
                <Pressable
                  key={opt.code}
                  onPress={() => setSelectedIconCode(opt.code)}
                  style={[
                    styles.symbolBox,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceSecondary,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderRadius: spacing.sm,
                    },
                  ]}
                >
                  <Text style={styles.symbol}>{opt.symbol}</Text>
                  <Text
                    variant="caption"
                    weight="bold"
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Product form details */}
        <Input
          label="Product Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Yamaha Water Impeller"
        />

        <Input
          label="Price (EGP)"
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 2500"
          keyboardType="numeric"
        />

        <Input
          label="Tags (comma or space separated, e.g. #yamaha #pump)"
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. #yamaha #pump #outboard"
        />

        <Input
          label="Technical Notes / Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Fitment specs, compatible engines..."
          multiline
          numberOfLines={4}
          style={{ height: 90, textAlignVertical: 'top' }}
        />

        <Button
          title="SAVE PRODUCT"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  symbolBox: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  symbol: {
    fontSize: 24,
    marginBottom: 4,
  },
});
export default AddProductScreen;
