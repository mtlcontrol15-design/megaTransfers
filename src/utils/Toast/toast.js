import Toast from 'react-native-toast-message';
const toastUtils = {
  showSuccess: async (success, message) => {
    Toast.show({
      type: 'success',
      text1: success,
      text2: message,
      onPress: () => Toast.hide(),
    });
  },
  showError: async (error, message) => {
    Toast.show({
      type: 'error',
      text1: error,
      text2: message,
      onPress: () => Toast.hide(),
    });
  },
  showInfo: async (info, message) => {
    Toast.show({
      type: 'info',
      text1: info,
      text2: message,
      onPress: () => Toast.hide(),
    });
  },
};
export default toastUtils;
