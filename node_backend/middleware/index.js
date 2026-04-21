import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';

import { request_logger } from '#middleware/request_logger';
import { verifyAuthToken } from '#utils/auth_utils';

const JSON_LIMIT = '1mb';

export function register_global_middleware(app) {
  app.use(cors());
  app.use(express.json({ limit: JSON_LIMIT }));
  app.use(request_logger);
}

export function require_authentication(request, response, next) {
  const authorization_header = request.headers.authorization;

  if (!authorization_header?.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Authentication is required.' });
    return;
  }

  try {
    const token = authorization_header.replace('Bearer ', '').trim();
    const payload = verifyAuthToken(token);

    response.locals.auth = {
      token,
      user_id: Number(payload.sub),
    };
    next();
  } catch (error) {
    response.status(401).json({ message: 'The current session is invalid.', error });
  }
}

export function send_http_error(response, error) {
  if (error instanceof ZodError) {
    response.status(400).json({ message: 'The submitted request is invalid.', issues: error.flatten() });
    return;
  }

  response.status(error.statusCode ?? 500).json({
    message: error.statusCode ? error.message : 'An unexpected error occurred.',
  });
}

export function audit_middleware(_req, _res, _next) {}
