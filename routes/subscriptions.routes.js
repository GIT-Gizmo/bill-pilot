import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({ title: 'GET all subscriptions' });
});

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: 'Get subscription with ID ' + req.params.id });
});

subscriptionRouter.post('/', (req, res) => {
    res.send({ title: 'Create a new subscription' });
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: 'Delete subscription with ID ' + req.params.id });
});

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: 'Update subscription with ID ' + req.params.id });
});

subscriptionRouter.get('/user/:id/subscriptions', (req, res) => {
    res.send({ title: 'Get subscriptions for user with ID ' + req.params.id });
});

subscriptionRouter.put('/user/:id/cancel', (req, res) => {
    res.send({ title: 'Cancel subscription for user with ID ' + req.params.id });
})

subscriptionRouter.get('/user/:id/upcoming-renewals', (req, res) => {
    res.send({ title: 'Get upcoming renewals for user with ID ' + req.params.id });
})







subscriptionRouter.post('/user/:id/subscriptions', (req, res) => {
    res.send({ title: 'Create a new subscription for user with ID ' + req.params.id });
});

export default subscriptionRouter;