import { Router } from 'express';

import { getCurrentUser } from '#services/users';

const routes = Router({ mergeParams: true });

const getCurrentUserHandler = async (req, res) => {
  const payload = await getCurrentUser({ userId: Number(res.locals.auth.userId) });

  if (payload instanceof Error) {
    return res.status(payload.statusCode).json({ message: payload.message });
  }

  res.json(payload);
};

export function getUserId(res) {
  return res.locals?.auth?.userId ? Number(res.locals.auth.userId) : null;
}

routes.get('/me', getCurrentUserHandler);

export default routes;
