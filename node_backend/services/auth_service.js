import { createUser, fetchUser } from '#models/index';
import {
  buildUserProfile,
  buildUsername,
  createAuthToken,
  hashPassword,
  validateLoginPayload,
  validateSignupPayload,
  verifyPassword,
} from '#utils/auth_utils';

function createConflictError(message) {
  return Object.assign(new Error(message), { statusCode: 409 });
}

function createUnauthorizedError(message) {
  return Object.assign(new Error(message), { statusCode: 401 });
}

export async function signupUser(payload) {
  const { email, firstName, password } = validateSignupPayload(payload);
  const existingUser = await fetchUser({ email, includePassword: false });

  if (existingUser) {
    throw createConflictError('An account with that email already exists.');
  }

  const user = await createUser({
    email,
    firstName,
    passwordHash: hashPassword(password),
    username: buildUsername(email),
  });

  return {
    token: createAuthToken(user),
    user: buildUserProfile(user),
  };
}

export async function loginUser(payload) {
  const { email, password } = validateLoginPayload(payload);
  const user = await fetchUser({ email, includePassword: true });

  if (!user || !verifyPassword(password, user.password)) {
    throw createUnauthorizedError('Invalid email or password.');
  }

  return {
    token: createAuthToken(user),
    user: buildUserProfile(user),
  };
}

export async function getCurrentUser({ userId }) {
  const user = await fetchUser({ id: Number(userId), includePassword: false });

  if (!user) {
    throw createUnauthorizedError('The current session is invalid.');
  }

  return buildUserProfile(user);
}