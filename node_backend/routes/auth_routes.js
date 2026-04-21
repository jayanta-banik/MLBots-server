import { Router } from 'express';

import { require_authentication, send_http_error } from '#middleware/index';
import { getCurrentUser, loginUser, signupUser } from '#services/auth_service';

const auth_router = Router();

auth_router.post('/signup', async (request, response) => {
  try {
    const payload = await signupUser(request.body);

    response.status(201).json(payload);
  } catch (error) {
    send_http_error(response, error);
  }
});

auth_router.post('/login', async (request, response) => {
  try {
    const payload = await loginUser(request.body);

    response.json(payload);
  } catch (error) {
    send_http_error(response, error);
  }
});

auth_router.get('/me', require_authentication, async (request, response) => {
  try {
    const payload = await getCurrentUser({ userId: response.locals.auth.user_id });

    response.json(payload);
  } catch (error) {
    send_http_error(response, error);
  }
});

export default auth_router;
