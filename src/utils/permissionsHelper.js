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

export const requestLocationPermission = async (isOnlineStatus = true) => {
  return new Promise((resolve) => {
    // If driver is going offline, no need to check permissions
    if (!isOnlineStatus) {
      resolve(true);
      return;
    }

    // Show Location Access Disclosure first (only when going online)
    Alert.alert(
      'Location Access Disclosure',
      'MTL Dispatch collects and uses your location data to show your live driver position to dispatchers and assigned customers during active bookings, even when the app is closed or running in the background. This helps track trips, manage dispatch jobs, and provide accurate driver updates.\n\nYour location is used only for dispatch and booking tracking features.',
      [
        {
          text: 'Cancel',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'I Agree',
          onPress: async () => {
            try {
              let status = await check(permissionMap.locationForeground);

              if (status === RESULTS.BLOCKED) {
                openSettingsAlert('location');
                resolve(false);
                return;
              }

              if (status !== RESULTS.GRANTED) {
                status = await request(permissionMap.locationForeground);
              }

              if (status !== RESULTS.GRANTED) {
                openSettingsAlert('location');
                resolve(false);
                return;
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
                      onPress: () => resolve(false),
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
                        resolve(false);
                      },
                    },
                  ]
                );
                return;
              }

              // ANDROID BACKGROUND
              if (Platform.OS === 'android') {
                let bgStatus =
                  await check(permissionMap.locationBackground);

                if (bgStatus === RESULTS.BLOCKED) {
                  openSettingsAlert('background location');
                  resolve(false);
                  return;
                }

                if (bgStatus !== RESULTS.GRANTED) {
                  bgStatus =
                    await request(permissionMap.locationBackground);
                }

                if (bgStatus !== RESULTS.GRANTED) {
                  openSettingsAlert('background location');
                  resolve(false);
                  return;
                }
              }

              resolve(true);

            } catch (error) {
              console.log('Permission error:', error);
              resolve(false);
            }
          },
        },
      ]
    );
  });
};
