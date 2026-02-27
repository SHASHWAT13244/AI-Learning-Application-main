import type {
    DeleteDocumentResponseTypes,
    FlashCardSetsResponseTypes,
    GetAllFlashCardSetsResponseTypes,
    ReviewFlashcardResponseTypes,
} from '../types';
import { API_PATHS } from '../utils/Apipath';
import axiosInstance from '../utils/axiosInstance';
import { handleAPIErrLogic } from './ReusableErrorServices';

const getAllFlashCardSets =
    async (): Promise<GetAllFlashCardSetsResponseTypes> => {
        try {
            const response =
                await axiosInstance.get<GetAllFlashCardSetsResponseTypes>(
                    API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS
                );
            return response.data;
        } catch (error) {
            throw handleAPIErrLogic(error);
        }
    };

const flashCardDocsById = async (
    id: string
): Promise<FlashCardSetsResponseTypes> => {
    try {
        const response = await axiosInstance.get<FlashCardSetsResponseTypes>(
            API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(id)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const reviewFlashcard = async (
    cardId: string,
    cardIndex: number
): Promise<ReviewFlashcardResponseTypes> => {
    try {
        const response = await axiosInstance.post<ReviewFlashcardResponseTypes>(
            API_PATHS.FLASHCARDS.REVIEW_FLASHCARDS(cardId),
            { cardIndex }
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const toggleStar = async (
    cardId: string
): Promise<ReviewFlashcardResponseTypes> => {
    try {
        const response = await axiosInstance.put<ReviewFlashcardResponseTypes>(
            API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
        );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const deleteFlashCardSet = async (
    id: string
): Promise<DeleteDocumentResponseTypes> => {
    try {
        const response =
            await axiosInstance.delete<DeleteDocumentResponseTypes>(
                API_PATHS.FLASHCARDS.DELETE_FLASHCARD(id)
            );
        return response.data;
    } catch (error) {
        throw handleAPIErrLogic(error);
    }
};

const FlashCardServices = {
    getAllFlashCardSets,
    flashCardDocsById,
    reviewFlashcard,
    toggleStar,
    deleteFlashCardSet,
};
export default FlashCardServices;
