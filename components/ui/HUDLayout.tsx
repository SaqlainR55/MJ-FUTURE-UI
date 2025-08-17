// components/ui/HUDLayout.tsx
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import CoreRing from './CoreRing';
import HUDPanel from './HUDPanel';
import VoiceControls from './VoiceControls';
import ChatMode from './ChatMode';

const { width } = Dimensions.get('window');

const cyan = '#A7C5FF';
const cyanDim = 'rgba(167,197,255,0.20)';
const bg = '#0A0E17';
const red = '#FF6B82';

const P = 16;
const COL_GAP = 18;
const CARD_MIN_H = 124;
const BOTTOM_RESERVED = 96;
const INNER_V_PAD = 4;

type Mode = 'voice' | 'chat';

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

const BOOT_AT = Date.now();
const formatRunTime = (ms: number) => {
  const totalMs = Math.max(0, ms);
  const totalSec = Math.floor(totalMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((totalMs % 1000) / 10);
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(cs)}`;
};

const Frame = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <HUDPanel style={[{ minHeight: CARD_MIN_H }, style]}>{children}</HUDPanel>
);

// ---------- Cards (unchanged) ----------
function SystemLoadCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => (t + 1) % 1000), 1000); return () => clearInterval(id); }, []);
  const bars = 40;
  return (
    <Frame>
      <ThemedText type="hudLabel">System Load</ThemedText>
      <View style={styles.rowSpace}><ThemedText type="hudDigits" style={{ textAlign: 'left' }}>81%</ThemedText></View>
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
          <ThemedText style={[styles.change, { color: h.changePct >= 0 ? cyan : red }]}>
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
function DigitalWatchCard() {
  const [now, setNow] = useState(Date.now());
  const [cardW, setCardW] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => { const loop = () => { setNow(Date.now()); raf.current = requestAnimationFrame(loop); }; raf.current = requestAnimationFrame(loop); return () => { if (raf.current) cancelAnimationFrame(raf.current); }; }, []);
  const elapsed = now - BOOT_AT;
  const text = formatRunTime(elapsed);
  const CHAR_FACTOR = 0.62, H_PADDING = 12, minFS = 22, maxFS = 40;
  const fitFS = cardW > 0 ? Math.max(minFS, Math.min(maxFS, Math.floor((cardW - H_PADDING * 2) / (CHAR_FACTOR * text.length)))) : 28;
  return (
    <Frame>
      <ThemedText type="hudLabel">RUN TIME</ThemedText>
      <View onLayout={(e) => setCardW(e.nativeEvent.layout.width)} style={{ flexGrow: 1, justifyContent: 'center' }}>
        <ThemedText type="hudDigits" style={{ fontSize: fitFS, alignSelf: 'flex-end' }}>{text}</ThemedText>
      </View>
    </Frame>
  );
}

export default function HUDLayout() {
  const [centerH, setCenterH] = useState(0);
  const [mode, setMode] = useState<Mode>('voice'); // target state
  const ringSize = Math.max(220, Math.min(width * 0.92, centerH * 0.98));
  const ringScale = ringSize / 420;

  // progress: 0 (Voice) → 1 (Chat)
  const progress = useRef(new Animated.Value(0)).current;

  // snap to target when mode changes programmatically
  useEffect(() => {
    Animated.spring(progress, {
      toValue: mode === 'chat' ? 1 : 0,
      // tuned for buttery motion
      velocity: 0.8,
      tension: 200,
      friction: 28,
      useNativeDriver: true,
    }).start();
  }, [mode]);

  // animated styles
  const hudStyle = {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.64] }),
    transform: [
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] }) },
      { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }, // tiny parallax
    ],
  };
  const chatStyle = {
    transform: [
      { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [width, 0] }) },
    ],
  } as const;

  // --- Interactive drag ---
  const EDGE_W = 64;       // easier edge grab
  const ACTIVATE_PX = 10;  // start responding after this horizontal movement
  const SNAP_PX = Math.max(80, width * 0.22); // how far before snapping open/close
  const ORIENT_RATIO = 1.2; // horizontal must beat vertical by this factor

  // helpers
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  // open (right edge) – follows finger
  const openPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,                 // owns immediately inside the edge
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > ACTIVATE_PX && Math.abs(g.dx) > Math.abs(g.dy) * ORIENT_RATIO,
      onPanResponderMove: (_e, g) => {
        // dragging left => dx negative
        const p = clamp01(-g.dx / width);
        progress.setValue(p);
      },
      onPanResponderRelease: (_e, g) => {
        const shouldOpen = (-g.dx > SNAP_PX) || (g.vx < -0.5);
        if (shouldOpen) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          Animated.spring(progress, { toValue: 1, tension: 210, friction: 26, useNativeDriver: true }).start(() => setMode('chat'));
        } else {
          Animated.timing(progress, { toValue: 0, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // close (anywhere on chat) – follows finger
  const closePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > ACTIVATE_PX && Math.abs(g.dx) > Math.abs(g.dy) * ORIENT_RATIO,
      onPanResponderMove: (_e, g) => {
        // dragging right => dx positive; convert to progress
        const p = clamp01(1 - g.dx / width);
        progress.setValue(p);
      },
      onPanResponderRelease: (_e, g) => {
        const shouldClose = (g.dx > SNAP_PX) || (g.vx > 0.5);
        if (shouldClose) {
          Haptics.selectionAsync().catch(() => {});
          Animated.spring(progress, { toValue: 0, tension: 210, friction: 26, useNativeDriver: true }).start(() => setMode('voice'));
        } else {
          Animated.timing(progress, { toValue: 1, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* HUD (dims/scales while chat peeks in) */}
      <Animated.View style={[styles.content, hudStyle]} pointerEvents={mode === 'chat' ? 'none' : 'auto'}>
        <View style={styles.row}>
          <View style={[styles.col, { marginRight: COL_GAP }]}><SystemLoadCard /></View>
          <View style={styles.col}><NewsCard /></View>
        </View>

        <View style={styles.centerArea} onLayout={e => setCenterH(e.nativeEvent.layout.height)}>
          <View style={{ transform: [{ scale: ringScale }] }}><CoreRing /></View>
        </View>

        <View style={styles.row}>
          <View style={[styles.col, { marginRight: COL_GAP }]}><StockInvestmentCard /></View>
          <View style={styles.col}><DigitalWatchCard /></View>
        </View>

        <View style={{ height: mode === 'voice' ? BOTTOM_RESERVED : 0 }} />
      </Animated.View>

      {/* Voice bar (only fully active when closed) */}
      {mode === 'voice' && <VoiceControls />}

      {/* Chat overlay is always mounted for interactive slide */}
      <Animated.View style={[styles.chatOverlay, chatStyle]} pointerEvents="auto" {...closePan.panHandlers}>
        <ChatMode />
      </Animated.View>

      {/* Wide right-edge opener (easier to grab) */}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
        <View style={styles.edgeRight} {...openPan.panHandlers} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: bg },
  content: { flex: 1, paddingHorizontal: P, paddingTop: 8 },

  chatOverlay: {
    position: 'absolute',
    zIndex: 90,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: bg,
    elevation: 8,
  },

  // bigger, easier opener area
  edgeRight: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0,
    width: 64,        // was 28 → easier swipe
    zIndex: 20,
  },

  row: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 14 },
  col: { flex: 1 },

  meta: { color: '#AEB8D9' },
  bullet: { color: '#D6E2FF', fontSize: 12, marginTop: 4, opacity: 0.85 },

  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  waveRow: { marginTop: 10, height: 16, flexDirection: 'row', alignItems: 'flex-end' },
  waveDot: { width: 3, height: 8, backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },

  sparkWrap: { height: 34, marginTop: 6, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' },
  sparkBar: { flex: 1, alignSelf: 'flex-end', backgroundColor: cyanDim, borderRadius: 2, marginRight: 2 },

  rowDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#151C27',
    paddingTop: 8,
  },
  tinyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  sym: { color: '#E6EEFF', fontWeight: '700', width: 54 },
  qty: { color: '#AEB8D9', width: 38, textAlign: 'right' },
  change: { marginLeft: 8, width: 72, textAlign: 'right', fontWeight: '700' },

  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 0 },
});
