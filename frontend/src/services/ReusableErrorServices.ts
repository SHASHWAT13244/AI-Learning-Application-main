import axios from 'axios';
import type { ApiError } from '../types';

export const handleAPIErrLogic = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        if (error.response?.data) {
            // Return the specific error message from backend
            // Assuming backend returns { message: "..." } or similar
            return error.response.data as ApiError;
        }
        // 2. Check if it was a timeout or network issue (no response)
        return {
            message: error.message || 'Network Error. Please try again.',
            status: error.response?.status,
        };
    }
    // 3. Handle non-Axios errors (e.g., coding errors in your try block)
    return {
        message: 'An unexpected error occurred.',
    };
};
