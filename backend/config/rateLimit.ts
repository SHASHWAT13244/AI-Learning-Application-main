import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Request } from 'express';

// Helper to get real IP when behind Render proxy and properly handle IPv6
const getRealIp = (req: Request): string => {
    // Render uses x-forwarded-for header
    const forwarded = req.headers['x-forwarded-for'];
    let ip: string;
    
    if (forwarded) {
        const ips = Array.isArray(forwarded) ? forwarded : forwarded.split(',');
        ip = ips[0].trim();
    } else {
        ip = req.ip || req.socket.remoteAddress || 'unknown';
    }
    
    // Use ipKeyGenerator to properly handle IPv6 subnet masking
    // This prevents IPv6 users from bypassing rate limits by rotating IPs
    return ipKeyGenerator(ip);
};

// The rest of your rate limiters remain the same
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests, please try again after 15 minutes',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getRealIp
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many login attempts, please try again after 15 minutes',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getRealIp
});

export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        error: 'Too many AI requests, please try again after an hour',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getRealIp
});

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many upload attempts, please try again after an hour',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getRealIp
});

export const quizLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: 'Too many quiz submissions, please try again after an hour',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getRealIp
});