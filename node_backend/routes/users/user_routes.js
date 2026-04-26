import { Router } from 'express';

import { getCurrentUser } from '#services/users';

const routes = Router({ mergeParams: true });

const getCurrentUserHandler = async (req, res) => {
  const payload = await getCurrentUser({ userId: res.locals.auth.user_id });

  if (payload instanceof Error) {
    return res.status(payload.statusCode).json({ message: payload.message });
  }

  res.json(payload);
};

routes.get('/me', getCurrentUserHandler);

export default routes;
