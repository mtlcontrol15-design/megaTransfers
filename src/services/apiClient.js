import axios from "axios";
import { API_CONFIG } from "../config/config";
import { EndPoints } from "./EndPoints";

export const saveLocationApi = async (payload, token) => {
    try {
        const response = await axios.request({
            url: `${API_CONFIG.BASE_URL}${EndPoints.saveLocation}`,
            method: "post",
            data: payload,
        });

        console.log("✅ Background API SUCCESS:", response?.data);
        return response.data;

    } catch (error) {
        console.log("❌ Background API ERROR:",
            error?.response?.data || error.message
        );
        throw error;
    }
};