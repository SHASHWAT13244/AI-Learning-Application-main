import { NextFunction, Response } from 'express';
import Document from '../model/document';
import {
    chatWithContext,
    explainConceptByGemini,
    generateGeminiFlashCards,
    generateGeminiQuiz,
    generateSummaryByGemini,
} from '../utils/geminiServices';
import FlashCard from '../model/flashCard';
import Quiz from '../model/quiz';
import { FLASH_CARD_TYPES, GENERATED_FLASHCARD_RESPONSE_TYPES } from '../types';
import { findRelevantChunks } from '../utils/textChunker';
import ChatHistory from '../model/chatHistory';

//@desc   generate flashcrds from api
//@route  POST /api/ai/generate-flashcards
//@access private
export const generateFlashCards = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId',
                statusCode: 400,
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Docuemnt not found or not ready',
                statusCode: 404,
            });
        }

        //Generate flashCards using gemini services
        const cards: GENERATED_FLASHCARD_RESPONSE_TYPES[] =
            await generateGeminiFlashCards({
                text: document.extactedText,
                count: parseInt(count),
            });

        //save to db
        const flashCardSet = await FlashCard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(c => ({
                question: c.question,
                answer: c.answer,
                difficult: c.difficulty,
                reviewCount: 0,
                isStarred: false,
            })),
        });
        res.status(201).json({
            success: true,
            data: flashCardSet,
            message: 'FlashCard generated Successfully',
        });
    } catch (error) {
        next(error);
    }
};

//@desc   generate flashcrds from api
//@route  POST /api/ai/generate-quiz
//@access private
export const generateQuiz = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentId, count = 5, title } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId',
                statusCode: 400,
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Docuemnt not found or not ready',
                statusCode: 404,
            });
        }

        //Generate quiz using gemini
        const questions: any = await generateGeminiQuiz({
            text: document.extactedText,
            count: parseInt(count),
        });

        //save to db
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title}-Quiz`,
            questions: questions,
            toltalQuestions: questions.length,
            userAnswers: [],
            score: 0,
        });

        res.status(200).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully',
        });
    } catch (error) {
        next(error);
    }
};

//@desc   generate flashcrds from api
//@route  POST /api/ai/generate-summary
//@access private
export const generateSummary = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId',
                statusCode: 400,
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Docuemnt not found or not ready',
                statusCode: 404,
            });
        }

        //Generate summary
        const summary = await generateSummaryByGemini(document.extactedText);

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary,
            },
        });
    } catch (error) {
        next(error);
    }
};

//@desc   generate flashcrds from api
//@route  POST /api/ai/chat
//@access private
export const chat = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { documentId, question } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId and question',
                statusCode: 400,
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Docuemnt not found or not ready',
                statusCode: 404,
            });
        }

        //relevent chunks
        const releventChunks = findRelevantChunks({
            chunks: document.chunks,
            query: question,
            maxChunks: 3,
        });
        const chunkIndex = releventChunks.map(d => d.chunkIndex);

        //Get or create chat history
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id,
        });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: [],
            });
        }

        //generate response using gemini
        const answer = await chatWithContext({
            question: question,
            chunk: releventChunks,
        });

        //save convo
        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
                releventChunks: [],
            },
            {
                role: 'assistant',
                content: answer,
                timestamp: new Date(),
                releventChunks: chunkIndex,
            }
        );

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                releventChunks: chunkIndex,
                chatHistoryId: chatHistory._id,
            },
        });
    } catch (error) {
        next(error);
    }
};

//@desc   generate flashcrds from api
//@route  POST /api/ai/explain-concept
//@access private
export const explainConcept = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId and concept',
                statusCode: 400,
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Docuemnt not found or not ready',
                statusCode: 404,
            });
        }

        //Find relevant chunk for the concept
        const releventChunks = findRelevantChunks({
            chunks: document.chunks,
            query: concept,
            maxChunks: 3,
        });
        const context = releventChunks.map(c => c.content).join('\n\n');

        //Generaye explanation using gemini
        const explanation = await explainConceptByGemini({ concept, context });

        res.status(200).json({
            success: true,
            data: {
                concept,
                context,
                releventChunks: releventChunks.map(c => c.chunkIndex),
            },
            messgae: 'Explanation generated successfully',
        });
    } catch (error) {
        next(error);
    }
};

//@desc   generate flashcrds from api
//@route  GET /api/ai/chat-history/:documentId
//@access private
export const getChatHistory = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentId } = req.params;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId',
                statusCode: 400,
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId,
        }).select('messages');

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No chat history found for this document',
            });
        }
        return res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully',
        });
    } catch (error) {
        next(error);
    }
};
