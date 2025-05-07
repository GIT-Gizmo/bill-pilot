import exp from 'constants';
import { Router } from 'express';

const authRouter = Router();

authRouter.get('/sign-up', (req, res) => {
    res.send({ title: 'Sign Up Page' });
})

authRouter.get('/sign-in', ((req, res) => {
    res.send({ title: 'Sign In Page' });
}))

authRouter.get('/sign-out', (req, res) => {
    res.send({ title: 'Sign Out Page' });

})

export default authRouter;