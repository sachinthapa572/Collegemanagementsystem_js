import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import cron from 'node-cron';

import {
	globalErrHandler,
	notFoundErr,
} from '../middlewares/globalErrHandler.middleware.js';
import routes from '../routes/routes.js';
import retryFailedEmails from '../utils/mail/retryFailedEmails.js';
import { corsOptions, rateLimitOptions } from '../constant.js';
import refreshTokenMiddleware from '../middlewares/refreshToken.middleware.js';

const app = express();



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
app.use(rateLimit(rateLimitOptions));
app.use(express.static('public'));

//==>  Add token refresh middleware before the routes <==//
app.use(refreshTokenMiddleware);

//==> routes <==//

app.use('/api/v1', routes);

//==> error middleware <==//
app.use(notFoundErr);
app.use(globalErrHandler);

// Schedule the cron job to run every 1 day
// cron.schedule('0 0 * * *', retryFailedEmails);

export { app };
