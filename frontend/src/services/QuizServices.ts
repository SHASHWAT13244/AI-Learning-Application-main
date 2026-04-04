import type {
    DeleteDocumentResponseTypes,
    getQuizzesResponseTypes,
    getQuizzesResponseTypesForDocs,
    getQuizzesResultsTypes,
    SubmitQuizApiTypes,
} from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const getAllQuizzes = async (): Promise<getQuizzesResponseTypesForDocs> => {
    try {
        const response = await axiosInstance.get<getQuizzesResponseTypesForDocs>(
            API_PATHS.QUIZZES.GET_ALL_QUIZZES
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getQuizzessForDocs = async (
    documentId: string
): Promise<getQuizzesResponseTypesForDocs> => {
    try {
        const response =
            await axiosInstance.get<getQuizzesResponseTypesForDocs>(
                API_PATHS.QUIZZES.GET_ALL_QUIZZES_FOR_DOC(documentId)
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getQuizzesById = async (
    quizId: string
): Promise<getQuizzesResponseTypes> => {
    try {
        const response = await axiosInstance.get<getQuizzesResponseTypes>(
            API_PATHS.QUIZZES.GET_ALL_QUIZZES_BY_ID(quizId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const SubmitQuiz = async (
    quizId: string,
    answers: any
): Promise<SubmitQuizApiTypes> => {
    try {
        const response = await axiosInstance.post<SubmitQuizApiTypes>(
            API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
            { answers }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getQuizResutls = async (
    quizId: string
): Promise<getQuizzesResultsTypes> => {
    try {
        const response = await axiosInstance.get<getQuizzesResultsTypes>(
            API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const deleteQuiz = async (
    quizId: string
): Promise<DeleteDocumentResponseTypes> => {
    try {
        const response =
            await axiosInstance.delete<DeleteDocumentResponseTypes>(
                API_PATHS.QUIZZES.DELETE_QUIZ(quizId)
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const QuizServices = {
    getAllQuizzes,
    getQuizzessForDocs,
    getQuizzesById,
    SubmitQuiz,
    getQuizResutls,
    deleteQuiz,
};
export default QuizServices;
