import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

type Props = { onSend: (text: string) => void; disabled?: boolean };

export function InputBar({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  }

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        placeholder="Message Claude..."
        placeholderTextColor="#004400"
        multiline
        blurOnSubmit={false}
        editable={!disabled}
      />
      <Pressable style={styles.send} onPress={handleSend} disabled={disabled}>
        <Text style={styles.sendText}>↑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#004400',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: 14,
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#004400',
    borderRadius: 4,
  },
  send: {
    marginLeft: 8,
    width: 36,
    height: 36,
    backgroundColor: '#004400',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#00ff00', fontSize: 18, fontWeight: 'bold' },
});
