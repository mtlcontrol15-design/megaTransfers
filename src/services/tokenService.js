import axios from 'axios';
import { API_CONFIG } from '../config/config';
import { EndPoints } from './EndPoints';

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

export const refreshAccessToken = async refreshToken => {
  // Prevent multiple location/API requests from
  // refreshing the token at the same time.
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      console.log(
        '🔄 Access token expired. Refreshing token...',
      );

      if (!refreshToken) {
        throw new Error(
          'Refresh token is missing',
        );
      }

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

      const newAccessToken =
        findTokenValue(response?.data, [
          'access_token',
          'accessToken',
          'token',
        ]);

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

      console.log(
        '✅ Token refresh successful',
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

    } catch (error) {
      console.log(
        '❌ Token refresh failed:',
        error?.response?.data ||
          error?.message ||
          error,
      );

      throw error;

    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};