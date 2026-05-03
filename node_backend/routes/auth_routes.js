import { Router } from 'express';

import { createError, send_error } from '#utils/error_utils';

import { checkUsernameAvailability, getGoogleAuthUrl, handleGoogleAuthCallback, loginUser, signupUser, verifySignupOtp } from '#services/auths';

const routes = Router({ mergeParams: true });

function buildAuthErrorRedirect(state, message) {
  const fallbackUrl = process.env.FRONTEND_URL || 'http://localhost:5173/welcome';

  if (!state) {
    const redirectUrl = new URL(fallbackUrl);
    redirectUrl.searchParams.set('authError', message);
    return redirectUrl.toString();
  }

  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    const redirectUrl = new URL(parsedState.returnTo || fallbackUrl);
    redirectUrl.searchParams.set('authError', message);
    return redirectUrl.toString();
  } catch {
    const redirectUrl = new URL(fallbackUrl);
    redirectUrl.searchParams.set('authError', message);
    return redirectUrl.toString();
  }
}

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

const googleAuthStartHandler = async (req, res) => {
  const payload = await getGoogleAuthUrl({ returnTo: req.query?.returnTo?.trim() });

  if (payload instanceof Error) return send_error(res, payload);

  return res.redirect(payload.url);
};

const googleAuthCallbackHandler = async (req, res) => {
  const payload = await handleGoogleAuthCallback({
    code: req.query?.code?.trim(),
    state: req.query?.state?.trim(),
  });

  if (payload instanceof Error) {
    return res.redirect(buildAuthErrorRedirect(req.query?.state?.trim(), payload.message));
  }

  return res.redirect(payload.redirectUrl);
};

routes.get('/username-availability', checkUsernameAvailabilityHandler);
routes.get('/google/start', googleAuthStartHandler);
routes.get('/google/callback', googleAuthCallbackHandler);
routes.post('/login', loginUserHandler);
routes.post('/signup', signupUserHandler);
routes.post('/verify-signup', verifySignupOtpHandler);

export default routes;
