import { Router } from 'express';
import academicTermRouter from './academics/academicTerm.route.js';
import academicYearRouter from './academics/academicYear.route.js';
import classLevelRouter from './academics/classLevel.route.js';
import adminRouter from './staff/admin.route.js';
import programRouter from './academics/program.route.js';

const routes = Router();

routes.use('/admins', adminRouter);
routes.use('/academic-year', academicYearRouter);
routes.use('/academic-term', academicTermRouter);
routes.use('/class-level', classLevelRouter);
routes.use('/program', programRouter);

export default routes;
