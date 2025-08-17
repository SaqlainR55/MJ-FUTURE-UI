// components/ui/ChatMode.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  ListRenderItemInfo,
  Animated,
  Easing,
  Keyboard,
  Pressable,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ===== MJ HUD Palette (matches audio mode) =====
const BG = '#0A0E17';
const ACCENT = '#A7C5FF';
const ACCENT_DIM = 'rgba(167,197,255,0.20)';
const PANEL = '#111824';
const BORDER_DARK = '#151C27';
const TXT = '#E6EEFF';
const TXT_SUB = '#AEB8D9';

type Role = 'user' | 'bot';
type Msg = { id: string; role: Role; text: string; ts: number };
type AttachmentKind = 'image' | 'file' | 'audio';
type Attachment = { id: string; kind: AttachmentKind; name: string; uri?: string; durationMs?: number };

const NOW = Date.now();
const initialMessages: Msg[] = [
  { id: 'm3', role: 'bot',  text: "Based on current data, it's 72°F and partly cloudy in your location.", ts: NOW - 1000 * 20 },
  { id: 'm2', role: 'user', text: "Hi MJ, what's the weather like?", ts: NOW - 1000 * 30 },
  { id: 'm1', role: 'bot',  text: "Hello! I'm MJ, your AI assistant. How can I help you today?", ts: NOW - 1000 * 60 },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- UI bits ----------
const OnlineDot = () => <View style={styles.dot} />;

const Bubble = React.memo(function Bubble({ role, text }: { role: Role; text: string }) {
  const isUser = role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
      {!isUser && (
        <View style={styles.avatarWrap}>
          <View style={styles.avatarGlow} />
          <View style={styles.avatarCore} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={isUser ? styles.textOnAccent : styles.textDefault}>{text}</Text>
      </View>
    </View>
  );
});

function TypingDots() {
  const a = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(a, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [a]);
  const dot = (i: number) => ({
    opacity: a.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1, 0.2] }),
    transform: [{ translateY: a.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -2 - i, 0] }) }],
    marginLeft: i ? 6 : 0,
  });
  return (
    <View style={styles.typingWrap}>
      <Animated.View style={[styles.typingDot, dot(0)]} />
      <Animated.View style={[styles.typingDot, dot(1)]} />
      <Animated.View style={[styles.typingDot, dot(2)]} />
    </View>
  );
}

// ---------- Main ----------
type Props = { bottomOffset?: number }; // extra padding above tab bar/home indicator

