import { NextFunction, Response } from 'express';
import User from '../model/user';
import Document from '../model/document';
import FlashCard from '../model/flashCard';
import Quiz from '../model/quiz';

//@desc   Get all users (admin only)
//@route  GET /api/admin/users
//@access Private/Admin
export const getAllUsers = async (req: any, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const documentCount = await Document.countDocuments({ userId: user._id });
                const flashcardCount = await FlashCard.countDocuments({ userId: user._id });
                const quizCount = await Quiz.countDocuments({ userId: user._id });
                
                return {
                    ...user.toObject(),
                    documentCount,
                    flashcardCount,
                    quizCount,
                };
            })
        );
        
        res.status(200).json({
            success: true,
            count: usersWithStats.length,
            data: usersWithStats,
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Get single user by ID (admin only)
//@route  GET /api/admin/users/:id
//@access Private/Admin
export const getUserById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }
        
        const documentCount = await Document.countDocuments({ userId: user._id });
        const flashcardCount = await FlashCard.countDocuments({ userId: user._id });
        const quizCount = await Quiz.countDocuments({ userId: user._id });
        
        res.status(200).json({
            success: true,
            data: {
                ...user.toObject(),
                documentCount,
                flashcardCount,
                quizCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Delete user (admin only)
//@route  DELETE /api/admin/users/:id
//@access Private/Admin
export const deleteUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }
        
        // Prevent admin from deleting themselves
        if (user.email === 'admin@example.com') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete the main admin account',
                statusCode: 400,
            });
        }
        
        // Delete all user's data
        await Document.deleteMany({ userId: user._id });
        await FlashCard.deleteMany({ userId: user._id });
        await Quiz.deleteMany({ userId: user._id });
        
        await user.deleteOne();
        
        res.status(200).json({
            success: true,
            message: `User ${user.username} and all associated data deleted successfully`,
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Get system statistics (admin only)
//@route  GET /api/admin/stats
//@access Private/Admin
export const getSystemStats = async (req: any, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDocuments = await Document.countDocuments();
        const totalFlashcards = await FlashCard.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const completedQuizzes = await Quiz.countDocuments({ completedAt: { $ne: null } });
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        
        const topUsers = await Document.aggregate([
            { $group: { _id: '$userId', documentCount: { $sum: 1 } } },
            { $sort: { documentCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $project: { 'user.username': 1, 'user.email': 1, documentCount: 1 } },
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDocuments,
                totalFlashcards,
                totalQuizzes,
                completedQuizzes,
                recentSignups,
                topUsers,
            },
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Get all documents (admin only)
//@route  GET /api/admin/documents
//@access Private/Admin
export const getAllDocuments = async (req: any, res: Response, next: NextFunction) => {
    try {
        const documents = await Document.find({})
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Delete any document (admin only)
//@route  DELETE /api/admin/documents/:id
//@access Private/Admin
export const deleteAnyDocument = async (req: any, res: Response, next: NextFunction) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });
        }
        
        // Delete associated flashcards and quizzes
        await FlashCard.deleteMany({ documentId: document._id });
        await Quiz.deleteMany({ documentId: document._id });
        
        // Delete file from Vercel Blob storage
        try {
            if (document.fileName) {
                const { del } = await import('@vercel/blob');
                await del(document.fileName, { 
                    token: process.env.BLOB_READ_WRITE_TOKEN 
                });
            }
        } catch (blobError) {
            console.error('Error deleting file from blob storage:', blobError);
        }
        
        await document.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Document deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
