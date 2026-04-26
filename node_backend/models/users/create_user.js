import prisma from '#prisma';
import { parseDateOfBirth } from '#utils/datetime_handler';

export default async function createUser({ dateOfBirth, email, firstName, lastName, passwordHash, username }) {
  const data = {
    dob: parseDateOfBirth({ value: dateOfBirth }),
    first_name: firstName,
    last_name: lastName,
    password: passwordHash,
    email,
    username,
  };

  return prisma.users.upsert({
    where: { email, username },
    update: data,
    create: data,
  });
}
