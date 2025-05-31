import { NextFunction, Request, Response } from 'express'
import aj from '../config/arcjet.js'

const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: 'Too many requests, rate limit exceeded.' });
            if (decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

            res.status(403).json({ error: 'Access denied' })
            return;
        }

        next();
    } catch (error) {
        console.log(`Error in arcjet middleware: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;