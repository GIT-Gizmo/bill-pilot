import express from 'express'
import cookieParser from 'cookie-parser'

import { PORT } from './config/env.js'

import authRouter from './routes/auth.route.js'
import userRouter from './routes/users.routes.js'
import subScriptionRouter from './routes/subscriptions.routes.js'
import connectToDB from './database/mongodb.js'
import errorMiddleware from './middleware/error.middleware.js'
import arcjetMiddleware from './middleware/arcjet.middleware.js'
import workflowRouter from './routes/workflow.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use((req, res, next) => {
    arcjetMiddleware(req, res, next).catch(next);
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subScriptionRouter)
app.use('/api/v1/workflows', workflowRouter)

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('Welcome to Bill Pilot Subscription Tracker API')
})

app.listen(PORT, async () => {
    console.log(`Bill Pilot API is running on http://localhost:${PORT}`)

    await connectToDB()
})

export default app;