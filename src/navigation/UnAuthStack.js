import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen/splashScreen';
import Login from '../screens/LoginScreen/Login';
import SignUp from '../screens/SignUpScreen/SignUp';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import NewPassword from '../screens/NewPassword/NewPassword';
import RoleSelectionScreen from '../screens/RoleSelectionScreen/RoleSelectionScreen';
import RegisterDriverScreen from '../screens/RegisterDriverScreen/RegisterDriverScreen';
import PdfView from '../screens/PdfView/PdfView';
import BlockedScreen from '../screens/BlockedScreen/BlockedScreen';

function UnAuthStack() {
  const Stack = createNativeStackNavigator();

  const screens = {
    SplashScreen,
    Login,
    SignUp,
    ForgotPassword,
    NewPassword,
    RoleSelectionScreen,
    RegisterDriverScreen,
    PdfView,
    BlockedScreen,
  };

  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        orientation: 'default',
        freezeOnBlur: true,
      }}>
      {Object.entries(screens).map(([name, component]) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}

export default UnAuthStack;
