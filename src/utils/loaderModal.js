import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LoaderKit from 'react-native-loader-kit'

const LoaderModal = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <LoaderKit
        style={{ width: 40, height: 40 }}
        name="BallSpinFadeLoader"
        color="#ffff"
        size={50}
      />
      <Text style={styles.text}>Processing</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginTop: 20,
    width: '100%',
    textAlign: 'center',
  },
});

export default LoaderModal;
