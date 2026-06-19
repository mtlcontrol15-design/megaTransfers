/* eslint-disable react-hooks/rules-of-hooks */
import useApi from '.';

export const mutationHandler = (url, userToken, whenSuccess, whenError, method) => {
  // console.log("userToken=mutaion=========+>",userToken);
  // console.log("url=mutaion=========+>",url);

  return useApi(url, userToken, {}, whenSuccess, whenError, method);
};
