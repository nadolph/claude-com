jest.mock('child_process');
const { exec } = require('child_process');

// lib.js is loaded after mock is set up
const { capturePaneContent, handleMessage } = require('../lib');

function mockExec(stdout = '') {
  exec.mockImplementation((cmd, cb) => cb(null, stdout, ''));
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('capturePaneContent', () => {
  it('calls tmux capture-pane with ANSI flags on the claude session', async () => {
    mockExec('\x1b[32mhello world\x1b[0m\n');
    const result = await capturePaneContent();
    expect(exec).toHaveBeenCalledWith(
      'tmux capture-pane -p -e -J -t claude',
      expect.any(Function)
    );
    expect(result).toBe('\x1b[32mhello world\x1b[0m\n');
  });
});

describe('handleMessage', () => {
  it('sends input text to tmux followed by Enter', async () => {
    mockExec();
    await handleMessage({ type: 'input', text: 'hello world' });
    expect(exec).toHaveBeenCalledWith(
      'tmux send-keys -t claude "hello world" Enter',
      expect.any(Function)
    );
  });

  it('sends Escape key for escape message', async () => {
    mockExec();
    await handleMessage({ type: 'key', key: 'escape' });
    expect(exec).toHaveBeenCalledWith(
      'tmux send-keys -t claude Escape',
      expect.any(Function)
    );
  });

  it('sends BTab for shift-tab message', async () => {
    mockExec();
    await handleMessage({ type: 'key', key: 'shift-tab' });
    expect(exec).toHaveBeenCalledWith(
      'tmux send-keys -t claude BTab',
      expect.any(Function)
    );
  });

  it('sends y Enter for y-enter message', async () => {
    mockExec();
    await handleMessage({ type: 'key', key: 'y-enter' });
    expect(exec).toHaveBeenCalledWith(
      'tmux send-keys -t claude y Enter',
      expect.any(Function)
    );
  });

  it('ignores unknown key names', async () => {
    mockExec();
    await handleMessage({ type: 'key', key: 'bogus' });
    expect(exec).not.toHaveBeenCalled();
  });

  it('sends C-c then restarts claude for restart message', async () => {
    mockExec();
    jest.useFakeTimers();
    const promise = handleMessage({ type: 'restart' });
    await jest.runAllTimersAsync();
    await promise;
    jest.useRealTimers();
    expect(exec).toHaveBeenNthCalledWith(
      1,
      'tmux send-keys -t claude C-c',
      expect.any(Function)
    );
    expect(exec).toHaveBeenNthCalledWith(
      2,
      'tmux send-keys -t claude "claude" Enter',
      expect.any(Function)
    );
  });
});
