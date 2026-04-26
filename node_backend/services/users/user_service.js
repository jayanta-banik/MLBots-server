import { fetchUser, updateUser } from '#models/users';
import { createError } from '#utils/error_utils';
import { transformKeysToCamelCase } from '#utils/object_handler';

export async function getCurrentUser({ userId }) {
  const user = await fetchUser({ id: userId });

  if (!user) return createError({ message: 'The current session is invalid.', statusCode: 401 });

  return transformKeysToCamelCase(user);
}

export async function activateUser({ userId }) {
  const user = await fetchUser({ id: userId });

  if (!user) return createError({ message: 'User not found.', statusCode: 404 });

  if (user.is_active) return transformKeysToCamelCase(user);

  const activatedUser = await updateUser({ id: user.id, isActive: true });

  return transformKeysToCamelCase(activatedUser);
}
