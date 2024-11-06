import express from 'express';
import dotenv from 'dotenv/config';
import cron from 'node-cron';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {
	globalErrHandler,
	notFoundErr,
} from '../middlewares/globalErrHandler.middleware.js';
import routes from '../routes/routes.js';
import retryFailedEmails from '../utils/mail/retryFailedEmails.js';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { corsOptions } from '../constant.js';

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

//==> middlewares <==//
app.use(morgan('dev'));
app.use(
	express.json({
		limit: '16kb',
	})
);
app.use(
	express.urlencoded({
		extended: true,
		limit: '16kb',
	})
);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(limiter);
app.use(express.static('public'));

//==> routes <==//

app.use('/api/v1', routes);

//==> error middleware <==//
app.use(notFoundErr);
app.use(globalErrHandler);

// Schedule the cron job to run every 1 day
// cron.schedule('0 0 * * *', retryFailedEmails);

export { app };
