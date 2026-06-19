import { Alert, Platform, Linking } from 'react-native';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';


const checkDeviceLocationEnabled = async () => {
  return new Promise((resolve) => {

    Geolocation.getCurrentPosition(
      () => resolve(true),

      (error) => {

        console.log('LOCATION CHECK ERROR:', error);

        // ONLY GPS DISABLED
        if (error.code === 2) {
          resolve(false);
          return;
        }

        // OTHER ERRORS SHOULD NOT
        // BE TREATED AS GPS OFF
        resolve(true);
      },

      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      }
    );
  });
};

const permissionMap = {
  locationForeground:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,

  locationBackground:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,

  camera:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA,
};

const openSettingsAlert = (permissionName) => {
  Alert.alert(
    'Permission Required',
    `Please allow ${permissionName} permission from settings to continue.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
};

export const requestSinglePermission = async (type) => {
  const permission = permissionMap[type];

  if (!permission) return false;

  let status = await check(permission);

  if (status === RESULTS.GRANTED) return true;

  if (status === RESULTS.BLOCKED) {
    openSettingsAlert(type);
    return false;
  }

  status = await request(permission);

  if (status === RESULTS.GRANTED) return true;

  if (status === RESULTS.BLOCKED) {
    openSettingsAlert(type);
    return false;
  }

  return false;
};

export const checkPermissionStatus = async (type) => {
  const permission = permissionMap[type];
  if (!permission) return false;

  const status = await check(permission);
  return status === RESULTS.GRANTED;
};

export const requestLocationPermission = async () => {
  try {

    let status = await check(permissionMap.locationForeground);

    if (status === RESULTS.BLOCKED) {
      openSettingsAlert('location');
      return false;
    }

    if (status !== RESULTS.GRANTED) {
      status = await request(permissionMap.locationForeground);
    }

    if (status !== RESULTS.GRANTED) {
      openSettingsAlert('location');
      return false;
    }

    const isDeviceLocationEnabled =
      await checkDeviceLocationEnabled();

    if (!isDeviceLocationEnabled) {

      Alert.alert(
        'Location Disabled',
        'Please enable device location services (GPS).',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Location Settings',
            onPress: async () => {

              if (Platform.OS === 'android') {

                Linking.sendIntent(
                  'android.settings.LOCATION_SOURCE_SETTINGS'
                );

              } else {

                Linking.openURL(
                  'App-Prefs:Privacy&path=LOCATION'
                );
              }
            },
          },
        ]
      );

      return false;
    }

    // ANDROID BACKGROUND
    if (Platform.OS === 'android') {

      let bgStatus =
        await check(permissionMap.locationBackground);

      if (bgStatus === RESULTS.BLOCKED) {
        openSettingsAlert('background location');
        return false;
      }

      if (bgStatus !== RESULTS.GRANTED) {
        bgStatus =
          await request(permissionMap.locationBackground);
      }

      if (bgStatus !== RESULTS.GRANTED) {
        openSettingsAlert('background location');
        return false;
      }
    }

    return true;

  } catch (error) {

    console.log('Permission error:', error);

    return false;
  }
};
