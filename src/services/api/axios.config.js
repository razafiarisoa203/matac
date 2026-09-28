import axios from 'axios';
import Cookies from "js-cookie";
import { ENV } from "../../config/env";

const axiosConfig = axios.create({
    baseURL: ENV.API_BASE_URL,
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        // Prefer the current SSO application token over legacy token storage.
        const token = sessionStorage.getItem('app_jwt') || localStorage.getItem('access_token') || Cookies.get('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error("[API] Requête refusée (401):", {
                method: error.config?.method,
                url: error.config?.url,
            });
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;