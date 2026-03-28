import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock all components to isolate App wiring
jest.mock('../components/TerminalView', () => ({
  TerminalView: () => null,
}));
jest.mock('../components/InputBar', () => ({
  InputBar: () => null,
}));
jest.mock('../components/ButtonRow', () => ({
  ButtonRow: () => null,
}));
jest.mock('../components/ConnectionBanner', () => ({
  ConnectionBanner: () => null,
}));
jest.mock('../lib/bridge', () => ({
  createBridgeClient: jest.fn(() => ({ send: jest.fn(), stop: jest.fn() })),
}));

it('renders without crashing', () => {
  const { toJSON } = render(<App />);
  expect(toJSON()).toBeTruthy();
});

it('creates bridge client on mount', () => {
  const { createBridgeClient } = require('../lib/bridge');
  render(<App />);
  expect(createBridgeClient).toHaveBeenCalled();
});
