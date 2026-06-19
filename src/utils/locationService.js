import * as RNLocationModule from '@hyoper/rn-location';
import { AppState } from 'react-native';
import { saveLocationApi } from "../services/apiClient";
import { store } from '../redux/store';

// ✅ Correct module access (IMPORTANT)
const RNLocation = RNLocationModule.RNLocation;

let locationSubscription = null;
let isTrackingActive = false;
let lastLocationSend = 0;
const SEND_INTERVAL = 10000; // 10 sec

/**
 * Check if tracking should run
 */
const shouldTrack = () => {
  const { user, isOnline, token } = store.getState().userReducer;
  return user?.role === 'driver' && isOnline && token;
};

/**
 * Send location to API
 */
const sendLocationToServer = async (location) => {
  const now = Date.now();
  if (now - lastLocationSend < SEND_INTERVAL) return;

  lastLocationSend = now;

  const { latitude, longitude, accuracy, speed } = location;

  if (!latitude || !longitude) return;

  try {
    const { token } = store.getState().userReducer;

    await saveLocationApi({
      latitude,
      longitude,
      accuracy: accuracy || 0,
      speed: speed || 0,
      isOnline: true,
      timestamp: new Date().toISOString(),
      source: 'background',
    }, token);

  } catch (error) {
    console.log('❌ Location API error:', error?.message);
  }
};

/**
 * Start tracking
 */
export const startBackgroundTracking = async () => {
  console.log('🚀 Starting tracking...');

  if (!RNLocation) {
    console.log('❌ RNLocation not available');
    return false;
  }

  if (!shouldTrack()) {
    console.log('❌ Conditions not met');
    return false;
  }

  try {
    // Stop previous
    if (locationSubscription) {
      locationSubscription.unsubscribe();
      locationSubscription = null;
    }

    // ✅ Configure
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

    // ✅ Subscribe (CORRECT API)
    const subscription = RNLocation.subscribe();

    subscription.onChange(async (locations) => {
      if (!locations?.length) return;

      const location = locations[0];

      if (!shouldTrack()) {
        console.log('🛑 Stopping tracking (conditions changed)');
        stopBackgroundTracking();
        return;
      }

      await sendLocationToServer(location);
    });

    subscription.onError((error) => {
      console.log('❌ Location error:', error);
    });

    locationSubscription = subscription;
    isTrackingActive = true;

    console.log('✅ Tracking started');

    return true;

  } catch (error) {
    console.log('❌ Failed to start tracking:', error);
    return false;
  }
};

/**
 * Stop tracking
 */
export const stopBackgroundTracking = async () => {
  console.log('🛑 Stopping tracking...');

  try {
    if (locationSubscription) {
      locationSubscription.unsubscribe();
      locationSubscription = null;
    }

    isTrackingActive = false;

    console.log('✅ Tracking stopped');

  } catch (error) {
    console.log('❌ Stop error:', error);
  }

  return true;
};

/**
 * Get current location once
 */
export const getCurrentLocation = async () => {
  try {
    const location = await RNLocation.getLatestLocation();
    return location;
  } catch (error) {
    console.log('❌ Get location error:', error);
    return null;
  }
};

/**
 * Check tracking state
 */
export const isTracking = () => isTrackingActive;

/**
 * Initialize tracking based on Redux state
 */
export const initTracking = (user, isOnline) => {
  console.log('🔄 Init tracking', { role: user?.role, isOnline });

  if (user?.role === 'driver' && isOnline) {
    startBackgroundTracking();
  } else if (isTrackingActive) {
    stopBackgroundTracking();
  }
};

/**
 * AppState listener (background/foreground)
 */
export const setupAppStateListener = () => {
  const subscription = AppState.addEventListener('change', async () => {
    const { user, isOnline } = store.getState().userReducer;

    if (user?.role === 'driver' && isOnline && !isTrackingActive) {
      await startBackgroundTracking();
    }
  });

  return subscription;
};