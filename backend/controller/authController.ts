import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../model/user';

//Generate JWT token
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET enviornment variable is not set');
}
const generateToken = (id: string): string => {
    const secretKey: Secret = JWT_SECRET as Secret;
    const options: SignOptions = { expiresIn: (JWT_EXPIRE as any) || '7d' };
    return jwt.sign({ id }, secretKey, options);
};

//@desc   Register new user
//@route  POST /api/auth/register
//@access public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body;

        //check if user exists
        const userExists = await User.findOne({ $or: [{ email }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                        ? 'Email Already Registered'
                        : 'UserEmil already taken.Please choose another Email ID',
                statusCode: 400,
            });
        }

        // create user
        const user = await User.create({
            username,
            email,
            password,
        });

        //generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    // password: user.password,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
            },
            message: 'User Registered Successfully',
        });
    } catch (error) {
        next(error);
    }
};

//@desc    Login user
//@route   POST /api/auth/login
//@access  Public
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        //validate both input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password',
                statusCode: 400,
            });
        }

        //check user( include password match)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: `Invalid credentials`,
                statusCode: 401,
            });
        }

        //check password
        const isMatchpwd = await user.matchPassword(password);

        if (!isMatchpwd) {
            return res.status(401).json({
                success: false,
                error: 'Invalid Credentials',
                satusCode: 401,
            });
        }

        //generate token
        const token = generateToken(user._id.toString());

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            token,
            message: 'Login successfull',
        });
    } catch (error) {
        next(error);
    }
};

//@desc   Get user profile
//@route  GET api/auth/profile
//@access private
export const getProfile = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: {
                id: user?._id,
                username: user?.username,
                email: user?.email,
                profileImage: user?.profileImage,
                createdAt: user?.createdAt,
                updatedAt: user?.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

//@desc Update user profile
//@route PUT/api/auth/profile
//@access Private
export const updateProfile = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, profileImage } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user?.username,
                email: user?.email,
                profileImage: user?.profileImage,
            },
            message: 'Profile updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc  Change password
//@route  POST/api/auth/change-password
//@access Private
export const changePassword = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'please provide current and new password',
                statusCode: 400,
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        //check password
        const isMatchpwd = await user?.matchPassword(currentPassword);

        if (!isMatchpwd) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect',
                stausCode: 401,
            });
        }

        //update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};
