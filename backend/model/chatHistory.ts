import { model, Schema } from 'mongoose';
import { CHAT_HISTORY_TYPES } from '../types';

const ChatHistorySchema = new Schema<CHAT_HISTORY_TYPES>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        documentId: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant'],
                    reuired: true,
                },
                content: { type: String, reuired: true },
                timestamp: {
                    type: Date,
                    default: Date.now(),
                },
                releventChunks: {
                    type: [Number],
                    default: [],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

ChatHistorySchema.index({ userId: 1, documentId: 1 });

const ChatHistory = model<CHAT_HISTORY_TYPES>('ChatHistory', ChatHistorySchema);

export default ChatHistory;
