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

const shouldCheckBackgroundLocation = () => {
  return Platform.OS === "android" && Number(Platform.Version) >= 29;
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
  try {
    if (!isOnlineStatus) {
      return true;
    }

    // 1. Foreground location
    let fgStatus = await check(permissionMap.locationForeground);

    if (fgStatus === RESULTS.BLOCKED) {
      openSettingsAlert("location");
      return false;
    }

    if (fgStatus !== RESULTS.GRANTED) {
      fgStatus = await request(permissionMap.locationForeground);
    }

    if (fgStatus !== RESULTS.GRANTED) {
      openSettingsAlert("location");
      return false;
    }

    // 2. Device location / GPS enabled
    const isDeviceLocationEnabled = await checkDeviceLocationEnabled();

    if (!isDeviceLocationEnabled) {
      Alert.alert(
        "Location Disabled",
        "Please enable device location services.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Location Settings",
            onPress: () => {
              if (Platform.OS === "android") {
                Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
              } else {
                Linking.openURL("App-Prefs:Privacy&path=LOCATION");
              }
            },
          },
        ]
      );

      return false;
    }

    // 3. Background location only exists from Android 10 / API 29+
    if (shouldCheckBackgroundLocation()) {
      let bgStatus = await check(permissionMap.locationBackground);

      if (bgStatus === RESULTS.GRANTED) {
        return true;
      }

      openSettingsAlert("background location / Allow all the time");
      return false;
    }

    return true;
  } catch (error) {
    console.log("Permission error:", error);
    return false;
  }
};

export const checkLocationPermissionOnly = async () => {
  try {
    const fgStatus = await check(permissionMap.locationForeground);

    if (fgStatus !== RESULTS.GRANTED) {
      return false;
    }

    if (Platform.OS === 'android') {
      const bgStatus = await check(permissionMap.locationBackground);

      if (bgStatus !== RESULTS.GRANTED) {
        return false;
      }
    }

    const isDeviceLocationEnabled = await checkDeviceLocationEnabled();

    return isDeviceLocationEnabled;
  } catch (error) {
    console.log('Check location permission error:', error);
    return false;
  }
};
