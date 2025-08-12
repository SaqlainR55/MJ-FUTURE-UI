// components/ui/HUDLayout.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from 'react-native';
import CoreRing from './CoreRing';
import VoiceControls from './VoiceControls';

const { width } = Dimensions.get('window');

const cyan = '#4FF3E1';
const cyanDim = 'rgba(79,243,225,0.2)';
const bg = '#0e1318';
const panel = '#0f1720';
const red = '#ef4444';

const P = 16;                // page padding
const COL_GAP = 18;          // horizontal space between two cards
const CARD_MIN_H = 118;      // tighter cards
const BOTTOM_RESERVED = 96;  // room for VoiceControls/tab bar

// ---------- helpers ----------
function pad(n: number, len = 2) { return String(n).padStart(len, '0'); }
function formatWatch(now: number) {
  const d = new Date(now);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`; // HH:MM only
}
const spark = (n = 16) =>
  Array.from({ length: n }, (_, i) => {
    const base = Math.sin(i / 2.7) * 0.5 + 0.5;
    const noise = (Math.random() - 0.5) * 0.25;
    return Math.max(0.05, Math.min(1, base + noise));
  });

const defaultHoldings = [
  { symbol: 'AAPL', qty: 12, price: 228.31, changePct: +0.84 },
  { symbol: 'TSLA', qty: 5,  price: 242.09, changePct: +2.46 },
];

// ---------- frame ----------
const Frame = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardBorder} />
    {children}
  </View>
);

// ---------- cards ----------
function SystemLoadCard() {
  return (
    <Frame>
      <Text style={styles.cardTitle}>System Load</Text>
      <Text style={styles.bigNumber}>81%</Text>
      <View style={styles.waveRow}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.waveDot} />
        ))}
      </View>
    </Frame>
  );
}
function NewsCard() {
  return (
    <Frame>
      <Text style={styles.cardTitle}>NEWS</Text>
      <Text style={styles.bullet}>• AI assistant launched at scale</Text>
      <Text style={styles.bullet}>• Crypto market stabilizing</Text>
      <Text style={styles.timerSm}>00:00:57:478.34</Text>
    </Frame>
  );
}
function StockInvestmentCard() {
  const holdings = defaultHoldings;
  const line = useMemo(() => spark(), []);
  const total = holdings.reduce((s, h) => s + h.qty * h.price, 0);
  const day = holdings.reduce((s, h) => s + (h.qty * h.price * h.changePct) / 100, 0);

  return (
    <Frame>
      <Text style={styles.cardTitle}>Investments</Text>
      <View style={styles.sparkWrap}>
        {line.map((v, i) => (
          <View key={i} style={[styles.sparkBar, { height: Math.max(6, 36 * v) }]} />
        ))}
      </View>

      {holdings.map((h) => (
        <View key={h.symbol} style={styles.tinyRow}>
          <Text style={styles.sym}>{h.symbol}</Text>
          <Text style={styles.qty}>x{h.qty}</Text>
          <Text style={[styles.change, { color: h.changePct >= 0 ? cyan : red }]}>
            {h.changePct >= 0 ? '+' : ''}{h.changePct.toFixed(2)}%
          </Text>
        </View>
      ))}

      <View style={styles.rowDivider}>
        <Text style={[styles.meta, { flex: 1 }]}>Total</Text>
        <Text style={[styles.meta, { fontWeight: '700', color: cyan }]}>${total.toFixed(2)}</Text>
      </View>
      <View style={styles.tinyRow}>
        <Text style={[styles.meta, { flex: 1 }]}>Day P/L</Text>
        <Text style={[styles.meta, { fontWeight: '700', color: day >= 0 ? cyan : red }]}>
          {day >= 0 ? '+' : ''}${day.toFixed(2)}
        </Text>
      </View>
    </Frame>
  );
}
function DigitalWatchCard() {
  const [tick, setTick] = useState(Date.now());
  const raf = useRef<number | null>(null);
  useEffect(() => {
    let live = true;
    const loop = () => { if (!live) return; setTick(Date.now()); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => { live = false; if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);
  return (
    <Frame>
      <Text style={styles.cardTitle}>WATCH</Text>
      <Text style={styles.bigDigits} numberOfLines={1}>{formatWatch(tick)}</Text>
    </Frame>
  );
}

// ---------- main ----------
export default function HUDLayout() {
  const [centerH, setCenterH] = useState(0);

  // ring size = fit width nicely, but also fill the center vertical area
  const ringSize = Math.max(200, Math.min(width * 0.90, centerH * 0.98));
  const ringScale = ringSize / 420; // CoreRing baseline scale

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Top row */}
        <View style={styles.row}>
          <View style={[styles.col, { marginRight: COL_GAP }]}>
            <SystemLoadCard />
          </View>
          <View style={styles.col}>
            <NewsCard />
          </View>
        </View>

        {/* Center: ring auto-centered & bigger */}
        <View
          style={styles.centerArea}
          onLayout={e => setCenterH(e.nativeEvent.layout.height)}
        >
          <View style={{ transform: [{ scale: ringScale }] }}>
            <CoreRing />
          </View>
        </View>

        {/* Bottom row (snug under ring) */}
        <View style={styles.row}>
          <View style={[styles.col, { marginRight: COL_GAP }]}>
            <StockInvestmentCard />
          </View>
          <View style={styles.col}>
            <DigitalWatchCard />
          </View>
        </View>

        {/* Small spacer so cards clear VoiceControls */}
        <View style={{ height: BOTTOM_RESERVED }} />
      </View>

      <VoiceControls />
    </SafeAreaView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: bg },
  content: { flex: 1, paddingHorizontal: P, paddingTop: 6 },

  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12, // tighter vertical spacing
  },
  col: { flex: 1 },

  card: {
    minHeight: CARD_MIN_H,
    backgroundColor: panel,
    borderRadius: 16,
    padding: 12,
    shadowColor: cyan,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(79,243,225,0.25)',
  },
  cardTitle: { color: '#7bded4', fontSize: 12, letterSpacing: 1, marginBottom: 6 },

  bigNumber: { color: cyan, fontSize: 22, fontWeight: '800' },
  waveRow: { marginTop: 8, height: 16, flexDirection: 'row', alignItems: 'flex-end' },
  waveDot: { width: 3, height: 8, backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },

  bullet: { color: '#bfeeee', fontSize: 12, marginTop: 4, opacity: 0.85 },
  timerSm: { color: cyan, fontSize: 12, marginTop: 8, alignSelf: 'flex-end' },

  sparkWrap: { height: 34, marginTop: 6, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' },
  sparkBar: { flex: 1, alignSelf: 'flex-end', backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },
  rowDivider: { flexDirection: 'row', alignItems: 'center', marginTop: 6, borderTopWidth: 1, borderTopColor: '#1b2733', paddingTop: 6 },
  tinyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

  sym: { color: '#c8f7f1', fontWeight: '700', width: 54 },
  qty: { color: '#9fdad3', width: 38, textAlign: 'right' },
  change: { marginLeft: 8, width: 72, textAlign: 'right', fontWeight: '700' },
  meta: { color: '#9fdad3' },

  bigDigits: { color: cyan, fontSize: 26, fontWeight: '900', letterSpacing: 1.2, marginTop: 4, alignSelf: 'flex-end' },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0, // remove extra air
  },
});
