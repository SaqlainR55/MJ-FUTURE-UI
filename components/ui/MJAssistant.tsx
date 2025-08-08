// components/ui/MJAssistant.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useDerivedValue,
  clamp,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import CoreRing from './CoreRing';   // Audio view (your Earth/rings)
import ChatMode from './ChatMode';   // Chat view

const { width } = Dimensions.get('window');

export default function MJAssistant() {
  // x: 0 (Audio) → -width (Chat)
  const x = useSharedValue(0);
  const startX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = x.value;
    })
    .onChange((e) => {
      x.value = clamp(startX.value + e.translationX, -width, 0);
    })
    .onEnd((e) => {
      const halfway = -width / 2;
      let target = 0;

      if (e.velocityX <= -600) target = -width;     // fast left → Chat
      else if (e.velocityX >= 600) target = 0;      // fast right → Audio
      else target = x.value < halfway ? -width : 0; // nearest page

      x.value = withSpring(target, { damping: 14, stiffness: 160 });
    });

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  // progress for dots: 0 (audio) → 1 (chat)
  const progress = useDerivedValue(() => -x.value / width);

  const audioDotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0.35], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1.1, 0.9], Extrapolation.CLAMP) }],
  }));

  const chatDotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.35, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1.1], Extrapolation.CLAMP) }],
  }));

  return (
    <View style={styles.shell}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.slider, { width: width * 2 }, sliderStyle]}>
          {/* PAGE 1: AUDIO (CoreRing) */}
          <View style={[styles.page, { width }]}>
            <View style={styles.audioContainer}>
              <CoreRing />
            </View>
          </View>

          {/* PAGE 2: CHAT (fills full area) */}
          <View style={[styles.pageChat, { width }]}>
            <ChatMode />
          </View>
        </Animated.View>
      </GestureDetector>

      {/* page dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, audioDotStyle]} />
        <Animated.View style={[styles.dot, chatDotStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Take all available space from parent (HUD center)
  shell: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  slider: {
    height: '100%',
    flexDirection: 'row',
  },
  // AUDIO page centers CoreRing visually
  page: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // CHAT page stretches so the chat isn't clipped
  pageChat: {
    height: '100%',
    width: '100%',
    backgroundColor: '#0B1426', // match ChatMode background
  },
  dotsRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00E6E6',
  },
});
