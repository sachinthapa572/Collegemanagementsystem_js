import dotenv from 'dotenv/config';
import express from 'express';
import adminRouter from '../routes/staff/admin.routes.js';
import morgan from 'morgan';
import {
	globalErrHandeler,
	notFoundErr,
} from '../middlewares/golbalErrHandeler.controller.js';

const app = express();

//==> middlewares <==//
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//==> routes <==//

app.use('/api/v1/admins', adminRouter);

//==> error middleware <==//
app.use(notFoundErr);
app.use(globalErrHandeler);

export { app };
