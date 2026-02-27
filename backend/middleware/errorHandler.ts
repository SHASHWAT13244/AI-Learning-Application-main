import { NextFunction, Request, Response } from 'express';

const errorHanlder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Initialize variables for response
  let message = err.message || 'Internal Server Error';
  let statusCode = err.statusCode || 500;

  //mongo CastError
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  //Mongo duplicate key error
  if (err.code === 11000) {
    //Extract the same field that causing error
    const value = Object.keys(err.keyValue).join(', ');
    message = `Duplicate field value entered: ${value}.Please use another value`;
    statusCode = 400;
  }

  //Mongo validation error
  if (err.name === 'validationError') {
    const value = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    message = value;
    statusCode = 400;
  }

  //multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size exceeds the maxmimu limit of 10MB';
    statusCode = 400;
  }

  //Jwt errors
  if (err.name === 'JsonWebTokenError') {
    message = 'JSON Web Token is invalid. Try again.';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'JSON Web Token is expired. Log in again.';
    statusCode = 401; // Unauthorized
  }

  console.error(`Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHanlder;
