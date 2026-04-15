// const dotenv = require('dotenv');
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// // const { fileURLToPath } = require('url');
// const connectDB = require('./config/db');
// const errorHanlder = require('./middleware/errorHandler');
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
import AdminRouter from './routes/adminRoutes';

// // ES6  module__dirname altenative
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//initialize express app
const app = express();

//allowed origin

//Handle CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = [
        process.env.CLIENT_URL,
        'http://localhost:7000',
        'http://localhost:8000',
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigin.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
//Connect DB
connectDB();

console.log('process', process.env.CLIENT_URL);
//parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// //Server upload folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/auth', AuthRouter);
app.use('/api/document', DocumentRouter);
app.use('/api/flashcard', flashcardRouter);
app.use('/api/ai', AIRouter);
app.use('/api/quiz', QuizRouter);
app.use('/api/progress', ProgressRouter);
app.use('/api/admin', AdminRouter);

//error handler
app.use(errorHanlder);

//404error
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    statusCode: 404,
  });
});

// //generic error
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err);
//     res.status(500).json({
//         success: false,
//         error: err.message || 'Something went wrong',
//         statusCode: 500,
//     });
// });

//start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on(
  'unhandledRejection',
  (reason: {} | null | undefined, promise: Promise<any>) => {
    const error =
      reason instanceof Error
        ? reason.message
        : 'Unknown error in unhandledRejection';
    console.error(`Error: ${error}`);
    process.exit(1);
  }
);