export default function ChatMode({ bottomOffset = 96 }: Props) {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState('');
  const [composerH, setComposerH] = useState(44);
  const [typing, setTyping] = useState(false);
  const [atts, setAtts] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);

  const listRef = useRef<FlatList<Msg>>(null);
  const data = useMemo(() => messages, [messages]);

  const scrollToBottom = useCallback((animated = true) => {
    listRef.current?.scrollToOffset({ offset: 0.1, animated }); // inverted → 0 is bottom
  }, []);

  // ---- Send ----
  const send = useCallback(() => {
    const text = input.trim();
    if (!text && atts.length === 0) return;

    const attLabel = atts.length
      ? `\n[Attachments: ${atts.map(a => `${a.kind}:${a.name}`).join(', ')}]`
      : '';

    const userMsg: Msg = { id: uid(), role: 'user', text: text + attLabel, ts: Date.now() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setAtts([]);
    setTyping(true);

    // TODO: replace with your backend call (streaming)
    setTimeout(() => {
      const botMsg: Msg = {
        id: uid(),
        role: 'bot',
        text: `Received ✅${text ? `\nText: “${text}”` : ''}${atts.length ? `\nFiles: ${atts.length}` : ''}`,
        ts: Date.now(),
      };
      setMessages(prev => [botMsg, ...prev]);
      setTyping(false);
      scrollToBottom();
    }, 420);
  }, [input, atts, scrollToBottom]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Msg>) => {
    return <Bubble role={item.role} text={item.text} />;
  }, []);
  const keyExtractor = useCallback((item: Msg) => item.id, []);

  const onComposerSize = useCallback((_w: number, h: number) => {
    const min = 44, max = 120;
    setComposerH(Math.max(min, Math.min(max, Math.round(h))));
  }, []);

  // ---- Attach (＋) ----
  const handlePlus = useCallback(() => {
    const doAction = async (idx: number) => {
      try {
        if (idx === 0) {
          const ImagePicker = await import('expo-image-picker');
          const cam = await ImagePicker.requestCameraPermissionsAsync();
          if (!cam.granted) { Alert.alert('Camera permission needed'); return; }
          const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
          if (!res.canceled) setAtts(p => [{ id: uid(), kind: 'image', name: 'photo.jpg', uri: res.assets[0].uri }, ...p]);
        } else if (idx === 1) {
          const ImagePicker = await import('expo-image-picker');
          const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!lib.granted) { Alert.alert('Photos permission needed'); return; }
          const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsMultipleSelection: false });
          if (!res.canceled) {
            setAtts(p => [{
              id: uid(), kind: 'image', name: res.assets[0].fileName ?? 'image.jpg', uri: res.assets[0].uri,
            }, ...p]);
          }
        } else if (idx === 2) {
          const DocPicker = await import('expo-document-picker');
          const result = await DocPicker.getDocumentAsync({ multiple: false });

          const wasCanceled =
            ('canceled' in result && result.canceled === true) ||
            ('type' in result && (result as any).type === 'cancel');

          if (wasCanceled) return;

          let name: string | undefined;
          let uri: string | undefined;

          if ('assets' in result && result.assets?.[0]) {
            name = result.assets[0].name ?? 'file';
            uri = result.assets[0].uri;
          } else {
            const r = result as any;
            name = r.name ?? 'file';
            uri = r.uri;
          }

          if (uri) {
            setAtts(p => [{ id: uid(), kind: 'file', name: name ?? 'file', uri }, ...p]);
          }
        } else if (idx === 3) {
          const Clipboard = await import('expo-clipboard');
          const txt = await Clipboard.getStringAsync();
          if (!txt) { Alert.alert('Clipboard is empty'); return; }
          setInput(prev => (prev ? prev + ' ' + txt : txt));
        }
      } catch (e: any) {
        Alert.alert('Action error', String(e?.message ?? e));
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose Image', 'Choose File', 'Paste from Clipboard', 'Cancel'],
          cancelButtonIndex: 4,
          userInterfaceStyle: 'dark',
        },
        (buttonIndex) => { if (buttonIndex !== 4) doAction(buttonIndex); }
      );
    } else {
      Alert.alert('Attach', 'Choose what to add', [
        { text: 'Take Photo', onPress: () => doAction(0) },
        { text: 'Choose Image', onPress: () => doAction(1) },
        { text: 'Choose File', onPress: () => doAction(2) },
        { text: 'Paste from Clipboard', onPress: () => doAction(3) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }, []);

  // ---- Voice (🎙) ----
  const recordingRef = useRef<any>(null);
  const handleMic = useCallback(async () => {
    try {
      const { Audio } = await import('expo-av');
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) { Alert.alert('Microphone permission needed'); return; }

      if (!recordingRef.current) {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const rec = new Audio.Recording();
        recordingRef.current = rec;
        await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await rec.startAsync();
        setRecording(true);
      } else {
        const rec = recordingRef.current as any;
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        const dur = (await rec.getStatusAsync())?.durationMillis ?? undefined;
        setAtts(p => [{ id: uid(), kind: 'audio', name: 'voice.m4a', uri: uri ?? undefined, durationMs: dur }, ...p]);
        recordingRef.current = null;
        setRecording(false);
      }
    } catch (e: any) {
      Alert.alert('Voice note error', String(e?.message ?? e));
      recordingRef.current = null;
      setRecording(false);
    }
  }, []);

  // ---- Remove attachment chip ----
  const removeAtt = useCallback((id: string) => setAtts(prev => prev.filter(a => a.id !== id)), []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: bottomOffset + insets.bottom }]}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 84, android: 0 })}
      >
        <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>MJ Assistant</Text>
            <View style={styles.statusRow}>
              <OnlineDot />
              <Text style={styles.status}>Online</Text>
            </View>
            <View style={styles.headerRule} />
          </View>

          {/* Chat list */}
          <FlatList
            ref={listRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            inverted
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollToBottom(false)}
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={9}
            removeClippedSubviews
          />

          {/* Typing indicator */}
          {typing && (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                <TypingDots />
              </View>
            </View>
          )}
        </Pressable>

        {/* Attachments preview */}
        {atts.length > 0 && (
          <View style={styles.attsRow}>
            {atts.map(a => (
              <View key={a.id} style={styles.attChip}>
                <Text style={styles.attText}>
                  {a.kind.toUpperCase()}: {a.name.replace(/\s+/g, ' ').slice(0, 24)}
                  {a.durationMs ? ` (${Math.round(a.durationMs / 1000)}s)` : ''}
                </Text>
                <TouchableOpacity onPress={() => removeAtt(a.id)} style={styles.attX}>
                  <Text style={{ color: BG, fontWeight: '800' }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Composer */}
        <View style={styles.composerWrap}>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePlus}>
            <View style={styles.plusBarV} />
            <View style={styles.plusBarH} />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { height: composerH }]}
            placeholder="Message MJ…"
            placeholderTextColor={TXT_SUB}
            value={input}
            onChangeText={setInput}
            multiline
            onContentSizeChange={e =>
              onComposerSize(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)
            }
            returnKeyType="send"
            onSubmitEditing={send}
          />

          {/* 👇 removed the down-arrow export button */}

          <TouchableOpacity
            style={[styles.iconBtn, recording && { backgroundColor: ACCENT }]}
            onPress={handleMic}
          >
            <View style={[styles.micStem, recording && { backgroundColor: BG }]} />
            <View style={[styles.micBase, recording && { backgroundColor: BG }]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() && atts.length === 0) && styles.sendButtonDisabled]}
            onPress={send}
            disabled={!input.trim() && atts.length === 0}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 6 },
  headerTitle: { color: ACCENT, fontSize: 28, fontWeight: '800', letterSpacing: 0.2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT, marginRight: 6, opacity: 0.85 },
  status: { color: TXT_SUB, fontSize: 14 },
  headerRule: { height: 1, backgroundColor: ACCENT_DIM, marginTop: 10 },

  // List
  list: { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingBottom: 8 },
  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  avatarWrap: { width: 28, height: 28, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  avatarGlow: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: ACCENT, opacity: 0.15 },
  avatarCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT, opacity: 0.9 },
  bubble: { maxWidth: '84%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1 },
  bubbleBot: { backgroundColor: PANEL, borderColor: ACCENT_DIM },
  bubbleUser: { backgroundColor: ACCENT, borderColor: ACCENT },
  textDefault: { color: TXT, fontSize: 16, lineHeight: 22 },
  textOnAccent: { color: BG, fontSize: 16, lineHeight: 22, fontWeight: '700' },

  // Typing
  typingRow: { paddingHorizontal: 14, marginBottom: 8 },
  typingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: PANEL,
    borderColor: ACCENT_DIM,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  typingWrap: { flexDirection: 'row', alignItems: 'center' },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: TXT_SUB },

  // Attachments preview
  attsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6 as any,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  attChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PANEL,
    borderColor: ACCENT_DIM,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  attText: { color: TXT, fontSize: 12 },
  attX: {
    marginLeft: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
  },

  // Composer
