import { NextFunction, Response } from 'express';

// Hardcoded admin credentials - login only, no env vars
const ADMIN_EMAIL = 'admin@example.com';

const admin = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized',
                statusCode: 401,
            });
        }

        // Check if the logged-in user matches the hardcoded admin email
        const isAdmin = req.user.email === ADMIN_EMAIL;
        
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.',
                statusCode: 403,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default admin;
