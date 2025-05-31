import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import { CommandSucceededEvent } from "mongodb";

interface CustomError extends Error {
    statusCode?: number;
}

export const signUp = async (req: { body: { name: string; email: string; password: string; }; }, res: any, next: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error: CustomError = new Error('User already exists with this email');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET as string, { expiresIn: '1d' });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req: { body: { email: any; password: any; }; }, res: any, next: any) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const error = new Error('User not found with this email');
            (error as CustomError).statusCode = 404;
            throw error;
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            const error = new Error('Invalid password');
            (error as CustomError).statusCode = 401;
            throw error;
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET as string, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: existingUser
            }
        });
    } catch (error) {
        next(error);
    }
}


export const signOut = async (req: any, res: any, next: any) => {
    try {
        // Clear the cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'User signed out successfully' });
        return;
    } catch (error) {
        next(error);
    }
}