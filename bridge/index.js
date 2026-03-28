const { WebSocketServer } = require('ws');
const { ensureSession, capturePaneContent, handleMessage } = require('./lib');

const PORT = parseInt(process.env.BRIDGE_PORT || '8765');
const POLL_MS = parseInt(process.env.POLL_MS || '500');

async function main() {
  await ensureSession();

  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        await handleMessage(msg);
      } catch (err) {
        console.error('Error handling message:', err.message);
      }
    });
  });

  setInterval(async () => {
    if (wss.clients.size === 0) return;
    try {
      const content = await capturePaneContent();
      const msg = JSON.stringify({ type: 'pane', content });
      wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(msg);
      });
    } catch (err) {
      console.error('Error capturing pane:', err.message);
    }
  }, POLL_MS);

  console.log(`Bridge listening on ws://0.0.0.0:${PORT}`);
  console.log(`Session: ${process.env.TMUX_SESSION || 'claude'}`);
}

main().catch(err => {
  console.error('Bridge failed to start:', err.message);
  process.exit(1);
});
