import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { Theme } from '../libs';
import AuthStack from './AuthStack';
import { getTheme } from './MyTheme';
import UnAuthStack from './UnAuthStack';
import { navigationRef, handlePendingNavigation } from './RootNavigation';
import { connectSocket, getSocket } from "../services/socket";


export default function AppNavigation() {
  const { themeMode } = useSelector(state => state.themeReducer);
  const { isSignedIn, user } = useSelector(state => state.userReducer);
  const systemColorScheme = useColorScheme();
  const isDarkMode = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const { colors } = Theme;
  const MyTheme = getTheme(colors, isDarkMode);

  const userId = user?._id;

  const companyId = user?.companyId;
  const employeeNumber = user?.employeeNumber;
  const token = user?.token;

  useEffect(() => {
    if (!userId || !companyId) return;

    const socket = connectSocket({
      userId,
      companyId,
      employeeNumber,
      token,
    });

    socket?.on("connect", () => {

      console.log("✅ APP SOCKET CONNECTED", socket.id);

      socket.emit("join:company", {
        companyId,
        userId,
        employeeNumber,
      });

      console.log(
        "🚪 joined room",
        `company_${companyId}`
      );
    });

    return () => {
      const socket = getSocket();
      if (socket) socket.disconnect();
    };
  }, [userId, companyId, employeeNumber, token]);

  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef} onReady={handlePendingNavigation}>
      {isSignedIn ? <AuthStack /> : <UnAuthStack />}
    </NavigationContainer>
  );
}
