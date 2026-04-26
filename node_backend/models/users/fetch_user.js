import prisma from '#prisma';

export default async function fetchUser({ email, id, username, includePassword = false }) {
  const where = {};
  if (id) where.id = id;
  if (email) where.email = email;
  if (username) where.username = username;

  return prisma.users.findUnique({
    where,
    select: {
      id: true,
      dob: true,
      email: true,
      first_name: true,
      is_active: true,
      last_name: true,
      username: true,
      password: includePassword,
      created_at: true,
      updated_at: true,
    },
  });
}
