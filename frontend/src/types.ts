/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface userTypes {
    username: string;
    email?: string;
    password?: string;
    profileImage?: string | null;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserContextTypes {
    user: null | userTypes;
    loading: boolean;
    isAuthenticated: boolean;
    login: (userData: userTypes, token: string) => void;
    logout: () => void;
    updateUser: (updatedUserData: userTypes) => void;
    checkAuthStatuts: () => Promise<void>;
}

export interface ParentReactNode {
    children: ReactNode;
}
export interface ApiError {
    message: string;
    status?: number;
    [key: string]: any;
}
export interface UserTypes {
    id: string;
    username: string;
    email: string;
    profileImage?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface LoginApiTypes {
    email: string;
    password: string | number;
}

export interface LoginResponseTypes {
    success?: boolean;
    user: UserTypes;
    token: string;
    message: string;
}
export interface SignupApiTypes {
    username: string;
    email: string;
    password: string | number;
}
export interface SignUpResponseTypes {
    success?: boolean;
    data: {
        user: UserTypes;
        token: string;
    };
    message: string;
}

export interface GetProfileResponseTypes {
    success?: boolean;
    data: UserTypes;
    message?: 'Profile updated successfully';
}

export interface PasswordChangeApiTypes {
    currentPassword: string;
    newPassword: string;
}

export interface PasswordResponseTypes {
    success: boolean;
    message: string;
}

export interface GenerateFlashCardsResponseTypes {
    success: boolean;
    data: any;
    message: string;
}

export interface GenerateQuizResponseTypes {
    success: boolean;
    data: any;
    message: string;
}

export interface GenerateSummaryResponseTypes {
    success: boolean;
    data: {
        documentId: string;
        title: string;
        summary: string;
    };
    message: string;
}
export interface GenerateChatResponseTypes {
    success: boolean;
    data: {
        question: string;
        answer: string;
        releventChunks: number;
        chatHistoryId: string;
    };
    message: string;
}
export interface GenerateExplainConceptResponseTypes {
    success?: boolean;
    data: {
        concept: string;
        context: string;
        releventChunks: number[] | string[];
    };
    message?: string;
}

export interface GetChatHistoryResponseTypes {
    success: boolean;
    data: any;
    message: string;
}

export interface GetDocumentsResponseTypes {
    success: boolean;
    count: number;
    data: DocumentPayloadTypes[];
}

export interface UploadDocumentsResponseTypes {
    success: boolean;
    data: DocumentPayloadTypes;
    message?: string;
}

export interface DeleteDocumentResponseTypes {
    success: boolean;
    message: string;
}

export interface CardsType {
    question: string;
    answer: string;
    difficulty: string;
    lastReviewed: Date;
    reviewCount: number;
    isStarred: boolean;
    _id: string;
}
export interface FlashCardPayloadTypes {
    _id: string;
    userId: string;
    documentId: string | any;
    cards: CardsType[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
}
export interface GetAllFlashCardpayloadTypes {
    _id: string;
    userId: string;
    documentId: {
        _id: string;
        title: string;
    };
    cards: CardsType[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
}
export interface FlashCardSetsResponseTypes {
    success: boolean;
    count: number;
    data: FlashCardPayloadTypes[];
}
export interface GetAllFlashCardSetsResponseTypes {
    success: boolean;
    count: number;
    data: GetAllFlashCardpayloadTypes[];
}

export interface ReviewFlashcardResponseTypes {
    success: boolean;
    data: FlashCardPayloadTypes;
    message: string;
}

export interface chunkPayload {
    content: string;
    pageNumber: number;
    chunkIndex: number;
}

export interface DocumentPayloadTypes {
    _id: string;
    userId: UserTypes;
    title: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    extactedText: string;
    chunks: chunkPayload[];
    uploadDate: Date | null;
    lastAccessed: Date | null;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    flashcardCount?: number;
    quizCount?: number;
}
export interface Questionspayload {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
}
export interface AnswersPayload {
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
    answerAt: Date;
}
export interface QuizReults {
    id: string;
    title: string;
    document: {
        _id: string;
        title: string;
    };
    score: number;
    totalQuestions: number;
    completedAt: Date | null;
}

export interface ResultTypes {
    questionIndex: number;
    question: string;
    options: string[];
    correctAnswer: string;
    selectedAnswer: string;
    isCorrect: boolean;
    explanation: string;
}

export interface QuizPayloadTypes {
    _id: string;
    userId: string;
    documentId: string;
    title: string;
    questions: Questionspayload[];
    userAnswers: AnswersPayload[];
    score: number;
    toltalQuestions: number;
    completedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface getQuizzesResponseTypesForDocs {
    success: boolean;
    count?: number;
    data: QuizPayloadTypes[];
}
export interface getQuizzesResponseTypes {
    success: boolean;
    count?: number;
    data: QuizPayloadTypes;
}

export interface SubmitQuizApiTypes {
    success: boolean;
    data: QuizPayloadTypes;
    message: string;
}
export interface GetQuizResultsPayloadTypes {
    quiz: QuizReults;
    results: ResultTypes[];
}

export interface getQuizzesResultsTypes {
    success: boolean;
    data: GetQuizResultsPayloadTypes;
}
export interface RecentActitivityPayloadTypes {
    documents: DocumentPayloadTypes[];
    quizzes: QuizPayloadTypes[];
}

export interface DashBoardPayloadTypes {
    success: boolean;
    data: {
        overview: {
            totalDocuments: number;
            totalFlashCardSets: number;
            totalFlashCards: number;
            reviewFlashCards: number;
            starredFlashCard: number;
            totalQuizzes: number;
            completedQuizzes: number;
            averageScore: number;
            studyStreak: number;
        };

        recentActivity: RecentActitivityPayloadTypes;
    };
}

//button props
export interface ButttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md';
    children: ReactNode;
}

export interface TabsTypes {
    tab: {
        name: string;
        label: string;
        content: ReactNode;
    }[];
    activeTab: string;
    setActiveTab: (item: string) => void;
}

export interface chatMessagesType {
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
    releventChunks?: string | null | number;
}
