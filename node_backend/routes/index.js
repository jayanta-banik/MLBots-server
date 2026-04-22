import express from 'express';

import auth_router from './auth_routes.js';
import health_router from './health_routes.js';

const API_PREFIX = '/api/node';

const routes = express.Router();

routes.use('/auth', auth_router);
routes.use('/health', health_router);

// error handler with a genearic message
routes.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'An unknown error has occurred and the development team has been notified' });
});

export default routes;
