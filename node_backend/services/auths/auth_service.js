import { createUser, fetchUser } from '#models/users';
import { createAuthToken, hashPassword, validateLoginPayload, verifyPassword } from '#utils/auth_utils';
import { createError } from '#utils/error_utils';

export async function signupUser(payload) {
  const { email, password, username } = payload;
  const existingUser = await fetchUser({ email });

  if (existingUser) {
    return createError({ message: 'An account with that email already exists.', statusCode: 409 });
  }

  const existingUsername = await fetchUser({ username });

  if (existingUsername) {
    return createError({ message: 'That username is already taken.', statusCode: 409 });
  }

  const user = await createUser({
    ...payload,
    passwordHash: hashPassword(password),
  });

  return { token: createAuthToken(user) };
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
