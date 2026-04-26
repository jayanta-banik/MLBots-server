import prisma from '#prisma/index';

export async function fetchUser({ email, id, includePassword = false, username }) {
  const where = id ? { id } : email ? { email } : { username };

  return prisma.user.findUnique({
    where,
    select: {
      id: true,
      dob: true,
      email: true,
      first_name: true,
      last_name: true,
      username: true,
      password: includePassword,
      created_at: true,
      updated_at: true,
    },
  });
}
