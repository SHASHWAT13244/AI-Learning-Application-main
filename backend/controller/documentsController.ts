import { NextFunction, Response } from 'express';
import fs from 'fs';
import Document from '../model/document';
import { extractTextFromPDF } from '../utils/pdfParser';
import { textChunkFunc } from '../utils/textChunker';
import { Types } from 'mongoose';
import FlashCard from '../model/flashCard';
import Quiz from '../model/quiz';
import { put as BlobPut, del } from '@vercel/blob';
import { getBlobBuffer } from '../utils/blobResponse';

const processPDF = async (id: string, path: string): Promise<any> => {
  try {
    const buffer = await getBlobBuffer(path);

    const { text } = await extractTextFromPDF(buffer);

    //create chunk
    const chunks = textChunkFunc({ text: text });

    await Document.findByIdAndUpdate(id, {
      extactedText: text,
      chunks: chunks,
      status: 'ready',
    });
  } catch (err) {
    console.error(`Error processing document ${id}:`, err);
    await Document.findByIdAndUpdate(id, {
      status: 'failed',
    });
  }
};

//@desc   upload PDF docs
//route   POST api/documents/upload
//@access Private
export const uploadDocument = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400,
      });
    }

    const { title } = req.body;

    if (!title) {
      // With memory storage, there's no file to unlink from disk
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400,
      });
    }

    // Upload to Vercel Blob
    const uniqueSuffix: string =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}-${req.file.originalname}`;
    const blobResult = await BlobPut(fileName, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
    });

    //create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: fileName,
      filePath: blobResult.url,
      fileSize: req.file.size,
      status: 'processing',
    });

    //process PDF in bg
    processPDF(document._id.toString(), blobResult.url).catch((err) => {
      console.error('PDF Processing error', err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded sucessfully.Processing in progress...',
    });
  } catch (error) {
    // With memory storage, no file to clean up from disk
    next(error);
  }
};

//@desc   Get all users documents
//route   GET api/documents/
//@access Private
export const getDocuments = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await Document.aggregate([
      { $match: { userId: new Types.ObjectId(req.user._id) } },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Get single users document
//route   GET api/documents/:id
//@access Private
export const getDocument = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404,
      });
    }

    //Get counts of associated flashcards and quizzes
    const flashcardCount: number = await FlashCard.countDocuments({
      documentId: document?._id,
      userId: req.user._id,
    });
    const quizCount: number = await Quiz.countDocuments({
      documentId: document?._id,
      userId: req.user._id,
    });

    //update last accessed
    document.lastAccessed = new Date(Date.now());
    await document.save();

    //combine document data with counts
    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete docs
//route   DELETE api/documents/:id
//@access Private
export const deleteDocument = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404,
      });
    }

    // Delete file from Vercel Blob storage
    try {
      if (document.fileName) {
        await del(document.fileName, { 
          token: process.env.BLOB_READ_WRITE_TOKEN 
        });
      }
    } catch (blobError) {
      console.error('Error deleting file from blob storage:', blobError);
      // Continue with database deletion even if blob deletion fails
    }

    //Delete document from database
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
