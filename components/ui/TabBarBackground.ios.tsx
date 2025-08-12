import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ping-pong conveyor: left <-> right (no jump)
    Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(x, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    ).start();
  }, [x]);

  const translateX = x.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-12, 12, -12],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Frosted glass */}
      <BlurView tint="systemChromeMaterialDark" intensity={70} style={StyleSheet.absoluteFill} />
      {/* Soft inner gradient */}
      <LinearGradient
        colors={['rgba(79,243,225,0.06)', 'rgba(0,0,0,0.0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Neon rim */}
      <View pointerEvents="none" style={styles.rim} />
      {/* Moving ticks */}
      <Animated.View pointerEvents="none" style={[styles.ticksRow, { transform: [{ translateX }] }]}>
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} style={styles.tick} />
        ))}
      </Animated.View>
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
    left: 10,
    right: 10,
    height: 6,
    flexDirection: 'row',
  },
  tick: {
    width: 10,
    marginRight: 14,
    height: 1,
    backgroundColor: 'rgba(79,243,225,0.30)',
    borderRadius: 1,
  },
});