import { fieldEncryptionExtension } from 'prisma-field-encryption';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
}).$extends(fieldEncryptionExtension());

export default prisma;
