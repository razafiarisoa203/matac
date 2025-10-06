import axios from 'axios';
import Cookies from "js-cookie";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        // Get the token from local storage or cookies
        const token = localStorage.getItem('access_token') || Cookies.get('access_token');
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
        // Gérer les erreurs de réponse
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            Cookies.remove("access_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;