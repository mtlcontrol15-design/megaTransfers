import useQueryApi from './useQueryApi';
import { useSelector } from 'react-redux';

const useQueryHandler = (url, options = {}) => {
  const { token } = useSelector(state => state.userReducer)
  const userToken = token
  // console.log("useQueryHandler",userToken);
  // console.log('=========',url);
  // console.log("FINAL URL:", url);


  const {
    enabled = true,
    keepPrevious = true,
    queryParams = { limit: 0 },
    useInfiniteQueryFlag = true,
    customConfig = {}
  } = options;

  return useQueryApi(
    ['mainData', url, queryParams], // queryKey (include queryParams for proper caching)
    url, // urlWithOutBase
    userToken, // userToken
    customConfig, // customConfig
    enabled, // enabled - now configurable
    keepPrevious, // keepPrevious
    queryParams, // queryParams
    useInfiniteQueryFlag // useInfiniteQueryFlag
  );
};

export default useQueryHandler;