import { Router } from 'express';

import auth_router from './auth_routes.js';
import health_router from './health_routes.js';

const API_PREFIX = '/api/node';

export function register_routes(app) {
  const api_router = Router();

  api_router.use('/auth', auth_router);
  api_router.use('/health', health_router);
  app.use(API_PREFIX, api_router);
}
