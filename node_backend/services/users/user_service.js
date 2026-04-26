import { fetchUser } from '#models/users';
import { createError } from '#utils/error_utils';

export async function getCurrentUser({ userId }) {
  const user = await fetchUser({ id: Number(userId) });

  if (!user) {
    return createError({ message: 'The current session is invalid.', statusCode: 401 });
  }

  return user;
}
