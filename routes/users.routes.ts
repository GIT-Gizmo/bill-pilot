import { Router, Request, Response, NextFunction } from 'express';
import { getUsers, getUser } from '../controllers/user.controller.js';
import authorize from '../middleware/auth.middleware.js';

const userRouter = Router();

// Just a wrapper function to ensure type compatibility, I know TypeScript is insane and screams at almost everything
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    authorize(req, res, next).catch(() => {
        // The error is already being handled in the authorize middleware so no need to panic bro.
    });
};

userRouter.get('/', getUsers);

userRouter.get('/:id', authMiddleware, getUser);

userRouter.post('/', (req, res) => {
    res.send({ title: 'Create a new user' });
});

userRouter.delete('/:id', (req, res) => {
    res.send({ title: 'Delete user with ID ' + req.params.id });
});

userRouter.put('/:id', (req, res) => {
    res.send({ title: 'Update user with ID ' + req.params.id });
});

export default userRouter;