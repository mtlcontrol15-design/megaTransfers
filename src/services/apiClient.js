import axios from 'axios';

import { API_CONFIG } from '../config/config';
import { EndPoints } from './EndPoints';

import { store } from '../redux/store';

import {
  dispatchToken,
  dispatchRefreshToken,
} from '../redux/slices/userSlice';

import {
  refreshAccessToken,
} from './tokenService';

export const saveLocationApi = async payload => {

  const sendRequest = async token => {
    return axios.request({
      url:
        `${API_CONFIG.BASE_URL}${EndPoints.saveLocation}`,

      method: 'post',

      data: payload,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      timeout: 15000,
    });
  };

  try {
    const {
      token,
    } = store.getState().userReducer;

    if (!token) {
      throw new Error(
        'Access token is missing',
      );
    }

    console.log(
      '📤 Sending background location',
    );

    const response =
      await sendRequest(token);

    console.log(
      '✅ Background API SUCCESS:',
      response?.data,
    );

    return response.data;

  } catch (error) {

    const status =
      error?.response?.status;

    if (status !== 401) {
      console.log(
        '❌ Background API ERROR:',
        error?.response?.data ||
          error?.message ||
          error,
      );

      throw error;
    }

    console.log(
      '🔑 Background access token expired. Refreshing...',
    );

    try {
      const {
        refreshToken,
      } = store.getState().userReducer;

      if (!refreshToken) {
        throw new Error(
          'Refresh token is missing',
        );
      }

      const {
        accessToken: newToken,
        refreshToken: newRefreshToken,
      } = await refreshAccessToken(
        refreshToken,
      );

      // Save new tokens in Redux BEFORE retrying.
      store.dispatch(
        dispatchToken(newToken),
      );

      store.dispatch(
        dispatchRefreshToken(
          newRefreshToken,
        ),
      );

      console.log(
        '✅ Background token refreshed',
      );

      console.log(
        '🔄 Retrying background location...',
      );

      const retryResponse =
        await sendRequest(newToken);

      console.log(
        '✅ Background API RETRY SUCCESS:',
        retryResponse?.data,
      );

      return retryResponse.data;

    } catch (refreshError) {
      console.log(
        '❌ Background token refresh/retry failed:',
        refreshError?.response?.data ||
          refreshError?.message ||
          refreshError,
      );

      throw refreshError;
    }
  }
};