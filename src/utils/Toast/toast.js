import Toast from 'react-native-toast-message';

const toastUtils = {
  showSuccess: (title, message, duration = 4000) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: duration,
      autoHide: true,
      onPress: () => Toast.hide(),
    });
  },

  showError: (title, message, duration = 7000) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: duration,
      autoHide: true,
      onPress: () => Toast.hide(),
    });
  },

  showInfo: (title, message, duration = 5000) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: duration,
      autoHide: true,
      onPress: () => Toast.hide(),
    });
  },
};

export default toastUtils;