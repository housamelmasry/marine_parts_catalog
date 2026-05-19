import React from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Part } from '../../../constants/mockData';
import { Text } from '../../../shared/ui/Text';

interface PartsDiagramProps {
  parts: Part[];
  selectedPart: Part | null;
  onSelectPart: (part: Part) => void;
}

export const PartsDiagram: React.FC<PartsDiagramProps> = ({
  parts,
  selectedPart,
  onSelectPart,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="caption" color={colors.textSecondary} style={styles.tip}>
        ℹ️ Tap interactive hotspots below to select parts on diagram
      </Text>

      {/* Abstract mechanical assembly drawing */}
      <View style={[styles.diagramFrame, { backgroundColor: colors.surfaceSecondary, borderRadius: spacing.sm }]}>
        
        {/* Schematic Grid Lines */}
        <View style={styles.gridLines}>
          <View style={[styles.gridRow, { borderBottomColor: colors.border }]} />
          <View style={[styles.gridRow, { borderBottomColor: colors.border }]} />
          <View style={[styles.gridCol, { borderRightColor: colors.border }]} />
          <View style={[styles.gridCol, { borderRightColor: colors.border }]} />
        </View>

        {/* Abstract Outlines representing pistons/manifolds/pumps */}
        <View style={[styles.schematicOutline, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.schematicInternal, { borderColor: colors.border }]} />
          <View style={[styles.schematicInternal2, { borderColor: colors.border }]} />
        </View>
        <View style={[styles.schematicShaft, { backgroundColor: colors.border }]} />

        {/* Interactive Hotspots Overlaid */}
        {parts.map((part) => {
          const isSelected = selectedPart?.id === part.id;
          const { x, y } = part.coordinates;

          return (
            <Pressable
              key={part.id}
              onPress={() => onSelectPart(part)}
              style={[
                styles.hotspot,
                {
                  left: x,
                  top: y,
                  backgroundColor: isSelected ? colors.accent : colors.primary,
                  borderColor: isSelected ? '#FFFFFF' : colors.surface,
                  shadowColor: isSelected ? colors.accent : colors.shadow,
                },
              ]}
            >
              <Text
                weight="bold"
                style={[
                  styles.hotspotText,
                  { color: '#FFFFFF' },
                ]}
              >
                {part.refNo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tip: {
    marginBottom: 12,
    textAlign: 'center',
  },
  diagramFrame: {
    height: 260,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridLines: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  gridRow: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    width: '100%',
    height: 1,
  },
  gridCol: {
    position: 'absolute',
    borderRightWidth: 1,
    borderStyle: 'dashed',
    top: 0,
    bottom: 0,
    width: 1,
  },
  schematicOutline: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schematicInternal: {
    width: 140,
    height: 60,
    borderWidth: 1.5,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  schematicInternal2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderWidth: 1.5,
    borderRadius: 60,
  },
  schematicShaft: {
    position: 'absolute',
    width: 12,
    height: 220,
    transform: [{ rotate: '-30deg' }],
    opacity: 0.7,
  },
  hotspot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
  },
  hotspotText: {
    fontSize: 12,
  },
});
export default PartsDiagram;
