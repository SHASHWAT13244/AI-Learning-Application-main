import { NextFunction, Response } from 'express';
import Document from '../model/document';
import FlashCard from '../model/flashCard';
import Quiz from '../model/quiz';

//@desc   Get User learning statistics
//@route  GET /api/progress/dashboard
//@access private
export const getDashboard = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user._id;

        //Get counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashCardSets = await FlashCard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({
            userId,
            completedAt: { $ne: null },
        });

        //Get flashcards statistics
        const flashCardSets = await FlashCard.find({ userId });
        let totalFlashCards = 0;
        let reviewFlashCards = 0;
        let starredFlashCard = 0;

        flashCardSets.forEach(d => {
            totalFlashCards += d.cards.length;
            reviewFlashCards += d.cards.filter(c => c.reviewCount > 0).length;
            starredFlashCard += d.cards.filter(c => c.isStarred).length;
        });

        //Get quiz statistics
        const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
        const averageScore =
            quizzes.length > 0
                ? Math.round(
                      quizzes.reduce((sum, q) => sum + q.score, 0) /
                          quizzes.length
                  )
                : 0;

        //Recent activity
        const recentDocuments = await Document.find({ userId })
            .sort({ lastAccessed: -1 })
            .limit(5)
            .select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('documentId', 'title')
            .select('title score totalQuestions completedAt');

        //study streak (simplified - in production, track daily  activity)
        const studyStreak = Math.floor(Math.random() * 7) + 1; //Mock-data

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashCardSets,
                    totalFlashCards,
                    reviewFlashCards,
                    starredFlashCard,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak,
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
