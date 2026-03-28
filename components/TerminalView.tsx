import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const XTERM_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css"/>
  <script src="https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    #t { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="t"></div>
  <script>
    var term = new Terminal({
      disableStdin: true,
      cursorBlink: false,
      theme: { background: '#000000', foreground: '#00ff00' },
      fontSize: 11,
      fontFamily: 'monospace',
    });
    var fit = new FitAddon.FitAddon();
    term.loadAddon(fit);
    term.open(document.getElementById('t'));
    fit.fit();

    window.writeToTerminal = function(content) {
      term.write('\\x1b[2J\\x1b[H');
      term.write(content);
    };

    window.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'pane') writeToTerminal(msg.content);
      } catch(err) {}
    });

    window.addEventListener('resize', function() { fit.fit(); });
  </script>
</body>
</html>`;

type Props = { content: string };

export function TerminalView({ content }: Props) {
  const webviewRef = useRef<WebView>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !content) return;
    webviewRef.current?.injectJavaScript(`
      window.writeToTerminal(${JSON.stringify(content)});
      true;
    `);
  }, [content, loaded]);

  return (
    <WebView
      testID="webview"
      ref={webviewRef}
      source={{ html: XTERM_HTML }}
      style={styles.terminal}
      javaScriptEnabled
      originWhitelist={['*']}
      mixedContentMode="always"
      onLoad={() => setLoaded(true)}
    />
  );
}

const styles = StyleSheet.create({
  terminal: { flex: 1, backgroundColor: '#000' },
});
