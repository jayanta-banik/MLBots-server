import express from 'express';

import { requireAdmin } from '#middleware/require_admin';
import { requireLogin } from '#middleware/require_login';

import lorekraftAdminRouter from './admin/lorekraft/index.js';
import authRouter from './auth_routes.js';
import enumsRouter from './enums/enums.js';
import healthRouter from './health_routes.js';
import lorekraftRouter from './lorekraft/lorekraft_routes.js';
import universityRouter from './university_routes.js';
import usersRouter from './users/user_routes.js';

const routes = express.Router();

// public routes
routes.use('/auth', authRouter);
routes.use('/health', healthRouter);

// authenticated routes
routes.use('/enums', requireLogin, enumsRouter);
routes.use('/universities', requireLogin, universityRouter);
routes.use('/users', requireLogin, usersRouter);
routes.use('/lorekraft', requireLogin, lorekraftRouter);

// admin routes
routes.use('/lorekraft/admin', requireLogin, requireAdmin, lorekraftAdminRouter);

// error handler with a generic message
routes.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'An unknown error has occurred and the development team has been notified' });
});

export default routes;
