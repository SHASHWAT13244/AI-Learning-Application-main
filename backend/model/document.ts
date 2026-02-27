import { model, Schema } from 'mongoose';
import { DOCUMENT_TYPES } from '../types';

const DocumentSchema = new Schema<DOCUMENT_TYPES>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a document title'],
            trim: true,
        },
        fileName: {
            type: String,
            reuired: true,
        },
        fileSize: {
            type: Number,
            reuired: true,
        },
        filePath: {
            type: String,
            reuired: true,
        },
        extactedText: {
            type: String,
            default: '',
        },
        chunks: [
            {
                content: {
                    type: String,
                    required: true,
                },
                pageNumber: {
                    type: Number,
                    default: 0,
                },
                chunkIndex: {
                    type: Number,
                    required: true,
                },
            },
        ],
        uploadDate: {
            type: Date,
            default: Date.now(),
        },
        lastAccessed: {
            type: Date,
            default: Date.now(),
        },
        status: {
            type: String,
            enum: ['processing', 'ready', 'failed'],
            default: 'processing',
        },
    },
    {
        timestamps: true,
    }
);

//indexing
DocumentSchema.index({ userId: 1, uploadDate: -1 });

const Document = model<DOCUMENT_TYPES>('Document', DocumentSchema);

export default Document;
