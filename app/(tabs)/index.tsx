import CoreRing from '@/components/ui/CoreRing';
import LeftPanel from '@/components/ui/LeftPanel';
import RightPanel from '@/components/ui/RightPanel';
import StatsPanel from '@/components/ui/StatsPanel';
import VoiceStatus from '@/components/ui/VoiceStatus';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Left & Right Panels */}
      <View style={styles.row}>
        <LeftPanel />
        <RightPanel />
      </View>

      {/* Core Ring (center circle + timer) */}
      <View style={styles.coreRingWrapper}>
        <CoreRing />
      </View>

      {/* Stats Row: Stocks, Crypto, Weather */}
      <StatsPanel />

      {/* Mic + Voice Status */}
      <VoiceStatus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121E',
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  coreRingWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});