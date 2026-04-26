import { createUser, fetchUser } from '#models/users';
import { createAuthToken, hashPassword, validateLoginPayload, verifyPassword } from '#utils/auth_utils';
import { createError } from '#utils/error_utils';

export async function signupUser(payload) {
  const { email, password, username } = payload;
  const existingUser = await fetchUser({ email, username });

  if (existingUser) {
    return createError({ message: 'An account with that email or username already exists.', statusCode: 409 });
  }

  const user = await createUser({
    ...payload,
    is_active: false,
    passwordHash: hashPassword(password),
  });

  // TODO: send verification email OTP

  return {
    token: createAuthToken(user),
    userId: user.id,
  };
}

export async function loginUser({ email, password, username }) {
  const parsedPayload = validateLoginPayload({ email, password, username });
  const user = await fetchUser({ email: parsedPayload.email, username: parsedPayload.username, includePassword: true });

  if (!user || !verifyPassword(parsedPayload.password, user.password)) {
    return createError({ message: 'Invalid email or password.', statusCode: 401 });
  }

  return {
    token: createAuthToken(user),
    userId: user.id,
  };
}

export async function checkUsernameAvailability({ username }) {
  const user = await fetchUser({ username });

  return { available: !user };
}

export async function validateEmail({ email }) {
  const user = await fetchUser({ email });

  if (!user) return createError({ message: 'Email not found.', statusCode: 404 });

  // TODO: verify with otp later

  // TODO: send welcome email

  return { valid: true };
}
