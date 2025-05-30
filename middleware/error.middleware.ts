import { Request, Response, NextFunction } from 'express';

// Define an interface for the error object passed to the middleware
interface MiddlewareError extends Error {
    errors: { [s: string]: unknown; } | ArrayLike<unknown>;
    code?: number; // For Mongoose error codes like 11000
    // statusCode could also be part of err if it's set before reaching here
}

const errorMiddleware = (err: MiddlewareError, req: Request, res: Response, next: NextFunction) => {
    try {
        let error: any = { ...err };
        error.message = err.message;

        console.error(err.message);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
            res.status(404).json({ message: error.message });
            return;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
            res.status(400).json({ message: error.message });
            return;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((val: any) => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
            res.status(400).json({ message: error.message });
            return;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;