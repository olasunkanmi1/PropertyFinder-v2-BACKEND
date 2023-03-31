import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import  'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'

//DB
import connectDB from './db/connect.js';

import authenticateUser from './middleware/authentication.js'

//routers
import { authenticationRouter, propertyRouter, userRouter } from './routes/index.js'

const app = express();
dotenv.config();

if(process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

const corsOptions = {
    origin: process.env.CORSORIGIN,
    credentials: true,
};

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 60,
  })
);
app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));


app.get('/', (req, res) => res.send('<h3> PropertyFinder v2! </h3>'))

app.use('/api/v1/auth', authenticationRouter)
app.use('/api/v1/property', authenticateUser, propertyRouter)
app.use('/api/v1/user', authenticateUser, userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error);
    }
}

start()