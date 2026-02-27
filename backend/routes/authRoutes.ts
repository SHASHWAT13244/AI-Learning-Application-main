import express from 'express';
import { body } from 'express-validator';
import {
    changePassword,
    getProfile,
    login,
    register,
    updateProfile,
} from '../controller/authController';
import protect from '../middleware/auth';

const AuthRouter = express.Router();

//validation
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be atleast 3 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be atleast 6 characters'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

//public routes
AuthRouter.post('/register', registerValidation, register);
AuthRouter.post('/login', loginValidation, login);

//protected routes
AuthRouter.get('/profile', protect, getProfile);
AuthRouter.put('/profile', protect, updateProfile);
AuthRouter.post('/change-password', protect, changePassword);

export default AuthRouter;
