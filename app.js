import dotenv from 'dotenv';
import express from 'express';

import { register_global_middleware } from '#middleware/index';
import { register_routes } from './node_backend/routes/index.js';

dotenv.config();

const DEFAULT_NODE_PORT = Number.parseInt(process.env.NODE_PORT ?? '3000', 10);

export function create_app() {
  const app = express();

  app.disable('x-powered-by');
  register_global_middleware(app);
  register_routes(app);

  return app;
}

const app = create_app();

if (process.env.NODE_ENV !== 'test') {
  app.listen(DEFAULT_NODE_PORT, () => {
    console.info(`node backend listening on port ${DEFAULT_NODE_PORT}`);
  });
}

export default app;
