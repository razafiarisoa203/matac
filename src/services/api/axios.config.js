import axios from 'axios';
import Cookies from "js-cookie";
import { ENV } from "../../config/env";

const axiosConfig = axios.create({
    baseURL: ENV.API_BASE_URL,
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        // Get the token from local storage or cookies or SSO session storage
        const token = localStorage.getItem('access_token') || Cookies.get('access_token') || sessionStorage.getItem('app_jwt');
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