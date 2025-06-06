import { Request, Response, NextFunction } from 'express';
import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

interface CustomError extends Error {
    statusCode?: number;
}

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
            workflowRunId: subscription.id, // Use subscription ID as workflow run ID
        })

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error)
    }
}

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.id !== req.params.id) {
            const error: CustomError = new Error('You do not have authorized access to view another users subscriptions');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id })

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}