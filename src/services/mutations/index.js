import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { API_CONFIG } from '../../config/config';
import { EndPoints } from '../EndPoints';
import {refreshAccessToken} from '../tokenService';
import {
  handleBlockedAccountError,
  handleSessionExpired,
} from '../accountStatusHandler';

import { dispatchRefreshToken, dispatchToken } from '../../redux/slices/userSlice';

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