import express from 'express';
import dotenv from 'dotenv/config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {
	globalErrHandler,
	notFoundErr,
} from '../middlewares/globalErrHandler.middleware.js';
import adminRouter from '../routes/staff/admin.routes.js';
import academicYearRouter from '../routes/academics/academicYear.route.js';
import academicTermRouter from '../routes/academics/academicTerm.route.js';

const app = express();

//==> middlewares <==//
app.use(morgan('dev'));
app.use(
	express.json({
		limit: '16kb',
	})
);
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

//==> routes <==//

app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/academic-year', academicYearRouter);
app.use('/api/v1/academic-term', academicTermRouter);

//==> error middleware <==//
app.use(notFoundErr);
app.use(globalErrHandler);

export { app };
