import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function HUDPanel({ children, style }: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    ).start();
  }, [t]);

  const notchScaleX = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.85, 1.6, 0.85] });
  const translateX  = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-80, 80, -80] });

  return (
    <View style={[styles.shadowWrap, style]}>
      <LinearGradient
        style={styles.panel}
        colors={['rgba(14,19,24,0.96)', 'rgba(13,18,23,0.90)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View pointerEvents="none" style={styles.insetRim} />

        <Animated.View pointerEvents="none" style={[styles.notchH, styles.nwH, { transform: [{ scaleX: notchScaleX }] }]} />
        <View          pointerEvents="none" style={[styles.notchV, styles.nwV]} />
        <Animated.View pointerEvents="none" style={[styles.notchH, styles.neH, { transform: [{ scaleX: notchScaleX }] }]} />
        <View          pointerEvents="none" style={[styles.notchV, styles.neV]} />
        <Animated.View pointerEvents="none" style={[styles.notchH, styles.swH, { transform: [{ scaleX: notchScaleX }] }]} />
        <View          pointerEvents="none" style={[styles.notchV, styles.swV]} />
        <Animated.View pointerEvents="none" style={[styles.notchH, styles.seH, { transform: [{ scaleX: notchScaleX }] }]} />
        <View          pointerEvents="none" style={[styles.notchV, styles.seV]} />

        <View style={styles.inner}>{children}</View>

        <Animated.View pointerEvents="none" style={[styles.sweepWrap, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['rgba(167,197,255,0.00)', 'rgba(167,197,255,0.08)', 'rgba(167,197,255,0.00)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.sweep}
          />
        </Animated.View>

        <LinearGradient
          pointerEvents="none"
          style={styles.topGloss}
          colors={['rgba(167,197,255,0.08)', 'rgba(167,197,255,0.00)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </LinearGradient>
    </View>
  );
}

const ACCENT = '#A7C5FF';
const R = 16;
const PAD = 12;
const BORDER = 1;

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: R,
    shadowColor: ACCENT,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  panel: {
    borderRadius: R,
    overflow: 'hidden',
    borderWidth: BORDER,
    borderColor: 'rgba(167,197,255,0.28)',
  },
  insetRim: {
    position: 'absolute',
    top: 1, bottom: 1, left: 1, right: 1,
    borderRadius: R - 2,
    borderWidth: 1,
    borderColor: 'rgba(167,197,255,0.14)',
  },
  inner: { padding: PAD },
  topGloss: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    height: 28,
  },
  sweepWrap: {
    position: 'absolute',
    left: -100, right: -100, top: 0, bottom: 0,
  },
  sweep: {
    position: 'absolute',
    top: 6, bottom: 6,
    left: '25%',
    width: '50%',
    transform: [{ rotate: '6deg' }],
  },
  notchH: {
    position: 'absolute',
    height: 1,
    width: 22,
    backgroundColor: 'rgba(167,197,255,0.35)',
  },
  notchV: {
    position: 'absolute',
    width: 1,
    height: 22,
    backgroundColor: 'rgba(167,197,255,0.35)',
  },
  nwH: { left: 10, top: 10, borderRadius: 1 },  nwV: { left: 10, top: 10, borderRadius: 1 },
  neH: { right: 10, top: 10, borderRadius: 1 }, neV: { right: 10, top: 10, borderRadius: 1 },
  swH: { left: 10, bottom: 10, borderRadius: 1 }, swV: { left: 10, bottom: 10, borderRadius: 1 },
  seH: { right: 10, bottom: 10, borderRadius: 1 }, seV: { right: 10, bottom: 10, borderRadius: 1 },
});
