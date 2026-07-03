import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native'

const getDeviceToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();

    console.log("FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.log('Error getting token:', error);
    return null;
  }
};

export async function requestUserPermission() {
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const deviceToken = await getDeviceToken();
        return deviceToken;
      } else {
        console.log('Permission denied');
        Alert.alert(
          'Notification Access',
          'Allow Mega-Transfers to access notification permission and then restart your app',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
        return false;
      }
    } catch (error) {
      console.error('Permission request error: ', error);
    }
  } else {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const deviceToken = await getDeviceToken();
        return deviceToken;
      } else {
        console.log('Permission denied');
        Alert.alert(
          'Notification Access',
          'Allow Mega-Transfers to access notification permission and then restart your app',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
        return false;
      }
    } catch (error) {
      console.error('Permission request error: ', error);
    }
  }
}