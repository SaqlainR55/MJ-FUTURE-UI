import React from 'react';
import { StyleSheet, Text } from 'react-native';
import HUDPanel from './HUDPanel';

export default function NewsPanel() {
  return (
    <HUDPanel style={styles.panel}>
      <Text style={styles.title}>NEWS</Text>
      <Text style={styles.newsItem}>• AI assistant launched at scale</Text>
      <Text style={styles.newsItem}>• Crypto market stabilizing</Text>

      <Text style={styles.footerTimer}>00:00:57:478.34</Text>
    </HUDPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    right: 12,
    top: 80,
    width: 180,
    padding: 12,
    backgroundColor: 'rgba(0,255,255,0.05)',
    borderColor: '#00ffff44',
    borderWidth: 1,
    borderRadius: 8,
  },
  title: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  newsItem: {
    color: '#00ffff',
    fontSize: 12,
    marginBottom: 4,
  },
  globePlaceholder: {
    marginVertical: 16,
    alignItems: 'center',
  },
  globeText: {
    fontSize: 32,
    color: '#00ffff',
  },
  footerTimer: {
    textAlign: 'center',
    color: '#00ffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});