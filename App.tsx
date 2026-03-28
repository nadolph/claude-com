import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { TerminalView } from './components/TerminalView';
import { InputBar } from './components/InputBar';
import { ButtonRow } from './components/ButtonRow';
import { ConnectionBanner } from './components/ConnectionBanner';
import { createBridgeClient } from './lib/bridge';

export default function App() {
  const [content, setContent] = useState('');
  const [connected, setConnected] = useState(false);
  const bridgeRef = useRef<ReturnType<typeof createBridgeClient> | null>(null);

  useEffect(() => {
    const client = createBridgeClient({
      onContent: setContent,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });
    bridgeRef.current = client;
    return () => client.stop();
  }, []);

  function handleInput(text: string) {
    bridgeRef.current?.send({ type: 'input', text });
  }

  function handleKey(key: string) {
    if (key === 'restart') {
      bridgeRef.current?.send({ type: 'restart' });
    } else {
      bridgeRef.current?.send({ type: 'key', key });
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ConnectionBanner connected={connected} />
      <View style={styles.terminal}>
        <TerminalView content={content} />
      </View>
      <ButtonRow onKey={handleKey} disabled={!connected} />
      <InputBar onSend={handleInput} disabled={!connected} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  terminal: { flex: 1 },
});
