import express from 'express';

import { requireLogin } from '#middleware/require_login';

import authRouter from './auth_routes.js';
import healthRouter from './health_routes.js';
import usersRouter from './users/user_routes.js';

const routes = express.Router();

// public routes
routes.use('/auth', authRouter);
routes.use('/health', healthRouter);

// authenticated routes
routes.use('/users', requireLogin, usersRouter);

// error handler with a generic message
routes.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'An unknown error has occurred and the development team has been notified' });
});

export default routes;
