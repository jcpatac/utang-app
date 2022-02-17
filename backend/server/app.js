import "core-js/stable";
import "regenerator-runtime/runtime";

import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import indexRouter from './routes/authentication';
import usersRouter from './routes/users';
import networkRouter from './routes/network';

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use('/users', authenticate(), usersRouter);
app.use('/network', authenticate(), networkRouter);

export default app;
