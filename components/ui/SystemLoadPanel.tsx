import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import HUDPanel from './HUDPanel';

export default function SystemLoadPanel() {
  // Dummy battery % values (0–1 range)
  const batteryHistory = [0.88, 0.86, 0.89, 0.84, 0.87, 0.83, 0.85, 0.82, 0.84, 0.81];

  // Convert to SVG polyline points
  const graphPoints = batteryHistory.map((level, i) => {
    const x = i * 14; // spacing between points
    const y = 80 - level * 70; // invert Y, map 0–1 to 0–70
    return `${x},${y}`;
  }).join(' ');

  // Get latest % for display
  const currentPercent = Math.round((batteryHistory.at(-1) ?? 0) * 100);

  return (
    <HUDPanel style={styles.panel}>
      <Text style={styles.title}>System Load</Text>
      <Text style={styles.metric}>{currentPercent}%</Text>

      {/* Graph */}
      <Svg height="80" width="140" style={{ marginTop: 16 }}>
        <Polyline
          points={graphPoints}
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
        />
      </Svg>
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
});