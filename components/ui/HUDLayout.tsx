// components/ui/HUDLayout.tsx
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import CoreRing from './CoreRing';
import HUDPanel from './HUDPanel';
import VoiceControls from './VoiceControls';

const { width } = Dimensions.get('window');

const cyan = '#4FF3E1';
const cyanDim = 'rgba(79,243,225,0.2)';
const bg = '#0e1318';
const red = '#ef4444';

const P = 16;                 // page padding
const COL_GAP = 18;           // gap between two cards
const CARD_MIN_H = 124;       // uniform card height
const BOTTOM_RESERVED = 96;   // room for VoiceControls/tab bar
const INNER_V_PAD = 4;        // unify inner spacing

// ---------- helpers ----------
const pad = (n: number, len = 2) => String(n).padStart(len, '0');

const spark = (n = 18, seed = 13) => {
  let x = seed;
  const rnd = () => { x = (1103515245 * x + 12345) % 2 ** 31; return x / 2 ** 31; };
  return Array.from({ length: n }, (_, i) => {
    const base = Math.sin(i / 2.1) * 0.5 + 0.5;
    const noise = (rnd() - 0.5) * 0.25;
    return Math.max(0.06, Math.min(1, base + noise));
  });
};

const defaultHoldings = [
  { symbol: 'AAPL', qty: 12, price: 228.31, changePct: +0.84 },
  { symbol: 'TSLA', qty: 5,  price: 242.09, changePct: +2.46 },
];

// timers
const BOOT_AT = Date.now(); // uptime anchor

