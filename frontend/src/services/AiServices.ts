/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    GenerateChatResponseTypes,
    GenerateExplainConceptResponseTypes,
    GenerateFlashCardsResponseTypes,
    GenerateQuizResponseTypes,
    GenerateSummaryResponseTypes,
    GetChatHistoryResponseTypes,
} from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const generateFlashcards = async (
    documentId: string,
    options?: any
): Promise<GenerateFlashCardsResponseTypes> => {
    try {
        const response =
            await axiosInstance.post<GenerateFlashCardsResponseTypes>(
                API_PATHS.AI.GENERATE_FLASHCARDS,
                { documentId, ...options }
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const generateQuiz = async (
    documentId: string,
    options: any
): Promise<GenerateQuizResponseTypes> => {
    try {
        const response = await axiosInstance.post<GenerateQuizResponseTypes>(
            API_PATHS.AI.GENERATE_QUIZ,
            { documentId, ...options }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const generateSummary = async (
    documentId: string
): Promise<GenerateSummaryResponseTypes> => {
    try {
        const response = await axiosInstance.post<GenerateSummaryResponseTypes>(
            API_PATHS.AI.GENERATE_SUMMARY,
            { documentId }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const chat = async (
    documentId: string,
    concept: string
): Promise<GenerateChatResponseTypes> => {
    try {
        const response = await axiosInstance.post<GenerateChatResponseTypes>(
            API_PATHS.AI.CHAT,
            { documentId, question: concept }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const explainConcept = async (
    documentId: string,
    concept: string
): Promise<GenerateExplainConceptResponseTypes> => {
    try {
        const response =
            await axiosInstance.post<GenerateExplainConceptResponseTypes>(
                API_PATHS.AI.EXPLAIN_CONCEPT,
                { documentId, concept }
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const getChatHistory = async (
    documentId: string
): Promise<GetChatHistoryResponseTypes> => {
    try {
        const response = await axiosInstance.get<GetChatHistoryResponseTypes>(
            API_PATHS.AI.GET_CHAT_HISTORY(documentId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const AiServices = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
};
export default AiServices;
