import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputBar } from '../InputBar';

it('calls onSend with input text when send button pressed', () => {
  const onSend = jest.fn();
  const { getByPlaceholderText, getByText } = render(<InputBar onSend={onSend} />);
  fireEvent.changeText(getByPlaceholderText(/Message/), 'hello claude');
  fireEvent.press(getByText('↑'));
  expect(onSend).toHaveBeenCalledWith('hello claude');
});

it('clears input after send', () => {
  const onSend = jest.fn();
  const { getByPlaceholderText, getByText } = render(<InputBar onSend={onSend} />);
  const input = getByPlaceholderText(/Message/);
  fireEvent.changeText(input, 'hello');
  fireEvent.press(getByText('↑'));
  expect(input.props.value).toBe('');
});

it('does not call onSend for empty input', () => {
  const onSend = jest.fn();
  const { getByText } = render(<InputBar onSend={onSend} />);
  fireEvent.press(getByText('↑'));
  expect(onSend).not.toHaveBeenCalled();
});
