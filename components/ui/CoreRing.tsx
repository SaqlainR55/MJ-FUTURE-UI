// components/ui/CoreRing.tsx

import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import InfinityLoop from './InfinityLoop';

export default function CoreRing() {
  const { width, height } = useWindowDimensions()
  const SIZE = Math.min(width, height) * 0.6

  return (
    <View style={styles.wrapper}>
      <InfinityLoop size={SIZE} />
      <Text style={styles.timer}>00:00:57:478.34</Text>
    </View>
  )
}

const NAV_BAR_HEIGHT = 80  // approximate height of your tab bar

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: NAV_BAR_HEIGHT /.52, // push everything up by half the nav bar
  },
  timer: {
    position: 'absolute',
    bottom: 40,
    color: '#00FFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
