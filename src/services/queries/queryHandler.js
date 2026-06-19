import { useSelector } from 'react-redux';
import useQueryApi from './useQueryApi';

const queryHandler = (url, enabled) => {
  const { token } = useSelector(state => state.userReducer)
  const userToken = token
  // console.log("userToken======?>",userToken);
  // console.log("FINAL URL:", url);

  return useQueryApi(['mainData', url], url, userToken, {}, enabled);
};

export default queryHandler;
