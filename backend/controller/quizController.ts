import { Request, Response, NextFunction } from 'express';
import Quiz from '../model/quiz';
import { QUIZ_TYPES } from '../types';

//@desc   Get all quizzes for a user
//@route  GET /api/quiz/
//@access private
export const getAllQuizzes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Get all quiz by document ID
//@route  GET /api/quiz/document/:documentId
//@access private
export const getQuizzes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Get quiz by id
//@route  GET /api/quiz/:id
//@access private
export const getQuizById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('error', error);
    next(error);
  }
};

//@desc   Handle submit quiz
//@route  POST /api/quiz/:id/submit
//@access private
export const submitQuiz = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide answers array',
        statusCode: 400,
      });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz already completed',
        statusCode: 400,
      });
    }

    // Process answers
    let correctCount = 0;
    const userAnswers: QUIZ_TYPES['userAnswers'] = [];

    for (const answer of answers) {
      const { questionIndex, selectedAnswer } = answer;

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        
        // Fix: Compare the actual answer text
        let isCorrect = false;
        
        // If correctAnswer is in format "O1", "O2", etc. (from Gemini generation)
        if (question.correctAnswer && question.correctAnswer.match(/^O[1-4]$/i)) {
          const correctOptionIndex = parseInt(question.correctAnswer.substring(1)) - 1;
          const correctOptionText = question.options[correctOptionIndex];
          isCorrect = selectedAnswer === correctOptionText;
        } else {
          // Direct text comparison
          isCorrect = selectedAnswer === question.correctAnswer;
        }

        if (isCorrect) correctCount++;

        userAnswers.push({
          questionIndex,
          selectedAnswer: selectedAnswer || 'No answer selected',
          isCorrect,
          answerAt: new Date(),
        });
      }
    }

    // Calculate score
    const score = Math.round((correctCount / quiz.toltalQuestions) * 100);

    // Update quiz
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.toltalQuestions,
        percentage: score,
        userAnswers,
      },
      message: 'Quiz submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Get quiz results
//@route  GET /api/quiz/:id/results
//@access private
export const getQuizResults = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('documentId', 'title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: 'Quiz not completed yet',
        statusCode: 400,
      });
    }

    // Build detailed results
    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (q) => q.questionIndex === index
      );

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.toltalQuestions,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Delete a quiz
//@route  DELETE /api/quiz/:id
//@access private
export const deleteQuiz = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404,
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
