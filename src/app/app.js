import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {
	globalErrHandler,
	notFoundErr,
} from '../middlewares/globalErrHandler.middleware.js';
import adminRouter from '../routes/staff/admin.routes.js';
import academicYearRouter from '../routes/academics/academicYear.route.js';

const app = express();

//==> middlewares <==//
app.use(morgan('tiny'));
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

//==> error middleware <==//
app.use(notFoundErr);
app.use(globalErrHandler);

export { app };
