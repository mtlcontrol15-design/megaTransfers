import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { API_CONFIG } from '../../config/config';
import { EndPoints } from '../EndPoints';
import { handleBlockedAccountError } from '../accountStatusHandler';

import { dispatchRefreshToken, dispatchToken } from '../../redux/slices/userSlice';


let refreshTokenPromise = null;


const refreshAccessToken = async refreshToken => {
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
        'Refresh response:',
        response?.data,
      );

      const newAccessToken =
        response?.data?.access_token ||
        response?.data?.token ||
        response?.data?.data?.access_token ||
        response?.data?.data?.token;

      if (!newAccessToken) {
        throw new Error(
          'Refresh API did not return an access token',
        );
      }

      return {
        accessToken:
          newAccessToken,

        refreshToken:
          response?.data?.refresh_token ||
          response?.data?.data?.refresh_token ||
          refreshToken,
      };
    } catch (error) {
      console.log(
        'Token refresh failed:',
        error?.response?.data ||
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

  const token = useSelector(
    state => state.userReducer.token,
  );

  const refreshToken = useSelector(
    state => state.userReducer.refreshToken,
  );

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


      if (status !== 401) {
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

        return retryResponse.data;

      } catch (refreshError) {

        console.log(
          'Session refresh/retry failed:',
          refreshError?.response?.data ||
          refreshError?.message,
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