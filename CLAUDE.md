# CLAUDE.md — claude-com

## What this is

A native Android app that connects to a tmux session running Claude Code on a remote server, displaying the terminal output and accepting input. Built with React Native + Expo.

## Two parts

1. **bridge/** — Node.js WebSocket server that runs on the server. Polls tmux, streams output to the app, relays input back to tmux.
2. **App (root)** — React Native/Expo app. Renders terminal via xterm.js in a WebView. Text input via native TextInput (Gboard voice works). Buttons for common actions.

## Stack

- **Framework**: React Native via Expo, TypeScript
- **Terminal renderer**: xterm.js 5.3.0 via CDN in a WebView
- **WebSocket**: native WebSocket API (app) + ws package (bridge)
- **Connectivity**: Tailscale (always-on, no connect/disconnect)
- **Build env**: Node 22, Java 17, Android SDK (same as echoterminal)
- **Node**: v22

## Config

Edit `lib/config.ts` with your server's Tailscale IP before building.

## Build APK

```bash
cd android && ANDROID_HOME=/home/node/Android/Sdk JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

## Bridge (runs on server)

```bash
cd bridge && npm install && node index.js
```

Environment variables:
- `TMUX_SESSION` — tmux session name (default: `claude`)
- `CLAUDE_CMD` — command to start Claude Code (default: `claude`)
- `BRIDGE_PORT` — WebSocket port (default: `8765`)
- `POLL_MS` — pane capture interval ms (default: `500`)

## Interaction style

- Be critical. Question assumptions before implementing.
- Ask follow-up questions one at a time, multiple-choice when possible.
- Don't over-engineer — prototype first.
