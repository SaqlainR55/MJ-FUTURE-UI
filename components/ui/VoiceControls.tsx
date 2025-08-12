import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#A7C5FF';
const RED = '#FF6B82';
const SIZE = 56;
const R = SIZE / 2;

function HoloButton({ color, icon }: { color: string; icon: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })).start();
  }, [spin]);

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 8 }),
      Animated.timing(flash, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(ripple, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(ripple, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  };
  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
      Animated.timing(flash, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const flashOpacity = flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });
  const rippleScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const rippleOpacity = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.35] });

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.btnWrap, { transform: [{ scale }] }]}>
        <Animated.View style={[styles.aura, { transform: [{ rotate }] }]} />
        <Animated.View style={[styles.ripple, { transform: [{ scale: rippleScale }], opacity: rippleOpacity, borderColor: color }]} />

        <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.35)']} style={[styles.btn, { borderColor: color }]}>
          <Animated.View style={[styles.flash, { backgroundColor: color, opacity: flashOpacity }]} />
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export default function VoiceControls() {
  return (
    <View style={styles.container}>
      <HoloButton color={RED} icon="🔇" />
      <HoloButton color={ACCENT} icon="❌" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  btnWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: SIZE,
    height: SIZE,
    borderRadius: R,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: { fontSize: 22, color: '#fff' },
  flash: { ...StyleSheet.absoluteFillObject, borderRadius: R },
  aura: {
    position: 'absolute',
    width: SIZE + 18,
    height: SIZE + 18,
    borderRadius: (SIZE + 18) / 2,
    borderWidth: 1,
    borderColor: 'rgba(167,197,255,0.35)',
    borderStyle: 'dashed',
  },
  ripple: {
    position: 'absolute',
    width: SIZE + 10,
    height: SIZE + 10,
    borderRadius: (SIZE + 10) / 2,
    borderWidth: 1,
  },
});