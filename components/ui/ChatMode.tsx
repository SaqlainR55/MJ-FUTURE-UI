// components/ui/ChatMode.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

const ChatMode = () => {
  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MJ Assistant</Text>
        <Text style={styles.status}>Online</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.messagesContainer}>
        <View style={styles.messageBot}>
          <Text style={styles.messageText}>Hello! I'm MJ, your AI assistant. How can I help you today?</Text>
        </View>
        
        <View style={styles.messageUser}>
          <Text style={styles.messageText}>Hi MJ, what's the weather like?</Text>
        </View>
        
        <View style={styles.messageBot}>
          <Text style={styles.messageText}>Based on current data, it's 72°F and partly cloudy in your location.</Text>
        </View>
      </ScrollView>

      {/* Chat Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#4A90E2"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1426' },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#00FFFF',
    alignItems: 'center',
  },
  headerTitle: { color: '#00FFFF', fontSize: 24, fontWeight: 'bold' },
  status: { color: '#4A90E2', fontSize: 14, marginTop: 4 },
  messagesContainer: { flex: 1, padding: 20 },
  messageBot: {
    backgroundColor: '#1A2332',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FFFF',
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageUser: {
    backgroundColor: '#00FFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: { color: '#FFFFFF', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#00FFFF',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A2332',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00FFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginLeft: 10,
  },
  sendButtonText: { color: '#0B1426', fontWeight: 'bold', fontSize: 16 },
});

export default ChatMode;
