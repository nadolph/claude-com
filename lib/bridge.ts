import { BRIDGE_URL } from './config';

type Callbacks = {
  onContent: (content: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function createBridgeClient(callbacks: Callbacks) {
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  function connect() {
    const socket = new WebSocket(BRIDGE_URL);
    ws = socket;

    socket.onopen = () => callbacks.onConnect();

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'pane') callbacks.onContent(msg.content);
      } catch {}
    };

    socket.onclose = () => {
      if (!stopped) {
        callbacks.onDisconnect();
        reconnectTimer = setTimeout(connect, 2000);
      }
    };

    socket.onerror = () => socket.close();
  }

  function send(msg: object) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  function stop() {
    stopped = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
  }

  connect();
  return { send, stop };
}
