import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import HUDPanel from './HUDPanel';

export default function LeftPanel() {
  return (
    <HUDPanel style={styles.panel}>
      {/* System Status */}
      <Text style={styles.title}>System Load</Text>
      <Text style={styles.metric}>69%</Text>

      {/* Graph */}
      <Svg height="80" width="140" style={{ marginTop: 16 }}>
        <Polyline
          points="0,40 20,30 40,35 60,20 80,30 100,10 120,25 140,15"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
        />
      </Svg>

      {/* Mini Stats */}
      <View style={styles.statBlock}>
        <Text style={styles.label}>STOKS</Text>
        <Text style={styles.value}>18% | 29% | 52%</Text>
      </View>
      <View style={styles.statBlock}>
        <Text style={styles.label}>DATA</Text>
        <Text style={styles.value}>128.0 | 256.3 | 712.5</Text>
      </View>
    </HUDPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 12,
    top: 80,
    width: 160,
    padding: 12,
    backgroundColor: 'rgba(0,255,255,0.05)',
    borderColor: '#00ffff44',
    borderWidth: 1,
    borderRadius: 8,
  },
  title: {
    color: '#ccc',
    fontSize: 14,
  },
  metric: {
    color: '#00ffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  statBlock: {
    marginTop: 16,
  },
  label: {
    color: '#888',
    fontSize: 12,
  },
  value: {
    color: '#0ff',
    fontSize: 14,
    fontWeight: '500',
  },
});