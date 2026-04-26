import { Router } from 'express';

import { checkUsernameAvailability, loginUser, signupUser, verifySignupOtp } from '#services/auths';
import { send_error } from '#utils/error_utils';

const routes = Router({ mergeParams: true });

const signupUserHandler = async (req, res) => {
  const payload = await signupUser(req.body);

  if (payload instanceof Error) return send_error(res, payload);

  return res.status(201).json(payload);
};

const loginUserHandler = async (req, res) => {
  const payload = await loginUser(req.body);

  if (payload instanceof Error) return send_error(res, payload);

  res.locals.auth = { userId: payload.userId };
  res.locals.token = payload.token;

  return res.json(payload);
};

const checkUsernameAvailabilityHandler = async (req, res) => {
  const payload = await checkUsernameAvailability(req.query);

  return res.json(payload);
};

const verifySignupOtpHandler = async (req, res) => {
  const otp = req.body?.otp?.trim();
  const verificationToken = req.body?.verificationToken?.trim();

  if (typeof otp !== 'string' || !otp.trim()) {
    return send_error(res, createError({ message: 'OTP is required.', statusCode: 400 }));
  }

  const payload = await verifySignupOtp({ otp, verificationToken });

  if (payload instanceof Error) return send_error(res, payload);

  return res.json(payload);
};

routes.get('/username-availability', checkUsernameAvailabilityHandler);
routes.post('/login', loginUserHandler);
routes.post('/signup', signupUserHandler);
routes.post('/verify-signup', verifySignupOtpHandler);

export default routes;
