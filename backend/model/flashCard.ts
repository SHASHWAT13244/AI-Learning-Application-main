import { Schema, model } from 'mongoose';
import { FLASH_CARD_TYPES } from '../types';

const flashCardSchema = new Schema<FLASH_CARD_TYPES>(
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
        cards: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
                difficulty: {
                    type: String,
                    enum: ['easy', 'medium', 'hard'],
                    default: 'medium',
                },
                lastReviewed: {
                    type: Date,
                    default: null,
                },
                reviewCount: {
                    type: Number,
                    default: 0,
                },
                isStarred: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

flashCardSchema.index({ userId: 1, documentId: 1 });

const FlashCard = model<FLASH_CARD_TYPES>('FlashCard', flashCardSchema);

export default FlashCard;
