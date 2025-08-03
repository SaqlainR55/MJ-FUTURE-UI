import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CoreRing() {
  return (
    <View style={styles.container}>
      <Svg width={200} height={200}>
        <Circle
          cx="100"
          cy="100"
          r="90"
          stroke="#00ffff"
          strokeWidth={6}
          strokeDasharray="10 10"
          fill="none"
        />
      </Svg>
      <View style={styles.innerDot} />
      <Text style={styles.timerText}>00:00:42</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  innerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ffff',
  },
  timerText: {
    marginTop: 12,
    color: '#00ffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});