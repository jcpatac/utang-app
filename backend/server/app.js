import "core-js/stable";
import "regenerator-runtime/runtime";

import cors from 'cors';
import { join } from 'path';
import logger from 'morgan';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

/* Routes */
import itemRouter from './routes/item';
import usersRouter from './routes/users';
import networkRouter from './routes/network';
import indexRouter from './routes/authentication';
import transactionRouter from './routes/transaction';

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, '../public')));

// middleware
const authenticate = () => {
    return (req, res, next) => {
        try {
            let token = req.headers.authorization;
            let decoded = jwt.verify(token, process.env.SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({
                error: "Could not Authenticate!"
            });
        }
    }
}

app.use('/', indexRouter);
app.use('/items', authenticate(), itemRouter);
app.use('/users', authenticate(), usersRouter);
app.use('/networks', authenticate(), networkRouter);
app.use('/transactions', authenticate(), transactionRouter);

export default app;