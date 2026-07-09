import axios from 'axios';
import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { API_CONFIG } from '../../config/config';
import { handleBlockedAccountError } from '../accountStatusHandler';

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
  const defaultConfig = {
    method: 'get',
    baseURL: API_CONFIG.BASE_URL,
    params: queryParams,
    headers: {
      'Content-Type': 'application/json',
      Authorization: userToken ? `Bearer ${userToken}` : '',
      // Add any other common headers here
    },
  };

  const config = {
    ...defaultConfig,
    ...customConfig,
  };

  const queryFn = async ({ pageParam }) => {
    try {
      config.params.page = pageParam;
      const response = await axios.request({
        url: urlWithOutBase,
        ...config,
      });

      return response.data;
    } catch (error) {
      handleBlockedAccountError(error);
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
