import prisma from '../prisma/index.js';

export async function createUser({ email, firstName, passwordHash, username }) {
  return prisma.user.create({
    data: {
      email,
      first_name: firstName,
      password: passwordHash,
      username,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      username: true,
      created_at: true,
      updated_at: true,
    },
  });
}
