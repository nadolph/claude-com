// Edit BRIDGE_HOST to your server's Tailscale IP address.
// Find it by running `tailscale ip` on the server.
export const BRIDGE_HOST = '100.64.0.1';
export const BRIDGE_PORT = 8765;
export const BRIDGE_URL = `ws://${BRIDGE_HOST}:${BRIDGE_PORT}`;
