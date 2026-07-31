import React, { useEffect, useState } from 'react';
import { AppState, StatusBar, StyleSheet } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import messaging from '@react-native-firebase/messaging';
import { checkForUpdate } from './src/utils/updateService';
import InternetConnectionHandler from './src/utils/InternetConnectionHandler';
import { registerBackgroundHandler, registerForegroundHandler } from './src/utils/notificationHandler/notificationHandler';

import AppNavigation from './src/navigation';
import { store, persistedStore } from './src/redux/store';
import { navigate } from './src/navigation/RootNavigation';

// Import our new location service
import {
  initTracking,
  setupAppStateListener,
  stopBackgroundTracking
} from './src/utils/locationService';


const AppContent = () => {
  const [ready, setReady] = useState(false);
  const { user, isOnline, token } = useSelector(state => state.userReducer);

  const handleNotificationNavigation = (
    data = {}
  ) => {

    const screen = data?.screen;

    const jobId = data?.jobId;
    const bookingId = data?.bookingId;
    const userId = data?.senderId;
    const poolJobId = data?.poolJobId;
    const poolJobRef = data?.poolJobRef;

    console.log(
      "Notification Navigation:",
      data
    );

    // CHAT

    if (
      screen === "Chat" &&
      userId
    ) {

      navigate("Chat", {
        userId,
      });

      return;
    }

    // JOURNEY DETAILS

    if (
      (
        screen === "JourneyDetails" ||
        screen === "BookingDetails"
      ) &&
      bookingId
    ) {

      navigate("JourneyDetails", {
        bookingId,
      });

      return;
    }

    // JOB DETAILS

    if (
      screen === "JobDetails" &&
      jobId
    ) {

      navigate("JobDetails", {
        jobId,
      });

      return;
    }

    if (screen === "PoolScreen") {
      navigate("Home", {
        screen: "PoolTab",
        params: {
          poolJobId,
          poolJobRef,
        },
      });
      return;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkForUpdate();
      setReady(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    initTracking(user, isOnline, token);
  }, [user, isOnline, token]);

  // Setup app state listener for resume/background
  useEffect(() => {
    const subscription = setupAppStateListener();
    return () => subscription?.remove();
  }, []);


  useEffect(() => {

    const checkInitialNotification =
      async () => {

        const remoteMessage =
          await messaging()
            .getInitialNotification();

        if (remoteMessage) {

          console.log(
            "Initial Notification:",
            remoteMessage
          );

          handleNotificationNavigation(
            remoteMessage?.data
          );
        }
      };

    checkInitialNotification();

  }, []);

  useEffect(() => {

    const unsubscribe =
      messaging().onNotificationOpenedApp(
        (remoteMessage) => {

          console.log(
            "Notification Opened:",
            remoteMessage
          );

          handleNotificationNavigation(
            remoteMessage?.data
          );
        }
      );

    return unsubscribe;

  }, []);

  // Cleanup on app unmount
  useEffect(() => {
    return () => {
      stopBackgroundTracking();
    };
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ready) {
      return;
    }

    let appState = AppState.currentState;

    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        const resumedFromBackground =
          /inactive|background/.test(appState) &&
          nextState === 'active';

        appState = nextState;

        if (!resumedFromBackground) {
          return;
        }

        try {
          await checkForUpdate();

          console.log('App resumed');

          await queryClient.invalidateQueries();
        } catch (error) {
          console.error(
            'Failed to check updates after resume:',
            error,
          );
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [ready, queryClient]);

  return (
    <>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <AppNavigation />
      <InternetConnectionHandler />
      <Toast />
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  useEffect(() => {
    registerBackgroundHandler();
    const unsubscribe = registerForegroundHandler();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={styles.gestureHandler}>
              <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <AppContent />
              </SafeAreaView>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});