// components/ui/CoreRing.tsx
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import InfinityLoop from './InfinityLoop';

const NAV_BAR_HEIGHT = 80;

export default function CoreRing() {
  const { width, height } = useWindowDimensions();
  const SIZE = Math.min(width, height) * 0.7;

  return (
    <View style={styles.wrapper}>
      <InfinityLoop size={SIZE} />

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: NAV_BAR_HEIGHT / 0,
  },
  timer: {
    position: 'absolute',
    bottom: 40,
    color: '#00FFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
