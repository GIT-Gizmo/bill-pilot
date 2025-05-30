import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send({ title: 'GET all users' });
});

userRouter.post('/:id', (req, res) => {
    res.send({ title: 'GET a user details' });
});

userRouter.delete('/:id', (req, res) => {
    res.send({ title: 'Delete user with ID ' + req.params.id });
});

userRouter.put('/:id', (req, res) => {
    res.send({ title: 'Update user with ID ' + req.params.id });
});

export default userRouter;