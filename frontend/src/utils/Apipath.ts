export const BASE_URL = import.meta.env.VITE_API_ROOTURL;

export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GET_PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/profile',
        CHANGE_PASSWORD: '/api/auth/change-password',
    },
    DOCUMENTS: {
        GET_DOCUMENTS: '/api/document',
        UPLOAD: '/api/document/upload',
        GET_DOCUMENT_BY_ID: (id: string) => `/api/document/${id}`,
        DELETE_DOCUMENT_BY_ID: (id: string) => `/api/document/${id}`,
    },
    AI: {
        GENERATE_FLASHCARDS: '/api/ai/generate-flashcards',
        GENERATE_QUIZ: '/api/ai/generate-quiz',
        GENERATE_SUMMARY: '/api/ai/generate-summary',
        CHAT: '/api/ai/chat',
        EXPLAIN_CONCEPT: '/api/ai/explain-concept',
        GET_CHAT_HISTORY: (documentId: string) =>
            `/api/ai/chat-history/${documentId}`,
    },
    FLASHCARDS: {
        GET_ALL_FLASHCARDS: `/api/flashcard`,
        GET_FLASHCARDS_FOR_DOC: (id: string) => `/api/flashcard/${id}`,
        REVIEW_FLASHCARDS: (cardId: string) =>
            `/api/flashcard/${cardId}/review`,
        TOGGLE_STAR: (cardId: string) => `/api/flashcard/${cardId}/star`,
        DELETE_FLASHCARD: (id: string) => `/api/flashcard/${id}`,
    },
    QUIZZES: {
        GET_ALL_QUIZZES_FOR_DOC: (documentId: string) =>
            `/api/quiz/document/${documentId}`,
        GET_ALL_QUIZZES_BY_ID: (quizId: string) => `/api/quiz/${quizId}`,
        SUBMIT_QUIZ: (id: string) => `/api/quiz/${id}/submit`,
        GET_QUIZ_RESULTS: (id: string) => `/api/quiz/${id}/results`,
        DELETE_QUIZ: (id: string) => `/api/quiz/${id}`,
    },
    PROGRESS: {
        GET_DASHBOARD: `/api/progress/dashboard`,
    },
};
