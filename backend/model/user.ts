import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_TYPES } from '../types';

const UserSchema = new Schema<USER_TYPES>(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be atleast 3 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid  email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        profileImage: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

//password Hashing
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    // Hash password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
});

//compare password method
UserSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<USER_TYPES>('User', UserSchema);

export default User;
