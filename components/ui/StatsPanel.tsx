import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const stats = [
  { label: 'Stocks', value: '+1.83%' },
  { label: 'Crypto', value: '-0.45%' },
  { label: 'Weather', value: '29°C' },
];

export default function StatsPanel() {
  return (
    <View style={styles.container}>
      {stats.map((item) => (
        <View key={item.label} style={styles.statBlock}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  statBlock: {
    alignItems: 'center',
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  value: {
    color: '#00ffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
});