import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated'
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  G,
} from 'react-native-svg'

interface Props {
  size: number
  style?: object
}

const InfinityLoop: React.FC<Props> = ({ size, style }) => {
  const rotateSlow = useSharedValue(0)
  const rotateMed  = useSharedValue(0)
  const rotateFast = useSharedValue(0)
  const glow        = useSharedValue(1)

  useEffect(() => {
    rotateSlow.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    )
    rotateMed.value = withRepeat(
      withTiming(-360, { duration: 18000, easing: Easing.linear }),
      -1,
      false
    )
    rotateFast.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    )
    glow.value = withRepeat(
      withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [])

  const slowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateSlow.value}deg` }],
  }))
  const medStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateMed.value}deg` }],
  }))
  const fastStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateFast.value}deg` }],
  }))
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: interpolate(glow.value, [1, 1.2], [0.6, 0.9]),
  }))

  const center = size / 2

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Soft radial glow behind everything */}
          <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%"  stopColor="#00FFFF" stopOpacity="0.4"/>
            <Stop offset="70%" stopColor="#00FFFF" stopOpacity="0.0"/>
          </RadialGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={center}
          fill="url(#bgGlow)"
        />
      </Svg>

      {/* Slowest outer rings */}
      <Animated.View style={[StyleSheet.absoluteFill, slowStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 20 }).map((_, i) => {
            const r = center - (i * (center / 20))
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                stroke="#00FFFF"
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeDasharray={i % 4 === 0 ? '8 4' : undefined}
                opacity={0.3 + (i / 20) * 0.4}
                fill="none"
              />
            )
          })}
        </Svg>
      </Animated.View>

      {/* Medium-speed mid rings */}
      <Animated.View style={[StyleSheet.absoluteFill, medStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 12 }).map((_, i) => {
            const r = center * 0.7 - (i * (center * 0.7 / 12))
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                stroke="#00FFFF"
                strokeWidth={i % 3 === 0 ? 3 : 1}
                strokeDasharray={i % 2 === 0 ? '4 4' : undefined}
                opacity={0.5}
                fill="none"
              />
            )
          })}
        </Svg>
      </Animated.View>

      {/* Fastest inner rings + orbiting dots */}
      <Animated.View style={[StyleSheet.absoluteFill, fastStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: 6 }).map((_, i) => {
            const r = center * 0.4 - (i * (center * 0.4 / 6))
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                stroke="#00FFFF"
                strokeWidth={1}
                opacity={0.6}
                fill="none"
              />
            )
          })}

          {/* Orbiting dots */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            const r = center * 0.5
            const x = center + r * Math.cos((angle * Math.PI) / 180)
            const y = center + r * Math.sin((angle * Math.PI) / 180)
            return (
              <Circle
                key={i}
                cx={x}
                cy={y}
                r={i % 2 === 0 ? 4 : 2}
                fill="#00FFFF"
                opacity={0.8}
              />
            )
          })}
        </Svg>
      </Animated.View>

      {/* Pulsing core glow */}
      <Animated.View style={[
        StyleSheet.absoluteFill,
        glowStyle,
        { justifyContent: 'center', alignItems: 'center' }
      ]}>
        <View style={{
          width: center * 0.4,
          height: center * 0.4,
          borderRadius: (center * 0.4) / 2,
          backgroundColor: '#00FFFF',
        }} />
      </Animated.View>
    </View>
  )
}

export default InfinityLoop
