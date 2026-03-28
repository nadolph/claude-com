import React from 'react';
import { render } from '@testing-library/react-native';
import { TerminalView } from '../TerminalView';

// react-native-webview is a native module — mock it
jest.mock('react-native-webview', () => {
  const { forwardRef } = require('react');
  return {
    WebView: forwardRef(({ testID }: any, ref: any) => {
      const { View } = require('react-native');
      if (ref) ref.current = { injectJavaScript: jest.fn() };
      return <View testID={testID || 'webview'} />;
    }),
  };
});

it('renders without crashing', () => {
  const { getByTestId } = render(<TerminalView content="" />);
  expect(getByTestId('webview')).toBeTruthy();
});
