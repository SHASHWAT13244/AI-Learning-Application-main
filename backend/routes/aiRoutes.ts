import express from 'express';
import protect from '../middleware/auth';
import {
    chat,
    explainConcept,
    generateFlashCards,
    generateQuiz,
    generateSummary,
    getChatHistory,
} from '../controller/aiController';

const AIRouter = express.Router();

AIRouter.use(protect);

AIRouter.post('/generate-flashcards', generateFlashCards);
AIRouter.post('/generate-quiz', generateQuiz);
AIRouter.post('/generate-summary', generateSummary);
AIRouter.post('/chat', chat);
AIRouter.post('/explain-concept', explainConcept);
AIRouter.get('/chat-history/:documentId', getChatHistory);

export default AIRouter;
