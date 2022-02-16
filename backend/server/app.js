import "core-js/stable";
import "regenerator-runtime/runtime";

import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// import indexRouter from './routes/index';
import usersRouter from './routes/users';

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

// app.use('/', indexRouter);
app.use('/', usersRouter);

export default app;