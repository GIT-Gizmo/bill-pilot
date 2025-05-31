import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/env.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) return res.status(401).json({ message: 'Unauthorized access, no token provided' });

        const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;

        const user = await User.findById(decoded.userId);

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized access', error: (error as Error).message })
    }
}

export default authorize;