import { useMutation } from '@tanstack/react-query';

import apiClient from '../authenticatedClient';

const useApi = (
  urlWithOutBase,
  userToken,
  customConfig = {},
  whenSuccess,
  whenError,
  method = 'post',
  contentType = 'application/json',
) => {

  const postData = async body => {

    const isFormData =
      typeof FormData !== 'undefined' &&
      body instanceof FormData;

    let actualEndpoint = urlWithOutBase;

    let actualBody = body;

    if (
      body &&
      typeof body === 'object' &&
      !isFormData &&
      body.__endpoint__
    ) {
      actualEndpoint = body.__endpoint__;

      const {
        __endpoint__,
        ...cleanBody
      } = body;

      actualBody = cleanBody;
    }

    const requestHeaders = {
      Accept: 'application/json',

      ...customConfig?.headers,
    };

    if (isFormData) {
      delete requestHeaders['Content-Type'];
      delete requestHeaders['content-type'];
    } else {
      requestHeaders['Content-Type'] = contentType;
    }

    const requestConfig = {
      ...customConfig,

      method,

      url: actualEndpoint,

      data: actualBody,

      headers: requestHeaders,
    };

    const response = await apiClient.request(
      requestConfig,
    );

    return response.data;
  };

  return useMutation({
    mutationFn: postData,

    onSuccess: responseData => {
      whenSuccess?.(responseData);
    },

    onError: error => {
      console.log(
        'Error sending data:',
        error?.response?.data ||
        error?.message,
      );

      whenError?.(error);
    },
  });
};

export default useApi;