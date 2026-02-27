/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    DeleteDocumentResponseTypes,
    GetDocumentsResponseTypes,
    UploadDocumentsResponseTypes,
} from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const getDocuments = async (): Promise<GetDocumentsResponseTypes> => {
    try {
        const response = await axiosInstance.get<GetDocumentsResponseTypes>(
            API_PATHS.DOCUMENTS.GET_DOCUMENTS
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const uploadDocuments = async (
    formData: any
): Promise<UploadDocumentsResponseTypes> => {
    try {
        const response = await axiosInstance.post<UploadDocumentsResponseTypes>(
            API_PATHS.DOCUMENTS.UPLOAD,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const deleteDocument = async (
    documentId: string
): Promise<DeleteDocumentResponseTypes> => {
    try {
        const response =
            await axiosInstance.delete<DeleteDocumentResponseTypes>(
                API_PATHS.DOCUMENTS.DELETE_DOCUMENT_BY_ID(documentId)
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getDocumentById = async (
    documentId: string
): Promise<UploadDocumentsResponseTypes> => {
    try {
        const response = await axiosInstance.get<UploadDocumentsResponseTypes>(
            API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const DocuemntServices = {
    getDocuments,
    uploadDocuments,
    deleteDocument,
    getDocumentById,
};

export default DocuemntServices;
