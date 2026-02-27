import express from 'express';
import protect from '../middleware/auth';
import {
  deleteQuiz,
  getQuizById,
  getQuizResults,
  getQuizzes,
  submitQuiz,
} from '../controller/quizController';

const QuizRouter = express.Router();

//authencticate routes
QuizRouter.use(protect);

QuizRouter.get('/document/:documentId', getQuizzes);
QuizRouter.get('/:id', getQuizById);
QuizRouter.post('/:id/submit', submitQuiz);
QuizRouter.get('/:id/results', getQuizResults);
QuizRouter.delete('/:id', deleteQuiz);
export default QuizRouter;
