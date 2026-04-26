import prisma from '#prisma';

export default async function updateUser({ dateOfBirth, email, firstName, lastName, passwordHash, username }) {
  const data = {
    first_name: firstName,
    last_name: lastName,
    password: passwordHash,
    // username, // later have ui to change username, but not now
  };

  return prisma.users.update({
    where: { email, username },
    data,
  });
}