const formatRunTime = (ms: number) => {
  const totalMs = Math.max(0, ms);
  const totalSec = Math.floor(totalMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((totalMs % 1000) / 10); // centiseconds
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(cs)}`;
};

// ---------- frame ----------
const Frame = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <HUDPanel style={[{ minHeight: CARD_MIN_H }, style]}>{children}</HUDPanel>
);

// ---------- cards ----------
function SystemLoadCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 1000), 1000);
    return () => clearInterval(id);
  }, []);
  const bars = 40;

  return (
    <Frame>
      <ThemedText type="hudLabel">System Load</ThemedText>
      <View style={styles.rowSpace}>
        <ThemedText type="hudDigits" style={{ textAlign: 'left' }}>81%</ThemedText>
      </View>
      <View style={styles.waveRow}>
        {Array.from({ length: bars }).map((_, i) => {
          const h = 6 + (i % 3) * 2 + (i % 5 === 0 ? 2 : 0);
          const breathe = ((tick + i) % 20) < 10 ? 0 : 2;
          return <View key={i} style={[styles.waveDot, { height: h + breathe }]} />;
        })}
      </View>
    </Frame>
  );
}

function NewsCard() {
  return (
    <Frame>
      <ThemedText type="hudLabel">NEWS</ThemedText>
      <View style={{ paddingTop: INNER_V_PAD }}>
        <ThemedText style={styles.bullet}>• AI assistant launched at scale</ThemedText>
        <ThemedText style={styles.bullet}>• Crypto market stabilizing</ThemedText>
      </View>
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
      <ThemedText type="hudLabel">Investments</ThemedText>

      <View style={styles.sparkWrap}>
        {line.map((v, i) => (
          <View key={i} style={[styles.sparkBar, { height: Math.max(6, 36 * v), opacity: 0.65 + v * 0.35 }]} />
        ))}
      </View>

      {holdings.map((h) => (
        <View key={h.symbol} style={styles.tinyRow}>
          <ThemedText style={styles.sym}>{h.symbol}</ThemedText>
          <ThemedText style={styles.qty}>x{h.qty}</ThemedText>
          <ThemedText
            style={[styles.change, { color: h.changePct >= 0 ? cyan : red }]}
          >
            {h.changePct >= 0 ? '+' : ''}{h.changePct.toFixed(2)}%
          </ThemedText>
        </View>
      ))}

      <View style={styles.rowDivider}>
        <ThemedText style={[styles.meta, { flex: 1 }]}>Total</ThemedText>
        <ThemedText style={[styles.meta, { fontWeight: '700', color: cyan }]}>${total.toFixed(2)}</ThemedText>
      </View>
      <View style={styles.tinyRow}>
        <ThemedText style={[styles.meta, { flex: 1 }]}>Day P/L</ThemedText>
        <ThemedText style={[styles.meta, { fontWeight: '700', color: day >= 0 ? cyan : red }]}>
          {day >= 0 ? '+' : ''}${day.toFixed(2)}
        </ThemedText>
      </View>
    </Frame>
  );
}

// WATCH -> RUN TIME (auto-fit, monospaced, right-aligned, no ellipsis)
function DigitalWatchCard() {
  const [now, setNow] = useState(Date.now());
  const [cardW, setCardW] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => { setNow(Date.now()); raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  const elapsed = now - BOOT_AT;
  const text = formatRunTime(elapsed); // "HH:MM:SS:CC"

  // Auto-fit font size to available width (tabular numerals ≈ 0.62em per char)
  const CHAR_FACTOR = 0.62;
  const H_PADDING = 12;
  const minFS = 22, maxFS = 40;
  const fitFS =
    cardW > 0
      ? Math.max(minFS, Math.min(maxFS, Math.floor((cardW - H_PADDING * 2) / (CHAR_FACTOR * text.length))))
      : 28;

  return (
    <Frame>
      <ThemedText type="hudLabel">RUN TIME</ThemedText>

      <View onLayout={(e) => setCardW(e.nativeEvent.layout.width)} style={{ flexGrow: 1, justifyContent: 'center' }}>
        <ThemedText type="hudDigits" style={{ fontSize: fitFS, alignSelf: 'flex-end' }}>
          {text}
        </ThemedText>
      </View>
    </Frame>
  );
}

// ---------- main ----------
export default function HUDLayout() {
  const [centerH, setCenterH] = useState(0);

  // ring size = fit width nicely, but also fill the center vertical area
  const ringSize = Math.max(220, Math.min(width * 0.92, centerH * 0.98));
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

        {/* Center ring */}
        <View
          style={styles.centerArea}
          onLayout={e => setCenterH(e.nativeEvent.layout.height)}
        >
          <View style={{ transform: [{ scale: ringScale }] }}>
            <CoreRing />
          </View>
        </View>

        {/* Bottom row */}
        <View style={styles.row}>
          <View style={[styles.col, { marginRight: COL_GAP }]}>
            <StockInvestmentCard />
          </View>
          <View style={styles.col}>
            <DigitalWatchCard />
          </View>
        </View>

        {/* Spacer for controls */}
        <View style={{ height: BOTTOM_RESERVED }} />
      </View>

      <VoiceControls />
    </SafeAreaView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: bg },
  content: { flex: 1, paddingHorizontal: P, paddingTop: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 14,
  },
  col: { flex: 1 },

  // titles & small text
  meta: { color: '#9fdad3' },
  bullet: { color: '#bfeeee', fontSize: 12, marginTop: 4, opacity: 0.85 },

  // layout bits
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // system load line
  waveRow: { marginTop: 10, height: 16, flexDirection: 'row', alignItems: 'flex-end' },
  waveDot: { width: 3, height: 8, backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },

  // investments
  sparkWrap: { height: 34, marginTop: 6, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' },
  sparkBar: { flex: 1, alignSelf: 'flex-end', backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },
  rowDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1b2733',
    paddingTop: 8,
  },
  tinyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  sym: { color: '#c8f7f1', fontWeight: '700', width: 54 },
  qty: { color: '#9fdad3', width: 38, textAlign: 'right' },
  change: { marginLeft: 8, width: 72, textAlign: 'right', fontWeight: '700' },

  // center area for ring
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
});