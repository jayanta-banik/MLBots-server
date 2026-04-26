import { Router } from 'express';

import { checkUsernameAvailability, loginUser, signupUser } from '#services/auths';

const routes = Router({ mergeParams: true });

const signupUserHandler = async (req, res) => {
  const payload = await signupUser(req.body);

  if (payload instanceof Error) {
    return res.status(payload.statusCode).json({ message: payload.message });
  }

  res.locals.token = payload.token;
  return res.status(201).json(payload);
};

const loginUserHandler = async (req, res) => {
  const payload = await loginUser(req.body);

  if (payload instanceof Error) {
    return res.status(payload.statusCode).json({ message: payload.message });
  }

  res.locals.auth = {
    token: payload.token,
    user_id: payload.userId,
  };
  res.locals.token = payload.token;

  return res.json(payload);
};

const checkUsernameAvailabilityHandler = async (req, res) => {
  const payload = await checkUsernameAvailability(req.query);

  return res.json(payload);
};

routes.get('/username-availability', checkUsernameAvailabilityHandler);
routes.post('/login', loginUserHandler);
routes.post('/signup', signupUserHandler);

export default routes;