composerWrap: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingHorizontal: 10,
  paddingTop: 10,           // more padding above
  paddingBottom: 16,        // more padding below
  borderTopWidth: 1,
  borderTopColor: BORDER_DARK,
  backgroundColor: BG,
},
  //textinput

textInput: {
  flex: 1,
  backgroundColor: PANEL,
  borderWidth: 1,
  borderColor: ACCENT_DIM,
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingTop: 12,           // more padding inside
  paddingBottom: 12,        // more padding inside
  color: TXT,
  fontSize: 16,
  textAlignVertical: 'top',
},

  // icon buttons
iconBtn: {
  width: 44, height: 44,    // bigger buttons
  borderRadius: 22,
  borderWidth: 1,
  borderColor: ACCENT_DIM,
  backgroundColor: PANEL,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 6,
},
  plusBarV: { position: 'absolute', width: 2, height: 14, backgroundColor: TXT },
  plusBarH: { position: 'absolute', width: 14, height: 2, backgroundColor: TXT },

  // mic glyph
  micStem: { width: 2, height: 12, backgroundColor: TXT, borderRadius: 1, marginBottom: 2 },
  micBase: { width: 12, height: 2, backgroundColor: TXT, borderRadius: 1 },

  // send
sendButton: {
  backgroundColor: ACCENT,
  borderRadius: 22,
  paddingHorizontal: 20,
  paddingVertical: 12,
  marginLeft: 6,
},
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: BG, fontWeight: '700', fontSize: 15 },
});
