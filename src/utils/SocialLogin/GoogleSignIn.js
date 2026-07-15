import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const googleConfig = () => {
  GoogleSignin.configure({
    webClientId:
      '89805297317-tb4fg6nu1d2lrbgjk590f1sth18tkmd8.apps.googleusercontent.com',
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo?.data?.idToken) {
      return {
        provider: 'google',
        idToken: userInfo?.data?.idToken,
        name: userInfo?.data?.user?.name,
        email: userInfo?.data?.user?.email,
      };
    }
    return null;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Google sign-in cancelled');
    } else {
      console.error('Google Sign-In Error:', error);
    }
    return null;
  }
};
export const signInWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    if (appleAuthRequestResponse.identityToken) {
      return {
        provider: 'apple',
        idToken: appleAuthRequestResponse.identityToken,
        name: `${appleAuthRequestResponse.fullName?.givenName || ''} ${appleAuthRequestResponse.fullName?.familyName || ''}`.trim(),
        email: appleAuthRequestResponse.email,
      };
    }
    return null;
  } catch (error) {
    if (error.code !== appleAuth.Error.CANCELED) {
      console.error('Apple Sign-In Error:', error);
    }
    return null;
  }
};