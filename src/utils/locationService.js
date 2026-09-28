import * as RNLocationModule from '@hyoper/rn-location';
import { AppState } from 'react-native';
import { saveLocationApi } from '../services/apiClient';
import { store } from '../redux/store';

const RNLocation = RNLocationModule.RNLocation;

let locationSubscription = null;
let isTrackingActive = false;
let lastLocationSend = 0;

const SEND_INTERVAL = 10000;

// IMPORTANT:
// Tracking depends only on driver role + online status.
// Token expiry must NOT stop location tracking.
const shouldTrack = () => {
  const {
    user,
    isOnline,
  } = store.getState().userReducer;

  return (
    user?.role === 'driver' &&
    Boolean(isOnline)
  );
};

const sendLocationToServer = async location => {
  const now = Date.now();

  if (now - lastLocationSend < SEND_INTERVAL) {
    return;
  }

  const {
    latitude,
    longitude,
    accuracy,
    speed,
  } = location;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return;
  }

  try {
    const {
      isOnline,
      isAvailable,
    } = store.getState().userReducer;

    await saveLocationApi({
      latitude,
      longitude,
      accuracy: accuracy ?? 0,
      speed: speed ?? 0,
      isOnline: Boolean(isOnline),
      isAvailable: Boolean(isAvailable),
      timestamp: new Date().toISOString(),
      source: 'background',
    });

    lastLocationSend = now;

  } catch (error) {
    console.log(
      '❌ Location API error:',
      error?.response?.data ||
      error?.message ||
      error,
    );
  }
};

export const startBackgroundTracking = async () => {
  console.log('🚀 Starting tracking...', {
    isTrackingActive,
    hasSubscription: Boolean(locationSubscription),
    appState: AppState.currentState,
  });

  // IMPORTANT:
  // Never restart an already running location subscription.
  if (isTrackingActive && locationSubscription) {
    console.log(
      '✅ Tracking already active - start ignored',
    );

    return true;
  }

  if (!RNLocation) {
    console.log('❌ RNLocation not available');
    return false;
  }

  if (!shouldTrack()) {
    console.log('❌ Conditions not met');
    return false;
  }

  try {
    await RNLocation.configure({
      distanceFilter: 0,

      allowsBackgroundLocationUpdates: true,
      showsBackgroundLocationIndicator: true,

      android: {
        interval: 5000,
        minWaitTime: 2000,
        maxWaitTime: 5000,
        priority: 'highAccuracy',
        provider: 'auto',
      },

      ios: {
        desiredAccuracy: 'best',
        pausesLocationUpdatesAutomatically: false,
      },
    });

    const subscription = RNLocation.subscribe();

    subscription.onChange(async locations => {
      if (!locations?.length) {
        return;
      }

      // Only stop when driver is no longer online
      // or current user is no longer a driver.
      if (!shouldTrack()) {
        console.log(
          '🛑 Stopping tracking - driver is offline',
        );

        await stopBackgroundTracking();
        return;
      }

      const location = locations[0];

      await sendLocationToServer(location);
    });

    subscription.onError(error => {
      console.log(
        '❌ Location error:',
        error?.message || error,
      );
    });

    locationSubscription = subscription;
    isTrackingActive = true;

    console.log('✅ Tracking started');

    return true;

  } catch (error) {
    console.log(
      '❌ Failed to start tracking:',
      error,
    );

    isTrackingActive = false;
    locationSubscription = null;

    return false;
  }
};

export const stopBackgroundTracking = async () => {
  console.log('🛑 Stopping tracking...');

  try {
    if (locationSubscription) {
      locationSubscription.unsubscribe();
      locationSubscription = null;
    }

    isTrackingActive = false;
    lastLocationSend = 0;

    console.log('✅ Tracking stopped');

  } catch (error) {
    console.log(
      '❌ Stop error:',
      error,
    );
  }

  return true;
};

export const getCurrentLocation = async () => {
  try {
    const location =
      await RNLocation.getLatestLocation();

    return location;

  } catch (error) {
    console.log(
      '❌ Get location error:',
      error,
    );

    return null;
  }
};

export const isTracking = () =>
  isTrackingActive;

export const initTracking = async (user, isOnline) => {
  console.log('🔄 Init tracking', {
    role: user?.role,
    isOnline,
    isTrackingActive,
  });

  if (user?.role === 'driver' && isOnline) {
    if (!isTrackingActive) {
      await startBackgroundTracking();
    } else {
      console.log(
        '✅ Tracking already active - no restart',
      );
    }

    return;
  }

  if (isTrackingActive) {
    await stopBackgroundTracking();
  }
};

export const setupAppStateListener = () => {
  const subscription =
    AppState.addEventListener(
      'change',
      async () => {
        const {
          user,
          isOnline,
        } = store.getState().userReducer;

        if (
          user?.role === 'driver' &&
          isOnline &&
          !isTrackingActive
        ) {
          await startBackgroundTracking();
        }
      },
    );

  return subscription;
};