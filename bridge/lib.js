const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const SESSION = process.env.TMUX_SESSION || 'claude';
const CLAUDE_CMD = process.env.CLAUDE_CMD || 'claude';

const KEY_MAP = {
  'escape': 'Escape',
  'shift-tab': 'BTab',
  'y-enter': 'y Enter',
  'ctrl-c': 'C-c',
};

async function ensureSession() {
  try {
    await execAsync(`tmux has-session -t ${SESSION}`);
  } catch {
    await execAsync(`tmux new-session -d -s ${SESSION}`);
    await execAsync(`tmux send-keys -t ${SESSION} "${CLAUDE_CMD}" Enter`);
  }
}

async function capturePaneContent() {
  return new Promise((resolve, reject) => {
    exec(`tmux capture-pane -p -e -J -t ${SESSION}`, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

async function handleMessage(msg) {
  if (msg.type === 'input') {
    await execAsync(`tmux send-keys -t ${SESSION} "${msg.text}" Enter`);
  } else if (msg.type === 'key') {
    const key = KEY_MAP[msg.key];
    if (key) await execAsync(`tmux send-keys -t ${SESSION} ${key}`);
  } else if (msg.type === 'restart') {
    await execAsync(`tmux send-keys -t ${SESSION} C-c`);
    await new Promise(r => setTimeout(r, 500));
    await execAsync(`tmux send-keys -t ${SESSION} "${CLAUDE_CMD}" Enter`);
  }
}

module.exports = { ensureSession, capturePaneContent, handleMessage, KEY_MAP };
