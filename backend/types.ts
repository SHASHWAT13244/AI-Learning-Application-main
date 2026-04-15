import { Document, Types } from 'mongoose';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface USER_TYPES {
    username: string;
    email: string;
    password: string;
    profileImage: string | null;
    role?: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;

    matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface QUIZ_TYPES extends Document {
    userId: Types.ObjectId | USER_TYPES;
    documentId: Types.ObjectId | DOCUMENT_TYPES;
    title: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
        difficulty: string;
    }[];
    userAnswers: {
        questionIndex: number;
        selectedAnswer: string;
        isCorrect: boolean;
        answerAt: Date;
    }[];
    score: number;
    toltalQuestions: number;
    completedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FLASH_CARD_TYPES extends Document {
    userId: Types.ObjectId | USER_TYPES;
    documentId: Types.ObjectId | DOCUMENT_TYPES;
    cards: {
        question: string;
        answer: string;
        difficulty: string;
        lastReviewed: Date | null;
        reviewCount: number;
        isStarred: Boolean;
        _id?: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DOCUMENT_TYPES extends Document {
    userId: Types.ObjectId | USER_TYPES;
    title: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    extactedText: string;
    chunks: {
        content: string;
        pageNumber: number;
        chunkIndex: number;
    }[];
    uploadDate: Date | null;
    lastAccessed: Date | null;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    flashcardCount?: number;
    quizCount?: number;
}

export interface CHAT_HISTORY_TYPES extends Document {
    userId: Types.ObjectId | USER_TYPES;
    documentId: Types.ObjectId | DOCUMENT_TYPES;
    messages: {
        role: string;
        content: string;
        timestamp: Date | null;
        releventChunks: number[];
    }[];
}

export interface TEXT_CHUNK_TYPES {
    content: string;
    chunkIndex: number;
    pageNumber: number;
    _id?: string;
}
export interface GENERATED_REQUEST_TYPES {
    text: string;
    count?: number;
}
export interface GENERATED_FLASHCARD_RESPONSE_TYPES {
    question: string;
    answer: string;
    difficulty: Difficulty;
}

export interface GENERATED_QUIZ_RESPONSE_TYPES {
    question: string;
    correctAnswer: string;
    explanation: string;
    difficulty: Difficulty;
    options: Array<Object>;
}
