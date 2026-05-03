import crypto from 'node:crypto';

import { createUser, fetchUser } from '#models/users';
import {
  createAuthToken,
  createSignupVerificationToken,
  doesOtpMatch,
  generateOtp,
  hashPassword,
  validateLoginPayload,
  verifyPassword,
  verifySignupVerificationToken,
} from '#utils/auth_utils';
import { createError } from '#utils/error_utils';
import { transformKeysToCamelCase } from '#utils/object_handler';

import { getEmailHtml, sendEmail } from '#services/emails';
import { activateUser } from '#services/users';

function getGoogleOauthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return createError({ message: 'Google sign-in is not configured.', statusCode: 503 });
  }

  return { clientId, clientSecret, redirectUri };
}

function buildGoogleState(returnTo) {
  return Buffer.from(JSON.stringify({ returnTo }), 'utf8').toString('base64url');
}

function parseGoogleState(state) {
  if (!state) return null;

  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    return typeof parsedState.returnTo === 'string' ? parsedState.returnTo : null;
  } catch {
    return null;
  }
}

function normalizeUsernameCandidate(value) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, '');

  return normalized.slice(0, 24) || 'user';
}

async function createUniqueUsername(email) {
  const emailPrefix = email.split('@')[0] ?? 'user';
  const baseUsername = normalizeUsernameCandidate(emailPrefix);
  let attempt = 0;

  while (attempt < 10) {
    const suffix = attempt === 0 ? '' : String(crypto.randomInt(1000, 9999));
    const username = `${baseUsername}${suffix}`.slice(0, 30);
    const existingUser = await fetchUser({ username });

    if (!existingUser) {
      return username;
    }

    attempt += 1;
  }

  return `user${Date.now()}`;
}

async function fetchGoogleTokenPayload({ code, redirectUri }) {
  const oauthConfig = getGoogleOauthConfig();

  if (oauthConfig instanceof Error) return oauthConfig;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    return createError({ message: 'Google sign-in could not be completed.', statusCode: 502 });
  }

  return response.json();
}

async function fetchGoogleUserProfile(accessToken) {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return createError({ message: 'Google account details could not be loaded.', statusCode: 502 });
  }

  return response.json();
}

async function findOrCreateGoogleUser(profile) {
  const email = profile.email?.trim().toLowerCase();

  if (!email) {
    return createError({ message: 'Google did not return an email address for this account.', statusCode: 400 });
  }

  const existingUser = await fetchUser({ email, includePassword: true });

  if (existingUser) {
    if (!existingUser.is_active) {
      await activateUser({ userId: existingUser.id });
    }

    return existingUser;
  }

  const username = await createUniqueUsername(email);
  const newUser = await createUser({
    email,
    firstName: profile.given_name ?? profile.name?.split(' ')[0] ?? 'Google',
    lastName: profile.family_name ?? (profile.name?.split(' ').slice(1).join(' ') || 'User'),
    passwordHash: hashPassword(crypto.randomUUID()),
    username,
  });

  const activatedUser = await activateUser({ userId: newUser.id });

  if (activatedUser instanceof Error) return activatedUser;

  return activatedUser;
}

function buildGoogleCallbackRedirect({ authError, returnTo, token }) {
  const targetUrl = new URL(returnTo || process.env.FRONTEND_URL || 'http://localhost:5173/welcome');

  if (token) {
    targetUrl.searchParams.set('authToken', token);
  }

  if (authError) {
    targetUrl.searchParams.set('authError', authError);
  }

  return targetUrl.toString();
}

export async function getGoogleAuthUrl({ returnTo }) {
  const oauthConfig = getGoogleOauthConfig();

  if (oauthConfig instanceof Error) return oauthConfig;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authUrl.searchParams.set('client_id', oauthConfig.clientId);
  authUrl.searchParams.set('redirect_uri', oauthConfig.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('prompt', 'select_account');

  if (returnTo) {
    authUrl.searchParams.set('state', buildGoogleState(returnTo));
  }

  return { url: authUrl.toString() };
}

export async function handleGoogleAuthCallback({ code, state }) {
  const oauthConfig = getGoogleOauthConfig();

  if (oauthConfig instanceof Error) return oauthConfig;

  if (!code?.trim()) {
    return createError({ message: 'Google did not return an authorization code.', statusCode: 400 });
  }

  const tokenPayload = await fetchGoogleTokenPayload({ code, redirectUri: oauthConfig.redirectUri });

  if (tokenPayload instanceof Error) return tokenPayload;

  const profile = await fetchGoogleUserProfile(tokenPayload.access_token);

  if (profile instanceof Error) return profile;

  const user = await findOrCreateGoogleUser(profile);

  if (user instanceof Error) return user;

  return {
    redirectUrl: buildGoogleCallbackRedirect({
      returnTo: parseGoogleState(state),
      token: createAuthToken(user),
    }),
  };
}

export async function signupUser(payload) {
  const { email, password, username } = payload;
  const existingEmail = await fetchUser({ email });
  const existingUsername = await fetchUser({ username });

  if (existingEmail || existingUsername) {
    return createError({ message: 'An account with that email or username already exists.', statusCode: 409 });
  }

  const user = await createUser({
    ...payload,
    passwordHash: hashPassword(password),
  });
  const otp = generateOtp();
  const verificationToken = createSignupVerificationToken({
    email: user.email,
    otp,
    userId: user.id,
  });
  const html = await getEmailHtml({
    template_name: 'OTP_EMAIL',
    variables: {
      email: user.email,
      firstName: user.first_name ?? 'there',
      otp,
    },
  });

  await sendEmail({
    html,
    subject: 'Verify your MLBots account',
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    to: user.email,
  });

  return {
    email: user.email,
    requiresVerification: true,
    verificationToken,
  };
}

export async function loginUser({ email, password, username }) {
  const parsedPayload = validateLoginPayload({ email, password, username });
  const user = await fetchUser({
    email: parsedPayload.email,
    username: parsedPayload.username,
    includePassword: true,
    is_active: true,
  });

  if (!user || !verifyPassword(parsedPayload.password, user.password)) {
    return createError({ message: 'Invalid email or password.', statusCode: 401 });
  }

  const { password: _password, ...safeUser } = user;

  return {
    token: createAuthToken(user),
    user: transformKeysToCamelCase(safeUser),
    userId: user.id,
  };
}

export async function verifySignupOtp({ otp, verificationToken }) {
  const verificationPayload = verifySignupVerificationToken(verificationToken);

  if (verificationPayload.purpose !== 'signup-verification') {
    return createError({ message: 'The verification session is invalid.', statusCode: 400 });
  }

  if (!doesOtpMatch({ otp: Number(otp), otpHash: verificationPayload.otpHash })) {
    return createError({ message: 'That verification code is incorrect.', statusCode: 400 });
  }

  const activatedUser = await activateUser({ userId: Number(verificationPayload.sub) });

  if (activatedUser instanceof Error) return activatedUser;

  return { message: 'Email verified successfully. You can log in now.' };
}

export async function checkUsernameAvailability({ username }) {
  const user = await fetchUser({ username });

  return { available: !user };
}
