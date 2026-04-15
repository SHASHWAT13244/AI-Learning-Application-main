import type { 
    AdminDocumentsResponseTypes, 
    AdminStatsResponseTypes, 
    AdminUsersResponseTypes 
} from '../types';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

export const ADMIN_API_PATHS = {
    GET_ALL_USERS: '/api/admin/users',
    GET_USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
    DELETE_USER: (id: string) => `/api/admin/users/${id}`,
    GET_SYSTEM_STATS: '/api/admin/stats',
    GET_ALL_DOCUMENTS: '/api/admin/documents',
    DELETE_DOCUMENT: (id: string) => `/api/admin/documents/${id}`,
};

const getAllUsers = async (): Promise<AdminUsersResponseTypes> => {
    try {
        const response = await axiosInstance.get<AdminUsersResponseTypes>(
            ADMIN_API_PATHS.GET_ALL_USERS
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosInstance.delete(
            ADMIN_API_PATHS.DELETE_USER(userId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getSystemStats = async (): Promise<AdminStatsResponseTypes> => {
    try {
        const response = await axiosInstance.get<AdminStatsResponseTypes>(
            ADMIN_API_PATHS.GET_SYSTEM_STATS
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getAllDocuments = async (): Promise<AdminDocumentsResponseTypes> => {
    try {
        const response = await axiosInstance.get<AdminDocumentsResponseTypes>(
            ADMIN_API_PATHS.GET_ALL_DOCUMENTS
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const deleteDocument = async (documentId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosInstance.delete(
            ADMIN_API_PATHS.DELETE_DOCUMENT(documentId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const AdminServices = {
    getAllUsers,
    deleteUser,
    getSystemStats,
    getAllDocuments,
    deleteDocument,
};

export default AdminServices;
