import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';
// @ts-ignore
import hpp from 'hpp';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// CORS configuration for Render
export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'https://ai-learning-frontend-m2zj.onrender.com',
            'http://localhost:7000',
            'http://localhost:5173',
            'http://localhost:8000'
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true); // Temporarily allow all for debugging
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

// Helmet security headers
export const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", process.env.CLIENT_URL || ''],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
});

// MongoDB injection protection
export const sanitizeInput = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Injection attempt detected at ${key}`);
        }
    }
});

// XSS protection
export const xssProtection = xss();

// HTTP Parameter Pollution protection
export const preventParameterPollution = hpp();

// Request size limiter - 10MB max
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024;
    
    if (contentLength > maxSize) {
        return res.status(413).json({
            success: false,
            error: 'Request entity too large. Maximum size is 10MB',
            statusCode: 413
        });
    }
    next();
};