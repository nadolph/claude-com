import React from 'react';
import { render } from '@testing-library/react-native';
import { ConnectionBanner } from '../ConnectionBanner';

it('renders nothing when connected', () => {
  const { toJSON } = render(<ConnectionBanner connected={true} />);
  expect(toJSON()).toBeNull();
});

it('renders warning when disconnected', () => {
  const { getByText } = render(<ConnectionBanner connected={false} />);
  expect(getByText(/Connecting/)).toBeTruthy();
});
