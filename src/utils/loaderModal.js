import React from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import LoaderKit from 'react-native-loader-kit'

const LoaderModal = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* <View style={styles.loaderBox}> */}
        <LoaderKit
          style={{ width: 40, height: 40 }}
          name="BallSpinFadeLoader"
          color="#ffff"
          size={50}
        />
        <Text style={{ color: 'white', fontSize: 15, marginTop: 20,width:'100%', textAlign: 'center' }}>Processing</Text>
      </View>
      {/* </View> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: '#222831cc',
    borderRadius: moderateScale(16),
    padding: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoaderModal;
