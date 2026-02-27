import path from 'path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

type MulterFile = Express.Multer.File;

// const uploadDir = path.join(__dirname, "../uploads/documents");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

//config storage
// const storage = multer.diskStorage({
//   destination: (
//     req: Request,
//     file: MulterFile,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     cb(null, uploadDir);
//   },
//   filename: (
//     req: Request,
//     file: MulterFile,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     const uniqueSuffix: string =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

//file filter
const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!') as any, false);
  }
};

//config multer
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE as string) || 10485760, //10 MB
  },
});
