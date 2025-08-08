// components/ui/CoreRing.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import InfinityLoop from './InfinityLoop';

export default function CoreRing() {
  const { width, height } = useWindowDimensions();
  const SIZE = Math.min(width, height) * 0.7;
  
  // Earth animations
  const earthRotation = useSharedValue(0);
  const earthGlow = useSharedValue(1);
  const continentRotation = useSharedValue(0);

  useEffect(() => {
    earthRotation.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );

    continentRotation.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );

    earthGlow.value = withRepeat(
      withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const earthRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earthRotation.value}deg` }],
  }));

  const continentRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${continentRotation.value}deg` }],
  }));

  const earthGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(earthGlow.value, [1, 1.4], [0.4, 0.7]), // More subtle range
    transform: [{ scale: interpolate(earthGlow.value, [1, 1.4], [1, 1.005]) }], // Very minimal scaling
  }));

  return (
    <View style={styles.wrapper}>
      <InfinityLoop size={SIZE} />
      
      {/* Bigger Earth with subtle thin ring glow */}
      <Animated.View
        style={[
          styles.earthContainer,
          {
            left: width / 2 + SIZE / 2 - 0, // Adjusted for bigger size
            top: height / 2 - 15,
          },
        ]}
      >
        {/* Very subtle thin glowing ring */}
        <Animated.View style={[styles.earthGlow, earthGlowStyle]} />
        
        {/* Atmospheric glow */}
        <View style={styles.atmosphere} />
        
        {/* Main Earth body with ocean gradient */}
        <Animated.View style={[styles.earthBody, earthRotateStyle]}>
          <LinearGradient
            colors={['#1e3a8a', '#1e40af', '#2563eb', '#0f172a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.oceanGradient}
          />
        </Animated.View>
        
        {/* Continent overlay */}
        <Animated.View style={[styles.continentContainer, continentRotateStyle]}>
          <View style={[styles.continent1]} />
          <View style={[styles.continent2]} />
          <View style={[styles.continent3]} />
        </Animated.View>
        
        {/* Cloud layer */}
        <Animated.View style={[styles.cloudLayer, earthRotateStyle]}>
          <View style={styles.cloud1} />
          <View style={styles.cloud2} />
        </Animated.View>
        
        {/* Highlight/shine effect */}
        <View style={styles.earthHighlight} />
        
        {/* Terminator line (day/night boundary) */}
        <View style={styles.terminator} />
      </Animated.View>
      
      <Text style={styles.timer}>00:00:57:478.34</Text>
    </View>
  );
}

const NAV_BAR_HEIGHT = 80;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: NAV_BAR_HEIGHT / 0.52,
  },
  timer: {
    position: 'absolute',
    bottom: 40,
    color: '#00FFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  earthContainer: {
    position: 'absolute',
    width: 80,        // Increased from 60
    height: 80,       // Increased from 60
    justifyContent: 'center',
    alignItems: 'center',
  },
  earthGlow: {
    position: 'absolute',
    width: 66,        // Just slightly bigger than Earth (64px)
    height: 66,       
    borderRadius: 33,
    backgroundColor: 'transparent',
    borderWidth: 1,   // Thin border
    borderColor: '#00FFFF',
    opacity: 0.2,     // Very subtle
  },
  atmosphere: {
    position: 'absolute',
    width: 68,        // Scaled up
    height: 68,       
    borderRadius: 34,
    backgroundColor: '#4dd0e1',
    opacity: 0.15,    // More subtle
  },
  earthBody: {
    width: 64,        // Increased from 50
    height: 64,       
    borderRadius: 32,
    overflow: 'hidden',
  },
  oceanGradient: {
    width: 64,        
    height: 64,       
    borderRadius: 32,
  },
  continentContainer: {
    position: 'absolute',
    width: 64,        
    height: 64,       
    borderRadius: 32,
    overflow: 'hidden',
  },
  continent1: {
    position: 'absolute',
    width: 28,        // Scaled up proportionally
    height: 20,       
    backgroundColor: '#2d5a27',
    borderRadius: 14,
    top: 14,
    left: 22,
    opacity: 0.8,
  },
  continent2: {
    position: 'absolute',
    width: 18,        
    height: 14,       
    backgroundColor: '#4a7c3a',
    borderRadius: 9,
    top: 39,
    left: 10,
    opacity: 0.7,
  },
  continent3: {
    position: 'absolute',
    width: 14,        
    height: 10,       
    backgroundColor: '#56a63bff',
    borderRadius: 7,
    top: 6,
    right: 14,
    opacity: 0.6,
  },
  cloudLayer: {
    position: 'absolute',
    width: 64,        
    height: 64,       
    borderRadius: 32,
    overflow: 'hidden',
  },
  cloud1: {
    position: 'absolute',
    width: 22,        // Scaled up
    height: 8,        
    backgroundColor: '#ffffff',
    borderRadius: 4,
    top: 24,
    left: 14,
    opacity: 0.4,
  },
  cloud2: {
    position: 'absolute',
    width: 14,        
    height: 5,        
    backgroundColor: '#ffffff',
    borderRadius: 3,
    top: 36,
    right: 18,
    opacity: 0.3,
  },
  earthHighlight: {
    position: 'absolute',
    width: 64,        
    height: 64,       
    borderRadius: 32,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#00FFFF',
    opacity: 0.5,     // More subtle
  },
  terminator: {
    position: 'absolute',
    width: 42,        // Half of Earth width
    height: 64,       
    backgroundColor: '#000000',
    opacity: 0.4,     // More subtle
    right: 0,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
  },
});