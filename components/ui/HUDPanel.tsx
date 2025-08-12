// components/ui/HUDPanel.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'; // ⬅️ add StyleProp

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // ⬅️ allow object OR array
}
/**
 * Futuristic HUD panel:
 * - Soft cyan outer glow (no clipping)
 * - Subtle glass gradient background
 * - Inset border + faint inner rim
 * - Corner "notches" for that sci-fi card feel
 * - Keeps the same API: <HUDPanel style>{children}</HUDPanel>
 */
export default function HUDPanel({ children, style }: Props) {
  return (
    <View style={[styles.shadowWrap, style]}>
      {/* Glass body */}
      <LinearGradient
        style={styles.panel}
        colors={['rgba(14,19,24,0.96)', 'rgba(13,18,23,0.90)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Inset rim */}
        <View pointerEvents="none" style={styles.insetRim} />

        {/* Corner notches */}
        <View pointerEvents="none" style={[styles.notchH, styles.nwH]} />
        <View pointerEvents="none" style={[styles.notchV, styles.nwV]} />

        <View pointerEvents="none" style={[styles.notchH, styles.neH]} />
        <View pointerEvents="none" style={[styles.notchV, styles.neV]} />

        <View pointerEvents="none" style={[styles.notchH, styles.swH]} />
        <View pointerEvents="none" style={[styles.notchV, styles.swV]} />

        <View pointerEvents="none" style={[styles.notchH, styles.seH]} />
        <View pointerEvents="none" style={[styles.notchV, styles.seV]} />

        {/* Content */}
        <View style={styles.inner}>{children}</View>

        {/* Subtle top gloss */}
        <LinearGradient
          pointerEvents="none"
          style={styles.topGloss}
          colors={['rgba(79,243,225,0.08)', 'rgba(79,243,225,0.00)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </LinearGradient>
    </View>
  );
}

const CYAN = '#4FF3E1';

const R = 16;        // radius
const PAD = 12;      // inner padding
const BORDER = 1;

const styles = StyleSheet.create({
  // Outer wrapper shows the glow without clipping
  shadowWrap: {
    borderRadius: R,
    // Outer glow
    shadowColor: CYAN,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8, // Android glow
  },

  // Glass body
  panel: {
    borderRadius: R,
    overflow: 'hidden',
    borderWidth: BORDER,
    borderColor: 'rgba(79,243,225,0.28)',
  },

  // Inset rim (thin inner border for depth)
  insetRim: {
    position: 'absolute',
    top: 1, bottom: 1, left: 1, right: 1,
    borderRadius: R - 2,
    borderWidth: 1,
    borderColor: 'rgba(79,243,225,0.14)',
  },

  // Content region
  inner: {
    padding: PAD,
  },

  // Top subtle gloss gradient
  topGloss: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    height: 28,
  },

  // Corner notches (L-shaped, 1px)
  notchH: {
    position: 'absolute',
    height: 1,
    width: 22,
    backgroundColor: 'rgba(79,243,225,0.35)',
  },
  notchV: {
    position: 'absolute',
    width: 1,
    height: 22,
    backgroundColor: 'rgba(79,243,225,0.35)',
  },

  // NW
  nwH: { left: 10, top: 10, borderRadius: 1 },
  nwV: { left: 10, top: 10, borderRadius: 1 },
  // NE
  neH: { right: 10, top: 10, borderRadius: 1 },
  neV: { right: 10, top: 10, borderRadius: 1 },
  // SW
  swH: { left: 10, bottom: 10, borderRadius: 1 },
  swV: { left: 10, bottom: 10, borderRadius: 1 },
  // SE
  seH: { right: 10, bottom: 10, borderRadius: 1 },
  seV: { right: 10, bottom: 10, borderRadius: 1 },
});