import { Router } from 'express';

import { require_authentication } from '#middleware/index';
import { getCurrentUser, loginUser, signupUser } from '#services/auth_service';

const auth_router = Router();

auth_router.post('/signup', async (req, res) => {
  const payload = await signupUser(req.body);
  res.status(201).json(payload);
});

auth_router.post('/login', async (req, res) => {
  const payload = await loginUser(req.body);
  res.json(payload);
});

auth_router.get('/me', require_authentication, async (req, res) => {
  const payload = await getCurrentUser({ userId: res.locals.auth.user_id });
  res.json(payload);
});

export default auth_router;
