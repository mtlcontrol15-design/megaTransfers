import { navigate } from '../navigation/RootNavigation';
import { store } from '../redux/store';
import { dispatchIsSignedIn, dispatchToken, dispatchUser } from '../redux/slices/userSlice';

const ACCOUNT_STATUS_MESSAGES = {
  ACCOUNT_REJECTED: 'Your account has been rejected by admin',
  ACCOUNT_SUSPENDED: 'Your account has been suspended by admin',
  ACCOUNT_PENDING: 'Your account is pending admin approval',
};

const ACCOUNT_STATUS_TITLES = {
  ACCOUNT_REJECTED: 'Account Rejected',
  ACCOUNT_SUSPENDED: 'Account Suspended',
  ACCOUNT_PENDING: 'Account Pending',
};

const getStatusCode = (error) => error?.response?.status;
const getErrorCode = (error) => error?.response?.data?.code;

export const isBlockedAccountError = (error) => {
  const status = getStatusCode(error);
  const code = getErrorCode(error);

  return status === 403 && Boolean(ACCOUNT_STATUS_MESSAGES[code]);
};

export const getBlockedScreenPayload = (error) => {
  const code = getErrorCode(error);
  const messageFromApi = error?.response?.data?.message;

  return {
    code,
    title: ACCOUNT_STATUS_TITLES[code] || 'Account Blocked',
    message: messageFromApi || ACCOUNT_STATUS_MESSAGES[code] || 'Your account access is currently restricted.',
  };
};

export const handleBlockedAccountError = (error) => {
  if (!isBlockedAccountError(error)) {
    return false;
  }

  const payload = getBlockedScreenPayload(error);
  const { dispatch } = store;

  dispatch(dispatchIsSignedIn(false));
  dispatch(dispatchToken(null));
  dispatch(dispatchUser(null));

  navigate('BlockedScreen', payload);
  return true;
};
