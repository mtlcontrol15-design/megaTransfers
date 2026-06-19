import axios from 'axios';
import { API_CONFIG } from '../../config/config';
import { EndPoints } from '../EndPoints';

export const markMessagesAsRead = async (userId) => {
  try {
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}${EndPoints.markRead}/${userId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    // console.log('Mark read success:', response.data);
    return response.data;
  } catch (error) {
    console.log("Mark read error:", error);
    throw error;
  }
};
