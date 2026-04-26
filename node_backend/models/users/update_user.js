import prisma from '#prisma';

export default async function updateUser({ email, firstName, lastName, passwordHash, username, isActive }) {
  const data = {
    first_name: firstName,
    last_name: lastName,
    password: passwordHash,
    is_active: isActive,
    // username, // later have ui to change username, but not now
  };

  return prisma.users.update({
    where: { email, username },
    data,
  });
}
