import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';
import { BASE_URL } from './Apipath';
import toast from 'react-hot-toast';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken: string | null = localStorage.getItem('token');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor with rate limit handling
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle rate limiting
        if (error.response?.status === 429) {
            const message = (error.response?.data as any)?.error || 'Too many requests. Please try again later.';
            toast.error(message);
            console.error('Rate limit exceeded:', message);
        } 
        else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout. Please try again!');
            toast.error('Request timeout. Please try again!');
        } 
        else if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Logging out...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden: You do not have access to this resource.');
                    toast.error('You do not have permission to access this resource.');
                    break;
                case 413:
                    console.error('File too large');
                    toast.error('File size too large. Maximum size is 10MB.');
                    break;
                case 500:
                    console.error('Internal Server Error.');
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    console.error(`Error ${error.response.status}: ${error.message}`);
            }
        } else {
            console.error('Network Error: Please check your connection.');
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
