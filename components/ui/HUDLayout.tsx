import React from 'react';
import { StyleSheet, View } from 'react-native';
import CoreRing from './CoreRing';
import NewsPanel from './NewsPanel';
import StocksTicker from './StocksTicker';
import SystemLoadPanel from './SystemLoadPanel';
import VoiceControls from './VoiceControls';

export default function HUDLayout() {
  return (
    <View style={styles.wrapper}>
      {/* Side panels */}
      <View style={styles.row}>
        {/* Left Column */}
        <View style={styles.column}>
          <StocksTicker /> {/* ✅ move this above */}
          <SystemLoadPanel />
        </View>

        {/* Right Column */}
        <NewsPanel />
      </View>

      {/* Main content */}
      <CoreRing />

      {/* Floating voice controls */}
      <VoiceControls />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#020510',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 60,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});