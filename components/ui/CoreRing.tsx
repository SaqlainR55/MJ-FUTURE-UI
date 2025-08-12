import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import InfinityLoop from './InfinityLoop';

const ACCENT = '#A7C5FF';
const ACCENT_DIM = 'rgba(167,197,255,0.28)';
const INK = 'rgba(14,19,24,1)';

export default function CoreRing() {
  const { width, height } = useWindowDimensions();
  const SIZE = Math.min(width, height) * 0.70;

  // Rotations for orbiters + dashed ring
  const spinA = useRef(new Animated.Value(0)).current;
  const spinB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (v: Animated.Value, dur: number, dir: 1 | -1 = 1) =>
      Animated.loop(
        Animated.timing(v, {
          toValue: 1,
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

    loop(spinA, 18000, 1);
    loop(spinB, 26000, -1);

    return () => {
      spinA.stopAnimation();
      spinB.stopAnimation();
    };
  }, [spinA, spinB]);

  const r1 = SIZE * 0.86;
  const r2 = SIZE * 0.66;
  const r3 = SIZE * 0.48;

  const rotA = spinA.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotB = spinB.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  return (
    <View style={[styles.wrapper]}>
      {/* Outer glow halo */}
      <LinearGradient
        colors={['rgba(167,197,255,0.06)', 'rgba(167,197,255,0.0)']}
        style={{ width: SIZE * 1.2, height: SIZE * 1.2, borderRadius: SIZE * 0.6 }}
      />

      {/* Your animated SVG loop */}
      <View style={{ position: 'absolute' }}>
        <InfinityLoop size={SIZE} />
      </View>

      {/* Concentric glass rings */}
      <View style={[styles.ring, { width: r1, height: r1, borderColor: 'rgba(167,197,255,0.20)' }]} />
      <View style={[styles.ring, { width: r2, height: r2, borderColor: 'rgba(167,197,255,0.16)' }]} />
      <View style={[styles.ring, { width: r3, height: r3, borderColor: 'rgba(167,197,255,0.14)' }]} />

      {/* Dashed orbit (animated rotation) */}
      <Animated.View style={[styles.dashed, { width: r1 * 0.92, height: r1 * 0.92, transform: [{ rotate: rotA }] }]} />

      {/* Orbiters */}
      <Animated.View style={[styles.orbiterWrap, { width: r2, height: r2, transform: [{ rotate: rotA }] }]}>
        <View style={[styles.dot, { backgroundColor: ACCENT }]} />
      </Animated.View>

      <Animated.View style={[styles.orbiterWrap, { width: r3 * 0.84, height: r3 * 0.84, transform: [{ rotate: rotB }] }]}>
        <View style={[styles.dot, { backgroundColor: ACCENT_DIM }]} />
      </Animated.View>

      {/* Core glow */}
      <LinearGradient
        colors={['rgba(167,197,255,0.18)', 'rgba(167,197,255,0.04)']}
        style={{ position: 'absolute', width: r3 * 0.7, height: r3 * 0.7, borderRadius: r3 * 0.35 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
  },
  dashed: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(167,197,255,0.25)',
    borderStyle: 'dashed',
  },
  orbiterWrap: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: ACCENT,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});