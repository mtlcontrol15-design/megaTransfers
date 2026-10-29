import axios from 'axios';

import { API_CONFIG } from '../config/config';
import { EndPoints } from './EndPoints';

import { store } from '../redux/store';

import {
  dispatchToken,
  dispatchRefreshToken,
} from '../redux/slices/userSlice';

let refreshTokenPromise = null;

const findTokenValue = (value, names) => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const name of names) {
    if (
      typeof value[name] === 'string' &&
      value[name]
    ) {
      return value[name];
    }
  }

  for (const nestedValue of Object.values(value)) {
    const token = findTokenValue(
      nestedValue,
      names,
    );

    if (token) {
      return token;
    }
  }

  return null;
};

export const refreshAccessToken = async () => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const { refreshToken } =
        store.getState().userReducer;

      if (!refreshToken) {
        throw new Error(
          'Refresh token is missing',
        );
      }

      console.log(
        '🔄 Refreshing access token...',
      );

      const response = await axios.request({
        method: 'post',

        baseURL: API_CONFIG.BASE_URL,

        url: EndPoints.tokenRefresh,

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        data: {
          refresh_token: refreshToken,
        },
      });

      const newAccessToken = findTokenValue(
        response?.data,
        [
          'access_token',
          'accessToken',
          'token',
        ],
      );

      if (!newAccessToken) {
        throw new Error(
          'Refresh API did not return an access token',
        );
      }

      const newRefreshToken =
        findTokenValue(response?.data, [
          'refresh_token',
          'refreshToken',
        ]) || refreshToken;

      // Do not restore a session that was logged out
      // while the refresh request was in progress.
      const currentRefreshToken =
        store.getState().userReducer.refreshToken;

      if (currentRefreshToken !== refreshToken) {
        throw new Error(
          'Session changed during token refresh',
        );
      }

      store.dispatch(
        dispatchToken(newAccessToken),
      );

      store.dispatch(
        dispatchRefreshToken(newRefreshToken),
      );

      console.log(
        '✅ Access token refreshed successfully',
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

    } catch (error) {
      console.log(
        '❌ Token refresh failed:',
        error?.response?.data ||
        error?.message,
      );

      throw error;

    }
  })();

  try {
    return await refreshTokenPromise;
  } finally {
    refreshTokenPromise = null;
  }
};