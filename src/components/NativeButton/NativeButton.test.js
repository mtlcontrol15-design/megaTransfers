// NativeButton.test.js
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import NativeButton from './NativeButton';

test('renders button with correct title', () => {
  const {getByText} = render(<NativeButton title="Click me" />);
  const buttonElement = getByText(/Click me/i);
  expect(buttonElement).toBeTruthy();
});

test('calls onPress function when button is pressed', () => {
  const onPressMock = jest.fn();
  const {getByText} = render(
    <NativeButton title="Click me" onPress={onPressMock} />,
  );
  const buttonElement = getByText(/Click me/i);
  fireEvent.press(buttonElement);
  expect(onPressMock).toHaveBeenCalled();
});
