import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ButtonRow } from '../ButtonRow';

it('renders all four buttons', () => {
  const { getByText } = render(<ButtonRow onKey={jest.fn()} />);
  expect(getByText('Y')).toBeTruthy();
  expect(getByText('Esc')).toBeTruthy();
  expect(getByText('⇥')).toBeTruthy();
  expect(getByText('↺')).toBeTruthy();
});

it('calls onKey with the correct key when tapped', () => {
  const onKey = jest.fn();
  const { getByText } = render(<ButtonRow onKey={onKey} />);
  fireEvent.press(getByText('Esc'));
  expect(onKey).toHaveBeenCalledWith('escape');
});

it('calls onKey with restart when ↺ is tapped', () => {
  const onKey = jest.fn();
  const { getByText } = render(<ButtonRow onKey={onKey} />);
  fireEvent.press(getByText('↺'));
  expect(onKey).toHaveBeenCalledWith('restart');
});
