import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface Props { size: number; style?: object }

const CYAN = '#4FF3E1';

const InfinityLoop: React.FC<Props> = ({ size, style }) => {
  const rotateSlow = useSharedValue(0);
  const rotateMed  = useSharedValue(0);
  const rotateFast = useSharedValue(0);
  const glow       = useSharedValue(1);
  const radar      = useSharedValue(0);

  useEffect(() => {
    rotateSlow.value = withRepeat(withTiming(360,  { duration: 26000, easing: Easing.linear }), -1, false);
    rotateMed.value  = withRepeat(withTiming(-360, { duration: 19000, easing: Easing.linear }), -1, false);
    rotateFast.value = withRepeat(withTiming(360,  { duration: 13000, easing: Easing.linear }), -1, false);
    glow.value       = withRepeat(withTiming(1.18, { duration: 2200,  easing: Easing.inOut(Easing.ease) }), -1, true);
    radar.value      = withRepeat(withTiming(360,  { duration: 14000, easing: Easing.linear }), -1, false);
  }, []);

  const slowStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateSlow.value}deg` }] }));
  const medStyle  = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateMed.value}deg` }] }));
  const fastStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateFast.value}deg` }] }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: interpolate(glow.value, [1, 1.18], [0.6, 0.92]),
  }));
  const radarStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${radar.value}deg` }] }));

  const c = size / 2;

  // wedge path (radar sweep)
  const r  = c * 0.62;
  const th = (50 * Math.PI) / 180; // 50deg
  const x1 = c + r * Math.cos(-th / 2);
  const y1 = c + r * Math.sin(-th / 2);
  const x2 = c + r * Math.cos(th / 2);
  const y2 = c + r * Math.sin(th / 2);
  const largeArc = th > Math.PI ? 1 : 0;
  const d = `M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={CYAN} stopOpacity="0.22" />
            <Stop offset="70%" stopColor={CYAN} stopOpacity="0.0" />
          </RadialGradient>
        </Defs>
        <Circle cx={c} cy={c} r={c} fill="url(#bgGlow)" />
      </Svg>

      {/* Outer / mid / inner rings (existing)… */}
      <Animated.View style={[StyleSheet.absoluteFill, slowStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 14 }).map((_, i) => {
            const rr = c - i * (c / 14);
            return (
              <Circle
                key={i}
                cx={c}
                cy={c}
                r={rr}
                stroke={CYAN}
                strokeWidth={i % 4 === 0 ? 2 : 1}
                strokeDasharray={i % 3 === 0 ? '10 6' : undefined}
                opacity={0.18 + (i / 14) * 0.35}
                fill="none"
              />
            );
          })}
        </Svg>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, medStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 9 }).map((_, i) => {
            const rr = c * 0.7 - i * (c * 0.7 / 9);
            return (
              <Circle
                key={i}
                cx={c}
                cy={c}
                r={rr}
                stroke={CYAN}
                strokeWidth={i % 2 === 0 ? 2 : 1}
                strokeDasharray={i % 2 === 0 ? '5 5' : undefined}
                opacity={0.36}
                fill="none"
              />
            );
          })}
        </Svg>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, fastStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 5 }).map((_, i) => {
            const rr = c * 0.42 - i * (c * 0.42 / 5);
            return <Circle key={i} cx={c} cy={c} r={rr} stroke={CYAN} strokeWidth={1} opacity={0.5} fill="none" />;
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const rr = c * 0.52;
            const x = c + rr * Math.cos((angle * Math.PI) / 180);
            const y = c + rr * Math.sin((angle * Math.PI) / 180);
            return <Circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 3.5 : 2} fill={CYAN} opacity={0.85} />;
          })}
        </Svg>
      </Animated.View>

      {/* Radar sweep */}
      <Animated.View style={[StyleSheet.absoluteFill, radarStyle]}>
        <Svg width={size} height={size}>
          <Path d={d} fill="rgba(79,243,225,0.12)" />
        </Svg>
      </Animated.View>

      {/* Core pulse */}
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ width: c * 0.42, height: c * 0.42, borderRadius: (c * 0.42) / 2, backgroundColor: CYAN, opacity: 0.16 }} />
      </Animated.View>
    </View>
  );
};

export default InfinityLoop;