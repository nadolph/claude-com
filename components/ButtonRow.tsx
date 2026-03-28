import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

const BUTTONS = [
  { label: 'Y', key: 'y-enter', bg: '#004400' },
  { label: 'Esc', key: 'escape', bg: '#004400' },
  { label: '⇥', key: 'shift-tab', bg: '#004400' },
  { label: '↺', key: 'restart', bg: '#440000' },
] as const;

type Props = { onKey: (key: string) => void; disabled?: boolean };

export function ButtonRow({ onKey, disabled }: Props) {
  return (
    <View style={styles.row}>
      {BUTTONS.map(btn => (
        <Pressable
          key={btn.key}
          style={[styles.btn, { backgroundColor: btn.bg }]}
          onPress={() => onKey(btn.key)}
          disabled={disabled}
        >
          <Text style={styles.label}>{btn.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, padding: 4, backgroundColor: '#111' },
  btn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 4 },
  label: { color: '#00ff00', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' },
});
