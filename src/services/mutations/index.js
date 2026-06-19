import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { API_CONFIG } from '../../config/config';

const useApi = (
  urlWithOutBase,
  userToken,
  customConfig = {},
  whenSuccess,
  whenError,
  method = 'post',
  contentType = 'application/json',
) => {

  const navigation = useNavigation();
  const defaultConfig = {
    method,
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      'Content-Type': contentType,
      Authorization: userToken ? `Bearer ${userToken}` : '',
    },
  };

  const config = {
    ...defaultConfig,
    ...customConfig,
  };

  const postData = async body => {
    try {

      const isFormData = body instanceof FormData;

      let actualEndpoint = urlWithOutBase;
      let actualBody = body;

      if (body && typeof body === 'object' && !isFormData && body.__endpoint__) {
        actualEndpoint = body.__endpoint__;
        const { __endpoint__, ...cleanBody } = body;
        actualBody = cleanBody;
      }

      const response = await axios.request({
        url: actualEndpoint,
        data: actualBody,
        ...config,
        headers: {
          ...config.headers,
          ...(isFormData ? {} : { 'Content-Type': contentType }), // ✅ FIX
        },
      });

      return response.data;

    } catch (error) {
      const message = error?.response?.data?.message;

      if (['Account blocked', 'Account removed'].includes(message)) {
        navigation.navigate("DisableUserProfile", error?.response?.data);
      }

      throw new Error(message || error.message || 'Something went wrong try again later.');
    }
  };

  return useMutation({
    mutationFn: postData,
    onSuccess: responseData => {
      whenSuccess(responseData);
    },
    onError: err => {
      console.log('Error sending data:', err?.message);
      whenError(err);
    },
  });
};

export default useApi;
