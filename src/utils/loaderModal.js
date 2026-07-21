import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { moderateScale } from 'react-native-size-matters';

const LoaderModal = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('../assets/images/Dashboard.json')}
          style={styles.animation}
          autoPlay
          loop
          resizeMode="contain"
        />

        {/* <Text style={styles.text}>{text}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },

  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  animation: {
    width: moderateScale(230),
    height: moderateScale(230),
  },

  text: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginTop: moderateScale(10),
    textAlign: 'center',
  },
});

export default LoaderModal;