import { createBridgeClient } from '../bridge';

// Mock global WebSocket
const mockWs = {
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  onopen: null as any,
  onmessage: null as any,
  onclose: null as any,
  onerror: null as any,
};

const MockWebSocket = jest.fn(() => mockWs);
(global as any).WebSocket = MockWebSocket;
(global as any).WebSocket.OPEN = 1;

describe('createBridgeClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockWs.readyState = 1;
    mockWs.onopen = null;
    mockWs.onmessage = null;
    mockWs.onclose = null;
    mockWs.onerror = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('connects to the bridge URL on create', () => {
    createBridgeClient({ onContent: jest.fn(), onConnect: jest.fn(), onDisconnect: jest.fn() });
    expect(MockWebSocket).toHaveBeenCalledWith(expect.stringContaining('ws://'));
  });

  it('calls onConnect when WebSocket opens', () => {
    const onConnect = jest.fn();
    createBridgeClient({ onContent: jest.fn(), onConnect, onDisconnect: jest.fn() });
    mockWs.onopen(null);
    expect(onConnect).toHaveBeenCalled();
  });

  it('calls onContent when pane message received', () => {
    const onContent = jest.fn();
    createBridgeClient({ onContent, onConnect: jest.fn(), onDisconnect: jest.fn() });
    mockWs.onmessage({ data: JSON.stringify({ type: 'pane', content: 'hello' }) });
    expect(onContent).toHaveBeenCalledWith('hello');
  });

  it('calls onDisconnect and schedules reconnect on close', () => {
    const onDisconnect = jest.fn();
    createBridgeClient({ onContent: jest.fn(), onConnect: jest.fn(), onDisconnect });
    mockWs.onclose(null);
    expect(onDisconnect).toHaveBeenCalled();
    expect(MockWebSocket).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(2000);
    expect(MockWebSocket).toHaveBeenCalledTimes(2);
  });

  it('send() sends JSON over WebSocket when open', () => {
    const client = createBridgeClient({ onContent: jest.fn(), onConnect: jest.fn(), onDisconnect: jest.fn() });
    client.send({ type: 'input', text: 'hello' });
    expect(mockWs.send).toHaveBeenCalledWith('{"type":"input","text":"hello"}');
  });

  it('stop() closes the WebSocket and prevents reconnect', () => {
    const client = createBridgeClient({ onContent: jest.fn(), onConnect: jest.fn(), onDisconnect: jest.fn() });
    client.stop();
    expect(mockWs.close).toHaveBeenCalled();
    mockWs.onclose(null);
    jest.advanceTimersByTime(5000);
    expect(MockWebSocket).toHaveBeenCalledTimes(1); // no reconnect
  });
});
