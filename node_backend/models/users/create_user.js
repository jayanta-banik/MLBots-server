import { parseDateOfBirth } from '#utils/datetime_handler';

import prisma from '#prisma';

export default async function createUser({ dateOfBirth, email, firstName, lastName, passwordHash, username }) {
  const data = {
    dob: parseDateOfBirth({ value: dateOfBirth }),
    first_name: firstName,
    last_name: lastName,
    password: passwordHash,
    email,
    username,
    // Create should not add is_active equal to true. Users should be activated separately, and this allows us to have users that are not active yet (e.g. waiting for email verification). db default is false, so no need to set it here.
  };

  return prisma.users.upsert({
    where: { email, username },
    update: data,
    create: data,
  });
}
