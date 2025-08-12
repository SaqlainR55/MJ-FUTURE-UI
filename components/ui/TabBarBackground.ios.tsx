import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CYAN = '#4FF3E1';

export default function TabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Frosted glass */}
      <BlurView tint="systemChromeMaterialDark" intensity={70} style={StyleSheet.absoluteFill} />

      {/* Soft inner gradient so it feels like glass */}
      <LinearGradient
        colors={['rgba(79,243,225,0.06)', 'rgba(0,0,0,0.0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Cyan rim */}
      <View pointerEvents="none" style={styles.rim} />

      {/* Tiny HUD ticks along the top edge */}
      <View pointerEvents="none" style={styles.ticksRow}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={styles.tick} />
        ))}
      </View>
    </View>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}

const styles = StyleSheet.create({
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(79,243,225,0.25)',
  },
  ticksRow: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    height: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tick: {
    width: 10,
    height: 1,
    backgroundColor: 'rgba(79,243,225,0.35)',
    borderRadius: 1,
  },
});