import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: object;
}

export default function HUDPanel({ children, style }: Props) {
  return (
    <View style={[styles.panel, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,255,255,0.06)',
    borderColor: '#00ffff66',
    borderWidth: 1,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});