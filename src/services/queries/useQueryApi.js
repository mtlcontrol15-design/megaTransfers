import axios from 'axios';
import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { API_CONFIG } from '../../config/config';
import {
  handleBlockedAccountError,
  handleSessionExpired,
} from '../accountStatusHandler';
import { refreshAccessToken } from '../mutations';
import { dispatchRefreshToken, dispatchToken } from '../../redux/slices/userSlice';

const useQueryApi = (
  queryKey,
  urlWithOutBase,
  userToken,
  customConfig = {},
  enabled = true,
  keepPrevious = false,
  queryParams = {},
  useInfiniteQueryFlag = false,
) => {
  const dispatch = useDispatch();
  const { refreshToken, token } = useSelector(state => state.userReducer);
  // console.log('Refresh Token from useQueryApi:', refreshToken);
  // console.log('Access Token from useQueryApi:', token);
  const defaultConfig = {
    method: 'get',
    baseURL: API_CONFIG.BASE_URL,
    params: queryParams,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      // Add any other common headers here
    },
  };

  const config = {
    ...defaultConfig,
    ...customConfig,
  };

  const queryFn = async ({ pageParam = 1 }) => {
    try {
      const response = await axios.request({
        url: urlWithOutBase,
        ...config,
        params: {
          ...config.params,
          page: pageParam,
        },
      });

      return response.data;
    } catch (error) {
      handleBlockedAccountError(error);

      if (error?.response?.status === 401 && refreshToken) {
        try {
          const {
            accessToken: newToken,
            refreshToken: newRefreshToken,
          } = await refreshAccessToken(refreshToken);

          dispatch(dispatchToken(newToken));
          dispatch(dispatchRefreshToken(newRefreshToken));

          const retryResponse = await axios.request({
            url: urlWithOutBase,
            ...config,
            params: {
              ...config.params,
              page: pageParam,
            },
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });

          return retryResponse.data;
        } catch (refreshError) {
          const refreshErrorStatus = refreshError?.response?.status;

          console.log(
            'Query retry failed:',
            urlWithOutBase,
            refreshErrorStatus || refreshError?.message,
          );

          if (refreshErrorStatus === 401) {
            handleSessionExpired();
          }

          throw refreshError;
        }
      }

      if (error?.response?.status === 401) {
        console.log(
          'Request returned 401 without a refresh token; modal not shown.',
        );
      }

      throw error;
    }
  };

  if (useInfiniteQueryFlag) {
    return useInfiniteQuery({
      queryKey,
      queryFn,
      enabled,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      }

    });
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    keepPreviousData: keepPrevious,
    placeholderData: keepPrevious ? keepPreviousData : null,
  });
};

export default useQueryApi;
