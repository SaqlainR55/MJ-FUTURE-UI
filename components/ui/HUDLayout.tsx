// components/ui/HUDLayout.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MJAssistant from './MJAssistant';
import NewsPanel from './NewsPanel';
import StocksTicker from './StocksTicker';
import SystemLoadPanel from './SystemLoadPanel';

export default function HUDLayout() {
  return (
    <View style={styles.wrapper}>
      {/* Top row: left + right panels */}
      <View style={styles.row}>
        <View style={styles.columnLeft}>
          
          <SystemLoadPanel />
        </View>
        <View style={styles.columnRight}>
          <NewsPanel />
        </View>
      </View>

      {/* Center: swipe Audio (CoreRing) ↔ Chat (fills remaining space) */}
      <View style={styles.center}>
        <MJAssistant />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#020510',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 60,
  },
  columnLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  columnRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  // let MJAssistant take the rest of the screen height
  center: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
});
