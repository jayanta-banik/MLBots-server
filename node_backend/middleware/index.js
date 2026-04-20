import cors from 'cors';
import express from 'express';

import { request_logger } from '#middleware/request_logger';

const JSON_LIMIT = '1mb';

export function register_global_middleware(app) {
  app.use(cors());
  app.use(express.json({ limit: JSON_LIMIT }));
  app.use(request_logger);
}

export function audit_middleware(req, res, next) {}
