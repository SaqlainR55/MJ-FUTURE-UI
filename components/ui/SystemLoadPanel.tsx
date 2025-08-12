import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import HUDPanel from './HUDPanel';

const ACCENT = '#A7C5FF';

export default function SystemLoadPanel() {
  const batteryHistory = [0.88, 0.86, 0.89, 0.84, 0.87, 0.83, 0.85, 0.82, 0.84, 0.81];

  const graphPoints = batteryHistory.map((level, i) => {
    const x = i * 14;
    const y = 80 - level * 70;
    return `${x},${y}`;
  }).join(' ');

  const currentPercent = Math.round((batteryHistory.at(-1) ?? 0) * 100);

  return (
    <HUDPanel style={styles.panel}>
      <Text style={styles.title}>System Load</Text>
      <Text style={styles.metric}>{currentPercent}%</Text>

      <Svg height="80" width="140" style={{ marginTop: 16 }}>
        <Polyline points={graphPoints} fill="none" stroke={ACCENT} strokeWidth="2" />
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
    backgroundColor: 'rgba(167,197,255,0.06)',
    borderColor: 'rgba(167,197,255,0.28)',
    borderWidth: 1,
    borderRadius: 8,
  },
  title: { color: '#C9D4F7', fontSize: 14 },
  metric: {
    color: '#A7C5FF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
});