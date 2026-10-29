import axios from 'axios';

import { API_CONFIG } from '../config/config';
import { EndPoints } from './EndPoints';

import { store } from '../redux/store';

import { refreshAccessToken } from './tokenService';

import {
    handleBlockedAccountError,
    handleSessionExpired,
} from './accountStatusHandler';

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,

    headers: {
        Accept: 'application/json',
    },
});

// Attach the latest access token to every request.
apiClient.interceptors.request.use(
    config => {
        const { token } =
            store.getState().userReducer;

        // Do not attach the access token to refresh requests.
        if (config.url === EndPoints.tokenRefresh) {
            return config;
        }

        if (token) {
            config.headers.set(
                'Authorization',
                `Bearer ${token}`,
            );
        } else {
            config.headers.delete('Authorization');
        }

        return config;
    },

    error => Promise.reject(error),
);

// Handle expired access tokens automatically.
apiClient.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config;

        const status = error?.response?.status;

        // Preserve existing blocked-account handling.
        if (handleBlockedAccountError(error)) {
            return Promise.reject(error);
        }

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Do not refresh for login or refresh endpoints.
        if (
            originalRequest.url === EndPoints.login ||
            originalRequest.url === EndPoints.tokenRefresh
        ) {
            return Promise.reject(error);
        }

        // Only retry an unauthorized request once.
        if (
            status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const {
            token: currentToken,
            refreshToken,
        } = store.getState().userReducer;

        if (!refreshToken) {
            return Promise.reject(error);
        }

        try {
            const failedToken =
                originalRequest.headers?.get?.(
                    'Authorization',
                ) ||
                originalRequest.headers?.Authorization;

            const currentAuthorization = currentToken
                ? `Bearer ${currentToken}`
                : null;

            let newToken;

            // Another request may already have refreshed
            // the token while this request was failing.
            if (
                currentAuthorization &&
                failedToken &&
                failedToken !== currentAuthorization
            ) {
                newToken = currentToken;
            } else {
                const result = await refreshAccessToken();

                newToken = result.accessToken;
            }

            // Retry the original request with the new token.
            originalRequest.headers.set(
                'Authorization',
                `Bearer ${newToken}`,
            );

            console.log(
                '🔁 Retrying request:',
                originalRequest.url,
            );

            return apiClient(originalRequest);

        } catch (refreshError) {
            const refreshStatus =
                refreshError?.response?.status;

            // A failed refresh does not always mean
            // the session is invalid. Network errors,
            // for example, should not log the user out.
            if (refreshStatus === 401) {
                handleSessionExpired();
            }

            console.log(
                '❌ Request refresh failed:',
                refreshError?.response?.data ||
                refreshError?.message,
            );

            return Promise.reject(refreshError);
        }
    },
);

export default apiClient;