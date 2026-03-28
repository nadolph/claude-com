import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { connected: boolean };

export function ConnectionBanner({ connected }: Props) {
  if (connected) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠ Connecting to bridge...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#440000', padding: 6, alignItems: 'center' },
  text: { color: '#ff4444', fontFamily: 'monospace', fontSize: 12 },
});
