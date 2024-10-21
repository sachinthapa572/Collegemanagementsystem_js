import dotenv from 'dotenv/config';
import express from 'express';
import adminRouter from '../routes/staff/admin.routes.js';
import morgan from 'morgan';

const app = express();

//==> middlewares <==//
app.use(morgan('dev'));
app.use('/api/v1/admins', adminRouter);

export { app };
