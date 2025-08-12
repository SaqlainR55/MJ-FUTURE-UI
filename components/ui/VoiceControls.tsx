import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const CYAN = '#4FF3E1';
const RED = '#EF4444';

function HoloButton({
  color = CYAN,
  bg = 'rgba(79,243,225,0.14)',
  border = 'rgba(79,243,225,0.65)',
  icon = '❌',
  onPress,
}: {
  color?: string;
  bg?: string;
  border?: string;
  icon: string;
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, bounciness: 8 }),
      Animated.timing(flash, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
      Animated.timing(flash, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const flashOpacity = flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
      <Animated.View style={[styles.btnWrap, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[bg, 'rgba(0,0,0,0.2)']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={[styles.btn, { borderColor: border }]}
        >
          {/* inner glow flash */}
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
      <HoloButton
        icon="🔇"
        color={RED}
        bg="rgba(239,68,68,0.10)"
        border="rgba(239,68,68,0.70)"
        onPress={() => {}}
      />
      <HoloButton icon="❌" onPress={() => {}} />
    </View>
  );
}

const SIZE = 56;
const R = SIZE / 2;

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
    shadowColor: CYAN,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  btn: {
    flex: 1,
    borderRadius: R,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: R,
    opacity: 0,
  },
  icon: {
    fontSize: 22,
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});