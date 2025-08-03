import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VoiceStatus() {
  return (
    <View style={styles.container}>
      <FontAwesome name="microphone" size={42} color="#00ffff" style={styles.icon} />
      <Text style={styles.label}>Listening...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  icon: {
    opacity: 0.9,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    color: '#00ffff',
    fontWeight: '600',
  },
});