import prisma from '../prisma/index.js';

export async function fetchUser({ email, id, includePassword = false }) {
  const where = id ? { id } : { email };

  return prisma.user.findUnique({
    where,
    select: {
      id: true,
      email: true,
      first_name: true,
      username: true,
      password: includePassword,
      created_at: true,
      updated_at: true,
    },
  });
}
