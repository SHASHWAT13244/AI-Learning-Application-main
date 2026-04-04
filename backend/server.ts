import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import errorHanlder from './middleware/errorHandler';
import AuthRouter from './routes/authRoutes';
import DocumentRouter from './routes/documentRoutes';
import flashcardRouter from './routes/flashCardRoutes';
import AIRouter from './routes/aiRoutes';
import QuizRouter from './routes/quizRoutes';
import ProgressRouter from './routes/progressRouter';
import {
    corsOptions,
    helmetConfig,
    sanitizeInput,
    xssProtection,
    preventParameterPollution,
    requestSizeLimiter
} from './middleware/security';
import {
    generalLimiter,
    authLimiter,
    aiLimiter,
    uploadLimiter,
    quizLimiter
} from './config/rateLimit';

const app = express();

// ============================================
// IMPORTANT: Trust proxy for Render
// ============================================
app.set('trust proxy', 1);

// ============================================
// SECURITY MIDDLEWARES
// ============================================
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(sanitizeInput);
app.use(xssProtection);
app.use(preventParameterPollution);
app.use(requestSizeLimiter);

// Apply rate limiters
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/ai', aiLimiter);
app.use('/api/document/upload', uploadLimiter);
app.use('/api/quiz/:id/submit', quizLimiter);

// ============================================
// EXISTING CODE
// ============================================
connectDB();

console.log('Client URL:', process.env.CLIENT_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/document', DocumentRouter);
app.use('/api/flashcard', flashcardRouter);
app.use('/api/ai', AIRouter);
app.use('/api/quiz', QuizRouter);
app.use('/api/progress', ProgressRouter);

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AI Learning Platform API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            documents: '/api/document',
            flashcards: '/api/flashcard',
            ai: '/api/ai',
            quizzes: '/api/quiz',
            progress: '/api/progress'
        }
    });
});

// Error handler
app.use(errorHanlder);

// 404 error
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.url}`,
        statusCode: 404,
    });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown for Render
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
    const error = reason instanceof Error ? reason.message : 'Unknown error in unhandledRejection';
    console.error(`Error: ${error}`);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (error: Error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    server.close(() => {
        process.exit(1);
    });
});
