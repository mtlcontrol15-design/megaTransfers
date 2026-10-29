import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from '@tanstack/react-query';

import apiClient from '../authenticatedClient';

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

  const queryFn = async ({ pageParam = 1 }) => {

    const config = {
      ...customConfig,

      method: 'get',

      url: urlWithOutBase,

      params: {
        ...queryParams,
        ...customConfig?.params,
        page: pageParam,
      },

      headers: {
        'Content-Type': 'application/json',

        ...customConfig?.headers,
      },
    };

    const response = await apiClient.request(config);

    return response.data;
  };

  if (useInfiniteQueryFlag) {
    return useInfiniteQuery({
      queryKey,

      queryFn,

      enabled,

      initialPageParam: 1,

      getNextPageParam: lastPage => {
        if (
          lastPage.currentPage <
          lastPage.totalPages
        ) {
          return lastPage.currentPage + 1;
        }

        return undefined;
      },
    });
  }

  return useQuery({
    queryKey,

    queryFn,

    enabled,

    placeholderData: keepPrevious
      ? keepPreviousData
      : undefined,
  });
};

export default useQueryApi;