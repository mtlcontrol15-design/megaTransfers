import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { API_CONFIG } from '../../config/config';
import { EndPoints } from '../EndPoints';
import {
  handleBlockedAccountError,
  handleSessionExpired,
} from '../accountStatusHandler';

import { dispatchRefreshToken, dispatchToken } from '../../redux/slices/userSlice';


let refreshTokenPromise = null;

const findTokenValue = (value, names) => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const name of names) {
    if (typeof value[name] === 'string' && value[name]) {
      return value[name];
    }
  }

  for (const nestedValue of Object.values(value)) {
    const token = findTokenValue(nestedValue, names);
    if (token) {
      return token;
    }
  }

  return null;
};

const describeResponseShape = (value, path = '', result = []) => {
  if (!value || typeof value !== 'object' || result.length >= 30) {
    return result;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    if (result.length >= 30) {
      return;
    }

    const nestedPath = path ? `${path}.${key}` : key;

    if (nestedValue && typeof nestedValue === 'object') {
      describeResponseShape(nestedValue, nestedPath, result);
    } else {
      result.push(`${nestedPath}: ${typeof nestedValue}`);
    }
  });

  return result;
};


export const refreshAccessToken = async refreshToken => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      console.log(
        'Access token expired. Refreshing token...',
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

      console.log(
        'Refresh response received:',
        response?.status,
        describeResponseShape(response?.data),
      );

      const newAccessToken = findTokenValue(response?.data, [
        'access_token',
        'accessToken',
        'token',
      ]);

      if (!newAccessToken) {
        console.log(
          'Refresh succeeded but access token is missing. Response keys:',
          describeResponseShape(response?.data),
        );
        throw new Error(
          'Refresh API did not return an access token',
        );
      }

      return {
        accessToken:
          newAccessToken,

        refreshToken:
          findTokenValue(response?.data, [
            'refresh_token',
            'refreshToken',
          ]) || refreshToken,
      };
    } catch (error) {
      console.log(
        'Token refresh failed:',
        error?.response?.status ||
        error?.message,
      );

      throw error;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

const useApi = (
  urlWithOutBase,
  userToken,
  customConfig = {},
  whenSuccess,
  whenError,
  method = 'post',
  contentType = 'application/json',
) => {

  const dispatch = useDispatch();

  const { token, refreshToken } = useSelector(state => state.userReducer);

  const defaultConfig = {
    method,

    baseURL: API_CONFIG.BASE_URL,

    headers: {
      Accept: 'application/json',

      'Content-Type': contentType,

      Authorization: token
        ? `Bearer ${token}`
        : '',
    },
  };

  const config = {
    ...defaultConfig,

    ...customConfig,

    headers: {
      ...defaultConfig.headers,
      ...customConfig?.headers,
    },
  };

  const postData = async body => {

    const isFormData =
      typeof FormData !== 'undefined' &&
      body instanceof FormData;

    let actualEndpoint =
      urlWithOutBase;

    let actualBody =
      body;

    if (
      body &&
      typeof body === 'object' &&
      !isFormData &&
      body.__endpoint__
    ) {
      actualEndpoint =
        body.__endpoint__;

      const {
        __endpoint__,
        ...cleanBody
      } = body;

      actualBody =
        cleanBody;
    }

    const requestHeaders = {
      ...config.headers,
    };

    if (isFormData) {
      delete requestHeaders['Content-Type'];
      delete requestHeaders['content-type'];
    } else {
      requestHeaders['Content-Type'] =
        contentType;
    }


    const requestConfig = {
      ...config,

      url: actualEndpoint,

      data: actualBody,

      headers: requestHeaders,
    };

    try {

      const response =
        await axios.request(
          requestConfig,
        );

      return response.data;

    } catch (error) {

      handleBlockedAccountError(error);


      const status =
        error?.response?.status;


      if (status !== 401 || actualEndpoint === EndPoints.login) {
        throw error;
      }

      if (
        actualEndpoint ===
        EndPoints.tokenRefresh
      ) {
        console.log(
          'Refresh endpoint returned 401.',
        );

        throw error;
      }

      if (!refreshToken) {
        throw error;
      }


      try {

        const {
          accessToken: newToken,
          refreshToken: newRefreshToken,
        } = await refreshAccessToken(
          refreshToken,
        );

        dispatch(
          dispatchToken(
            newToken,
          ),
        );

        dispatch(
          dispatchRefreshToken(
            newRefreshToken,
          ),
        );


        const retryHeaders = {
          ...requestConfig.headers,

          Authorization:
            `Bearer ${newToken}`,
        };


        const retryResponse =
          await axios.request({
            ...requestConfig,

            headers: {
              ...requestConfig.headers,

              Authorization:
                `Bearer ${newToken}`,
            },
          });

        console.log('Request retry succeeded:', actualEndpoint);

        return retryResponse.data;

      } catch (refreshError) {

        const refreshErrorStatus = refreshError?.response?.status;

        console.log(
          'Request retry failed:',
          actualEndpoint,
          refreshErrorStatus || refreshError?.message,
        );

        if (refreshErrorStatus === 401) {
          handleSessionExpired();
        }

        console.log(
          'Session refresh/retry failed:',
          refreshErrorStatus || refreshError?.message,
        );

        throw refreshError;
      }
    }
  };

  return useMutation({

    mutationFn: postData,


    onSuccess: responseData => {

      whenSuccess?.(
        responseData,
      );
    },


    onError: err => {

      console.log(
        'Error sending data:',
        err?.response?.data ||
        err?.message,
      );

      whenError?.(
        err,
      );
    },
  });
};

export default useApi;