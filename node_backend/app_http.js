import dotenv from 'dotenv';
import express from 'express';

import { register_global_middleware } from '#middleware/index';
import { register_routes } from './routes/index.js';

dotenv.config();

const DEFAULT_NODE_HTTP_PORT = Number.parseInt(process.env.NODE_HTTP_PORT ?? '3001', 10);

function reject_https_requests(req, res, next) {
  if (req.secure || req.protocol === 'https') {
    res.status(400).json({
      error: 'HTTPS requests are not supported by this server.',
    });
    return;
  }

  next();
}

export function create_http_app() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', true);
  app.use(reject_https_requests);
  register_global_middleware(app);
  register_routes(app);

  return app;
}

const app_http = create_http_app();

if (process.env.NODE_ENV !== 'test') {
  app_http.listen(DEFAULT_NODE_HTTP_PORT, () => {
    console.info(`node http backend listening on port ${DEFAULT_NODE_HTTP_PORT}`);
  });
}

export default app_http;
