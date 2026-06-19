// NativeButton.js
import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

import PropTypes from 'prop-types';

import styles from './NativeButtonStyles';

const NativeButton = ({
  onPress,
  title,
  containerStyle,
  titleStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      style={[styles.button, containerStyle]}
      onPress={onPress}>
      <Text style={[styles.buttonText, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default NativeButton;

NativeButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

// Define default values
NativeButton.defaultProps = {
  disabled: false,
  titleStyle: {},
  containerStyle: {},
};
