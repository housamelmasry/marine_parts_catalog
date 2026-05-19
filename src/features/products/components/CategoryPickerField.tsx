import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../../../shared/ui/Text';
import { categoryRepository } from '../repository/CategoryRepository';
import { Category } from '../../../database/db';

interface CategoryPickerFieldProps {
  value: string;
  onChange: (name: string) => void;
  isRTL?: boolean;
  label?: string;
}

export const CategoryPickerField: React.FC<CategoryPickerFieldProps> = ({
  value,
  onChange,
  isRTL = false,
  label,
}) => {
  const { colors, spacing, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // "Add new category" sub-form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [adding, setAdding] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const list = await categoryRepository.getAll();
      setCategories(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadCategories();
      setShowAddForm(false);
      setNewName('');
      setNewNameAr('');
    }
  }, [open, loadCategories]);

  const handleSelect = (cat: Category) => {
    onChange(isRTL ? cat.name_ar : cat.name);
    setOpen(false);
  };

  const handleAddCategory = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      const created = await categoryRepository.create(trimmed, newNameAr.trim());
      setCategories(prev => {
        const exists = prev.find(c => c.id === created.id);
        return exists ? prev : [...prev, created];
      });
      onChange(isRTL ? created.name_ar : created.name);
      setShowAddForm(false);
      setNewName('');
      setNewNameAr('');
      setOpen(false);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    try {
      await categoryRepository.delete(cat.id);
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      if (value === cat.name || value === cat.name_ar) onChange('');
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  };

  const displayLabel = value || (isRTL ? 'اختر فئة...' : 'Select category...');

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <Text
          variant="caption"
          color={colors.textSecondary}
          style={{ marginBottom: spacing.xs }}
        >
          {label}
        </Text>
      )}

      {/* Trigger button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
            borderRadius: spacing.sm,
            padding: spacing.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Text
          style={{ flex: 1, fontSize: 16, color: value ? colors.text : colors.textSecondary }}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginLeft: 8 }}>▾</Text>
      </Pressable>

      {/* Full-screen modal sheet */}
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrapper}
        >
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.surface },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.sheetHeader,
                {
                  borderBottomColor: colors.border,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
            >
              <Text variant="h3" weight="bold" style={{ flex: 1 }}>
                {isRTL ? 'اختر فئة' : 'Select Category'}
              </Text>
              <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
                <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
              </Pressable>
            </View>

            {/* Category list */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginVertical: 32 }}
              />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 8 }}
                renderItem={({ item }) => {
                  const isSelected = value === item.name || value === item.name_ar;
                  const displayName = isRTL ? item.name_ar : item.name;
                  return (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      style={[
                        styles.categoryRow,
                        {
                          backgroundColor: isSelected
                            ? colors.primary + '1A'
                            : 'transparent',
                          borderBottomColor: colors.border,
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                        },
                      ]}
                    >
                      {/* Category icon dot */}
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: isSelected ? colors.primary : colors.border },
                        ]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          weight={isSelected ? 'bold' : 'regular'}
                          color={isSelected ? colors.primary : colors.text}
                        >
                          {displayName}
                        </Text>
                        {/* Show both names when bilingual */}
                        {item.name !== item.name_ar && (
                          <Text variant="caption" color={colors.textSecondary}>
                            {isRTL ? item.name : item.name_ar}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Text style={{ fontSize: 16, color: colors.primary }}>✓</Text>
                      )}
                      {/* Long-press hint to delete (only user-created categories above id 8) */}
                      {item.id > 8 && (
                        <Pressable
                          onPress={() => handleDeleteCategory(item)}
                          style={[styles.deleteBtn, { backgroundColor: '#FF3B3020' }]}
                          hitSlop={8}
                        >
                          <Text style={{ fontSize: 12, color: '#FF3B30' }}>✕</Text>
                        </Pressable>
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text
                    color={colors.textSecondary}
                    align="center"
                    style={{ marginVertical: 24 }}
                  >
                    {isRTL ? 'لا توجد فئات' : 'No categories yet'}
                  </Text>
                }
              />
            )}

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: colors.border }} />

            {/* Add new category section */}
            {showAddForm ? (
              <View style={[styles.addForm, { backgroundColor: isDark ? '#1A2840' : '#F0F7FF' }]}>
                <Text
                  variant="caption"
                  weight="bold"
                  color={colors.primary}
                  style={{ marginBottom: 10 }}
                >
                  {isRTL ? '➕ إضافة فئة جديدة' : '➕ Add New Category'}
                </Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder={isRTL ? 'اسم الفئة (بالإنجليزية)' : 'Category name (English)'}
                  placeholderTextColor={colors.textSecondary}
                  style={[
                    styles.addInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: colors.border,
                    },
                  ]}
                  autoFocus
                />
                <TextInput
                  value={newNameAr}
                  onChangeText={setNewNameAr}
                  placeholder="اسم الفئة (عربي) — اختياري"
                  placeholderTextColor={colors.textSecondary}
                  textAlign="right"
                  style={[
                    styles.addInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.surfaceSecondary,
                      borderColor: colors.border,
                      marginTop: 8,
                    },
                  ]}
                />
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <Pressable
                    onPress={() => setShowAddForm(false)}
                    style={[styles.addActionBtn, { backgroundColor: colors.surfaceSecondary, flex: 1 }]}
                  >
                    <Text color={colors.textSecondary} weight="bold">
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddCategory}
                    disabled={adding || !newName.trim()}
                    style={[
                      styles.addActionBtn,
                      {
                        backgroundColor: newName.trim() ? colors.primary : colors.border,
                        flex: 2,
                      },
                    ]}
                  >
                    {adding ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text color="#FFFFFF" weight="bold">
                        {isRTL ? 'حفظ الفئة' : 'Save Category'}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setShowAddForm(true)}
                style={[
                  styles.addCategoryBtn,
                  {
                    backgroundColor: isDark ? '#1A2840' : '#EBF4FF',
                    borderColor: colors.primary + '40',
                  },
                ]}
              >
                <Text style={{ fontSize: 18, marginRight: 8 }}>➕</Text>
                <Text weight="bold" color={colors.primary}>
                  {isRTL ? 'إضافة فئة جديدة' : 'Add New Category'}
                </Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 560,
    overflow: 'hidden',
  },
  sheetHeader: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addForm: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  addInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  addActionBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryPickerField;
