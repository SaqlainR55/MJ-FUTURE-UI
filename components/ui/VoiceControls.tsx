// components/ui/VoiceControls.tsx
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VoiceControls() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonRed}>
        <Text style={styles.icon}>🔇</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.icon}>❌</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70, // ✅ just above tab bar
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ff2',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0ff',
    borderWidth: 1,
  },
  buttonRed: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f003',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f00',
    borderWidth: 1,
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
});