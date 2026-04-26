import prisma from '#prisma/index';

export async function createUser({ dateOfBirth, email, firstName, lastName, passwordHash, username }) {
  return prisma.user.create({
    data: {
      dob: dateOfBirth,
      email,
      first_name: firstName,
      last_name: lastName,
      password: passwordHash,
      username,
    },
  });
}
