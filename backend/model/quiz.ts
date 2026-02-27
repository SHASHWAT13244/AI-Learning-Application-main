import { Schema, model } from 'mongoose';
import { QUIZ_TYPES } from '../types';

const QuizSchema = new Schema<QUIZ_TYPES>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        documentId: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: {
                    type: [String],
                    required: true,
                    validate: [
                        (array: string[]) => array.length === 4,
                        'Must have exactly 4 options',
                    ],
                },
                correctAnswer: {
                    type: String,
                    required: true,
                },
                explanation: {
                    type: String,
                    default: '',
                },
                difficulty: {
                    type: String,
                    enum: ['easy', 'medium', 'hard'],
                    default: 'medium',
                },
            },
        ],
        userAnswers: [
            {
                questionIndex: {
                    type: Number,
                    required: true,
                },
                selectedAnswer: {
                    type: String,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                },
                answerAt: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        toltalQuestions: {
            type: Number,
            required: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

//index for faster queries
QuizSchema.index({ userId: 1, documentId: 1 });

const Quiz = model<QUIZ_TYPES>('Quiz', QuizSchema);

export default Quiz;
