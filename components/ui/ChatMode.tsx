// components/ui/ChatMode.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

const NAV_BAR_HEIGHT = 90; // Approx. bottom tab height
const EXTRA_PADDING = 40;  // Extra breathing space above nav

const ChatMode = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 84, android: 0 })}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MJ Assistant</Text>
          <Text style={styles.status}>Online</Text>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: NAV_BAR_HEIGHT + EXTRA_PADDING,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.messageBot}>
            <Text style={styles.messageText}>
              Hello! I'm MJ, your AI assistant. How can I help you today?
            </Text>
          </View>

          <View style={styles.messageUser}>
            <Text style={styles.messageText}>Hi MJ, what's the weather like?</Text>
          </View>

          <View style={styles.messageBot}>
            <Text style={styles.messageText}>
              Based on current data, it's 72°F and partly cloudy in your location.
            </Text>
          </View>
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#4A90E2"
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B1426' },
  container: { flex: 1, backgroundColor: '#0B1426' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00FFFF',
    alignItems: 'center',
  },
  headerTitle: { color: '#00FFFF', fontSize: 26, fontWeight: '800' },
  status: { color: '#4A90E2', fontSize: 14, marginTop: 2 },

  messagesScroll: { flex: 1 },

  messageBot: {
    backgroundColor: '#1A2332',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FFFF',
    marginBottom: 10,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  messageUser: {
    backgroundColor: '#00FFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  messageText: { color: '#FFFFFF', fontSize: 16 },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#00FFFF',
    alignItems: 'center',
    backgroundColor: '#0B1426',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A2332',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00FFFF',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginLeft: 10,
  },
  sendButtonText: { color: '#0B1426', fontWeight: 'bold', fontSize: 16 },
});

export default ChatMode;
